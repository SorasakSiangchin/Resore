using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        //ICollection เป็นแม่ของ List
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity) 
        { 
            if (Items.All(item => item.ProductId != product.Id)) 
            { 
                //กำหนดค่าให้กับ ProductId โดยอัตโนมัติ
                Items.Add(new BasketItem { Product = product, Quantity = quantity }); 
            } 
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id); 
            if (existingItem != null) existingItem.Quantity += quantity; 
        } 

        public void RemoveItem(int productId, int quantity) 
        { 
            var item = Items.FirstOrDefault(item => item.ProductId == productId); 
            if (item == null) return; 
            item.Quantity -= quantity; 
            if (item.Quantity <= 0) Items.Remove(item); 
        } 
    }
}