using API.Data;
using API.DTOs;
using API.Entities;
using API.Extenstions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public BasketController(StoreContext storeContext)
        {
            _storeContext = storeContext;

        }

        //เพื่อให้มันรัเฟรช
        [HttpGet("[action]", Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            // var basket = await _storeContext.Baskets.FirstOrDefaultAsync(e => e.Id == 1);
            var basket = await RetrieveBasket(GetbuyerId());
            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

        // เพิ่มสินค้าเข้าตะกร้า
        [HttpPost] 
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity) 
        { 
            //ขั้นตอนการเพิ่มสินค้าเข้าตะกร้า
            //get basket 
            //get product 
            //add item 
            //save changes 

            // เป็นการ Check ตะกร้าว่ามีหรือป่าว
            var basket = await RetrieveBasket(GetbuyerId()); 
            // ถ้าไม่มีให้สร้าง
            if (basket == null) basket = CreateBasket(); 
            var product = await _storeContext.Products.FindAsync(productId); 

            if (product == null) return BadRequest(new ProblemDetails{Title="Product Not found"});
            
            basket.AddItem(product, quantity); 
            var result = await _storeContext.SaveChangesAsync() > 0; 
            //Redirect to Route 
            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto()); 
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" }); 
        } 
        
        [HttpDelete] 
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity) 
        { 
            var basket = await RetrieveBasket(GetbuyerId()); 
            if (basket == null) return NotFound(); 
            basket.RemoveItem(productId, quantity); 
            var result = await _storeContext.SaveChangesAsync() > 0; 
            if (result) return Ok(); 
            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" }); 
        } 
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            var basket = await _storeContext.Baskets
                   .Include(i => i.Items)
                   .ThenInclude(p => p.Product)
                   // เรียกใช้ Cookies => Request.Cookies
                   .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return basket;
        }

        // private Basket CreateBasket()
        // {
        //     // สร้ำงรหัสปลอม
        //     var buyerId = Guid.NewGuid().ToString();
        //     // CookieOptions เป็น class ของ C#
        //     var cookieOptions = new CookieOptions
        //     {
        //         IsEssential = true,
        //         // AddDays เพิ่มไปอีก 30 วัน
        //         Expires = DateTime.Now.AddDays(30)
        //     };
        //     // นำค่าใส่เข้าไปใน local
        //     Response.Cookies.Append("buyerId", buyerId, cookieOptions);
        //     var basket = new Basket() { BuyerId = buyerId };
        //     _storeContext.Baskets.Add(basket);
        //     return basket;
        // }
        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId))
            {
            buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _storeContext.Baskets.Add(basket);
            return basket;
        }

        private string GetbuyerId()
        {
            // (??) ถ้าเป็น Null
            return User.Identity.Name ?? Request.Cookies["buyerId"];
        }

        




    }
}