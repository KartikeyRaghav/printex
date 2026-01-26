"use client";

import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Plus, Minus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AddDevices({ onNavigate }) {
  const { subscription, getAvailableDeviceSlots } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const availableSlots = getAvailableDeviceSlots();

  let pricePerDevice = 199;
  let planName = "Monthly";

  if (subscription) {
    switch (subscription.plan_type) {
      case "quarterly":
        pricePerDevice = 199;
        planName = "Quarterly";
        break;
      case "half_yearly":
        pricePerDevice = 149;
        planName = "Half Yearly";
        break;
      case "yearly":
        pricePerDevice = 99;
        planName = "Yearly";
        break;
      default:
        pricePerDevice = 199;
    }
  }

  const totalPrice = quantity * pricePerDevice;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);

    alert(
      `Additional Device Slots Purchase\n\n` +
        `Plan: ${planName}\n` +
        `Quantity: ${quantity} device slot${quantity > 1 ? "s" : ""}\n` +
        `Price per device: ₹${pricePerDevice}\n` +
        `Total Amount: ₹${totalPrice}\n\n` +
        `This is where Razorpay payment gateway will be integrated.\n` +
        `Upon successful payment, ${quantity} additional device slot${quantity > 1 ? "s will" : " will"} be added to your account.`,
    );

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900">
              Add Device Slots
            </h1>
            <button
              onClick={() => onNavigate("device-management")}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Purchase Additional Device Slots
          </h2>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-emerald-700 mb-2 font-semibold">
              Your Current Plan
            </p>
            <p className="text-lg font-bold text-emerald-900 mb-1">
              {planName} Plan
            </p>
            <p className="text-sm text-emerald-600">
              Price per additional device:{" "}
              <span className="font-bold">₹{pricePerDevice}</span>
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              How many device slots do you need?
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
              <div className="flex items-center justify-center space-x-6 mb-8">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                  className="p-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-6 w-6" />
                </button>

                <div className="text-center">
                  <p className="text-4xl font-bold text-slate-900">
                    {quantity}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    device slot{quantity > 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity === 10}
                  className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-700">
                    Devices × ₹{pricePerDevice}
                  </span>
                  <span className="text-slate-700">
                    ₹{(quantity * pricePerDevice).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-emerald-600">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading || !subscription}
            className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center space-x-2"
          >
            <CreditCard className="h-6 w-6" />
            <span>
              {loading ? "Processing..." : `Purchase for ₹${totalPrice}`}
            </span>
          </button>

          <p className="text-sm text-slate-500 text-center mt-4">
            Secure payment powered by Razorpay
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            About Device Slots
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Additional device slots are added immediately after payment
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Device slots are valid until your subscription ends</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>You can add multiple device slots at once</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Device limits help prevent account sharing</span>
            </li>
            <li className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                When your subscription renews, you'll need to repurchase slots
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Device Slot Pricing by Plan
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <span className="font-semibold">Monthly Plan:</span> ₹199 per
              device
            </p>
            <p>
              <span className="font-semibold">Quarterly Plan:</span> ₹199 per
              device
            </p>
            <p>
              <span className="font-semibold">Half Yearly Plan:</span> ₹149 per
              device (25% off)
            </p>
            <p>
              <span className="font-semibold">Yearly Plan:</span> ₹99 per device
              (50% off)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
