using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{    
    // สินค้าที่เราสั่งซื้อ
    // ถ้าตารางอื่นเรียกใช้ให้ใช้ Primary key ของตารางนั้น
    [Owned] //Primary key ใช้จากตารางอื่นที่เรียกใช้
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
    }
}