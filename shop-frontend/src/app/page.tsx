"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    
    axios.get('https://localhost:7163/api/products') 
      .then(res => setProducts(res.data))
      .catch(err => console.error("ไม่สามารถดึงข้อมูลได้:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">สินค้ามาใหม่</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-2xl font-bold text-blue-600 mb-4">{product.price} บาท</p>
            <p className="text-sm text-gray-500 mb-4">สต็อกคงเหลือ: {product.stockQuantity}</p>
            
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-400 mt-20">กำลังโหลดข้อมูล หรือ ไม่พบสินค้า...</p>
      )}
    </div>
  );
}
