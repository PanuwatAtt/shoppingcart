namespace ShoppingSystem.Models
{
    public class OrderRequest
    {
        public List<CartItemRequest> Items { get; set; } = new();
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Qty { get; set; }
    }
}
