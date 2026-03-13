using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoppingSystem.Models
{
    public class Stock
    {
        [Key]
        [ForeignKey("Product")]
        public int ProductId { get; set; } // ใช้ ID เดียวกับ Product
        public int Quantity { get; set; } // จำนวนคงเหลือ

        public virtual Product? Product { get; set; }
    }
}
