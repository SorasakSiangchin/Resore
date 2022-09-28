using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extenstions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _storeContext;
        public ProductsController(StoreContext storeContext)
        {
            _storeContext = storeContext;

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _storeContext.Products
                        .Sort(productParams.OrderBy)
                        .Search(productParams.SearchTerm)
                        .Filter(productParams.Brands, productParams.Types)
                        .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query,
                           productParams.PageNumber, productParams.PageSize);

            //เพื่อส่งค่าการแบ่งหน้าไปให้ Axios Interceptor นำไปใช้ต่อ
            Response.AddPaginationHeader(products.MetaData);

            return Ok(products);
        }



        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<Product>> GetProducts(int id)
        {
            return await _storeContext.Products.FindAsync(id);
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            //อ่านค่าที่ซ้ำกันมาเพียงค่าเดียว
            // Distinct เอาที่มันแตกต่างกัน
            var brands = await _storeContext.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _storeContext.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _storeContext.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }

    }
}