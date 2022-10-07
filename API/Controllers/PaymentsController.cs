using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extenstions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
                private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;

        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration configuration)
        {
            _context = context;
            _config = configuration;
            _paymentService = paymentService; // ตัวบริการชำระเงิน
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            // ดึงตะกร้ามา
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync(); 

            if (basket == null) return NotFound();
	        // ส่งตะกร้าไปให้ stripe จะได้ใบส่งของมา
            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
            // เช็ค intent ว่ามีหรือป่าว
            if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });
	        // มาเช็คอีกรอบ เช็ครหัสใบส่งของ
            if (!string.IsNullOrEmpty(intent.Id))
            {
                basket.PaymentIntentId = intent.Id; // เอาใบส่งของใส่ตะกร้า
                basket.ClientSecret = intent.ClientSecret; // เอารหัสลับใส่ตะกร้า
            }
	
            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });

            return basket.MapBasketToDto(); // ส่งตะกร้าปลอมออกไป
        }

        [HttpPost("webhook")] //ใช้ตามเขาไป
        public async Task<ActionResult> StripeWebhook()
        {
            #region รับค่าเข้ามาจาก Webhook และได้รับออกเจค
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            // 
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                _config["StripeSettings:WhSecret"],throwOnApiVersionMismatch:false);
            var charge = (Charge)stripeEvent.Data.Object; // ให้ส่ง Success มา
            #endregion

            //ค้นหา order ตาม PaymentIntentId
            var order = await _context.Orders.FirstOrDefaultAsync(x =>
                x.PaymentIntentId == charge.PaymentIntentId);

            //เปลี่ยน OrderStatus ตามเหตุการณ์ที่ได้รับมา
            if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

    }
}