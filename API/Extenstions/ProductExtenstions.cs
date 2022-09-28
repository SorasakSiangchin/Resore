using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extenstions
{
    public static class ProductExtenstions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query , string orderBy)
        {
            if(string.IsNullOrEmpty(orderBy)) return query.OrderBy(e => e.Name);

            query = orderBy switch 
            {
                "price" => query.OrderBy(p => p.Price) ,
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };
             
            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;

                                              // Trim เป็นการตัดช่องว่างทิ้ง
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            // สร้าง List 
            var brandList = new List<string>();
            var typeList = new List<string>();

            if (!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());

            if (!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            //กระบวนการวนลูปอยู่ภายใน (ทำอยู่ขา้งใน)
            query = query.Where(p => brandList.Count == 0  || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count  == 0  || typeList.Contains(p.Type.ToLower()));
            //brandList.Contains(p.Brand.ToLower()) ค้น brand ที่มีอยู่ภายใน brandList  

            return query;
        }


    }
}