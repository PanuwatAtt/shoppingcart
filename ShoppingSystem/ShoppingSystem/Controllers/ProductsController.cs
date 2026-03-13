using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShoppingSystem.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingSystem.Data;
using ShoppingSystem.Models;

namespace ShoppingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. ดึงรายการสินค้าทั้งหมด พร้อมข้อมูล Stock
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Stock) // Join กับตาราง Stock
                .Select(p => new {
                    p.Id,
                    p.Sku,
                    p.Name,
                    p.Price,
                    StockQuantity = p.Stock != null ? p.Stock.Quantity : 0
                })
                .ToListAsync();

            return Ok(products);
        }

        // 2. ดึงข้อมูลสินค้าตัวเดียวตาม ID (เอาไว้เช็ค Stock ก่อนเพิ่มลงตะกร้า)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Stock)
                .Where(p => p.Id == id)
                .Select(p => new {
                    p.Id,
                    p.Sku,
                    p.Name,
                    p.Price,
                    StockQuantity = p.Stock != null ? p.Stock.Quantity : 0
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();

            return Ok(product);
        }
    }
}
