"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. เพิ่มสินค้า (ห้ามเพิ่มถ้าสต็อกไม่พอ)
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      // เช็คเงื่อนไขสต็อก
      if (currentQty + 1 > product.stockQuantity) {
        alert("สินค้าในสต็อกไม่เพียงพอ!");
        return prevCart;
      }

      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 2. ปรับเพิ่ม/ลดจำนวน
  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          // เช็คขอบเขต: ต้องไม่น้อยกว่า 1 และไม่เกินสต็อก
          if (newQty > 0 && newQty <= item.stockQuantity) {
            return { ...item, quantity: newQty };
          }
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};