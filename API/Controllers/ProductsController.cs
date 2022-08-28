using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // ใช้ validate
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _storeContext;
        public ProductsController(StoreContext storeContext)
        {
            _storeContext = storeContext;
            
        }

        [HttpGet]
        //ActionResult<IEnumerable<Product>>
        public async Task<IActionResult>  GetProducts () {
              //Ok หมายถึง รหัส 200
            return Ok(await _storeContext.Products.ToListAsync());
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await _storeContext.Products.FindAsync(id);
        }        
    }
}