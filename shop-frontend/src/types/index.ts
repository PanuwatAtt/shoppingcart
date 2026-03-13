export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}