"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SteporaCartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Stonewind Trekker",
      category: "Jacket",
      price: 99.29,
      quantity: 1,
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=400&auto=format&fit=crop",
     
      color: "Ocean Blue",
      checked: true,
    },
    {
      id: 2,
      name: "Core Compression Shirt",
      category: "Base Layers",
      price: 79.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
      color: "Dark Navy",
      checked: true,
    },
    {
      id: 3,
      name: "RidgePro 28",
      category: "Backpack",
      price: 58.98,
      quantity: 1,
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=400&auto=format&fit=crop",
      color: "Silver Grey",
      checked: false,
    },

     {
      id: 3,
      name: "RidgePro 28",
      category: "Backpack",
      price: 58.98,
      quantity: 1,
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=400&auto=format&fit=crop",
      color: "Silver Grey",
      checked: false,
    },

     {
      id: 3,
      name: "RidgePro 28",
      category: "Backpack",
      price: 58.98,
      quantity: 1,
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=80&w=400&auto=format&fit=crop",
      color: "Silver Grey",
      checked: false,
    },
    
  ]);

  const toggleCheck = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Calculations based on the image values
  const checkedItems = cartItems.filter((item) => item.checked);
  const subtotalProduct = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryPrice = subtotalProduct > 0 ? 3.00 : 0;
  const taxes = subtotalProduct > 0 ? 2.00 : 0;
  const discount = subtotalProduct > 0 ? 38.00 : 0;
  const serviceCharge = subtotalProduct > 0 ? 1.00 : 0;
  const total = subtotalProduct + deliveryPrice + taxes - discount + serviceCharge;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#111]">
      {/* Black Promo Bar */}
      

      {/* Navbar */}


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center">
            <div className="mb-10">
              <h1 className="text-[32px] font-bold ">Shopping Cart</h1>
              <p>Review your items, update quantity, then checkout securely.</p>
            </div>
          
              <Button variant="outline">Continue shopping</Button>
            </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Shopping Cart Section */}

          
          <div className="lg:col-span-7">
           

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-start gap-6">
                    {/* Checkbox */}
                    <div className="pt-12">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#DAF38C] focus:ring-[#DAF38C] cursor-pointer"
                      />
                    </div>

                    {/* Image Container */}
                    <div className="w-32 h-32 bg-[#F3F4F6] rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow pt-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold leading-tight mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">
                            Category : <span className="text-gray-400 font-normal">{item.category}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Color : <span className="text-gray-400 font-normal">{item.color}</span>
                          </p>
                        </div>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="outline"
                          // className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-4 border border-gray-200 rounded-full px-3 py-1 bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

              <div className="space-y-4 text-[16px]">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal Product</span>
                  <span className="font-bold text-[#111]">${subtotalProduct.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Price Delivery</span>
                  <span className="font-bold text-[#111]">${deliveryPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Taxes</span>
                  <span className="font-bold text-[#111]">${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Total Discount</span>
                  <span className="font-bold text-[#111]">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Service Charge</span>
                  <span className="font-bold text-[#111]">${serviceCharge.toFixed(2)}</span>
                </div>

                <div className="pt-8 border-t border-gray-100 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold">${total < 0 ? "0.00" : total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-5 items-center justify-center flexf py-6">
                Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SteporaCartPage;