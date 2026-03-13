using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoppingSystem.Data;
using ShoppingSystem.Models;

namespace ShoppingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(ApplicationDbContext context) : ControllerBase
    {
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] OrderRequest request)
        {
            if (request.Items == null || !request.Items.Any())
                return BadRequest("ไม่มีรายการสินค้าในตะกร้า");

            // เริ่มต้น Transaction เพื่อความปลอดภัยของข้อมูล
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                decimal totalAmount = 0;

                foreach (var item in request.Items)
                {
                    // ดึงข้อมูลสินค้าพร้อมสต็อก
                    var product = await context.Products
                        .Include(p => p.Stock)
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (product == null)
                        return NotFound($"ไม่พบสินค้าไอดี {item.ProductId}");

                    // ตรวจสอบสต็อก (Logic สำคัญตามโจทย์)
                    if (product.Stock == null || product.Stock.Quantity < item.Qty)
                    {
                        return BadRequest($"สินค้า {product.Name} มีจำนวนไม่พอ (คงเหลือ {product.Stock?.Quantity ?? 0})");
                    }

                    // คำนวณยอดรวม
                    totalAmount += product.Price * item.Qty;

                    // ตัดสต็อกจริง
                    product.Stock.Quantity -= item.Qty;
                }

                // บันทึกการเปลี่ยนแปลงทั้งหมดลง Database
                await context.SaveChangesAsync();

                // ยืนยันการทำรายการทั้งหมด (Commit)
                await transaction.CommitAsync();

                return Ok(new
                {
                    Message = "ชำระเงินสำเร็จ",
                    TotalAmount = totalAmount
                });
            }
            catch (Exception ex)
            {
                // หากเกิดข้อผิดพลาด ให้ยกเลิกการแก้ไขสต็อกทั้งหมด (Rollback)
                await transaction.RollbackAsync();
                return StatusCode(500, $"เกิดข้อผิดพลาดภายในระบบ: {ex.Message}");
            }
        }
    }
}