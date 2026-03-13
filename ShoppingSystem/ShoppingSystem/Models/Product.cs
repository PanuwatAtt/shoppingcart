namespace ShoppingSystem.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Sku { get; set; } = string.Empty; // รหัสสินค้า
        public string Name { get; set; } = string.Empty; // ชื่อสินค้า
        public decimal Price { get; set; } // ราคาขายต่อหน่วย

        // เชื่อมโยงกับ Stock (1-to-1)
        public virtual Stock? Stock { get; set; }
    }
}
