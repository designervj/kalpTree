"use client";

import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Lock,
  ShoppingBag,
  Check,
  ChevronRight,
  Truck,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSearchParams } from "next/navigation";

const ModernCheckout = () => {
  const {
    listProduct: products,
    isProductLoading,
    isCartLoading,
  } = useSelector((state: RootState) => state.product);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveInfo: false,
    sameAsBilling: true,
  });
  const searchParams = useSearchParams();
  const checkoutData = searchParams.get("data");
  const cart = useMemo(() => {
    const obj = JSON.parse(decodeURIComponent(checkoutData!));
    if (products.length > 0) {
      return obj.map((singlecart) => {
        const product = products.find((d) => d._id == singlecart.productId);
        const variant = product?.variants.find(
          (d) => d._id == singlecart.variantId,
        );

        return {
          ...singlecart,
          productId: product,
          variantId: variant,
        };
      });
    }
  }, [checkoutData, products]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const { productId, variantId } = item;
      const product = products.find((d) => d._id == item.productId._id);
      const variant = product.variants.find((d) => d._id == item.variantId._id);
      const price = parseInt(variant.price);
      return total + price * item.quantity;
    }, 0);
  };

  // Demo

  // const orderItems = [
  //   {
  //     id: 1,
  //     name: "Wireless Headphones Pro",
  //     price: 129.99,
  //     quantity: 1,
  //     image:
  //       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  //   },
  //   {
  //     id: 2,
  //     name: "Smart Watch Series 5",
  //     price: 399.99,
  //     quantity: 1,
  //     image:
  //       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
  //   },
  // ];

  // const subtotal = orderItems.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0,
  // );

  // const shipping = 9.99;
  // const tax = subtotal * 0.08;
  // const total = subtotal + shipping + tax;

  const steps = [
    { number: 1, title: "Information", icon: User },
    { number: 2, title: "Shipping", icon: Truck },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStepComplete = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  console.log(cart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h1>
          <p className="text-slate-600 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Your information is safe and encrypted
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                          ? "bg-green-500 shadow-lg shadow-green-200"
                          : isActive
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200"
                            : "bg-slate-200"
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${isActive || isCompleted ? "text-white" : "text-slate-400"}`}
                        />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${isActive
                          ? "text-indigo-600"
                          : isCompleted
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-slate-200"
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Step 1: Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Contact Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Street Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St"
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          placeholder="Apt 4B"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Delivery Method
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            defaultChecked
                            className="w-4 h-4 text-indigo-600"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              Standard Shipping
                            </p>
                            <p className="text-sm text-slate-600">
                              5-7 business days
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">
                          $9.99
                        </span>
                      </label>
                      <label className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            className="w-4 h-4 text-indigo-600"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              Express Shipping
                            </p>
                            <p className="text-sm text-slate-600">
                              2-3 business days
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900">
                          $19.99
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Payment Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="3"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <label className="text-sm text-slate-700">
                      Save payment information for future purchases
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleStepComplete}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  {currentStep === 3 ? "Place Order" : "Continue"}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 z-99">
                {cart &&
                  cart.length > 0 &&
                  cart.map((item, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className=" w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 z-999 -left-1 w-6 h-6 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {item.productId.title}
                        </p>
                        <p className="text-slate-600 text-sm">
                          ${Number(item.variantId.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              {/* 
              <div className="space-y-3 mb-6 pb-6 border-t border-b border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div> */}

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  $ {getTotalPrice()}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCheckout;
