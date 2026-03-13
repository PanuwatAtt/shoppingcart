"use client";
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      
      const response = await axios.post('https://localhost:7163/api/Orders/checkout', {
        items: cart.map(item => ({
          productId: item.id,
          qty: item.quantity
        }))
      });

      alert("ชำระเงินสำเร็จ: " + response.data.message);
      clearCart(); // ล้างตะกร้า
      router.push('/'); // กลับหน้าแรกไปดูสต็อกที่ลดลง
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data || "เกิดข้อผิดพลาดในการเชื่อมต่อ API";
      alert(errorMsg);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ตะกร้าสินค้าของคุณ</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-blue-600 font-bold">{item.price} บาท</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 border rounded">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 border rounded">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2">ลบ</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-xl text-right">
            <p className="text-xl mb-4">ยอดรวมทั้งหมด: <span className="font-bold text-2xl">{total} บาท</span></p>
            <button 
              onClick={handleCheckout}
              className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition w-full md:w-auto"
            >
              ยืนยันการสั่งซื้อ (Checkout)
            </button>
          </div>
        </>
      )}
    </div>
  );
}