using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class CreateOrderDto
    {
        public bool SaveAddress { get; set; } // ของไหม่จะมาทับของเก่า
        public ShippingAddress ShippingAddress { get; set; }
    }
}