"use client";
import { useState, useEffect } from "react";
import {
  Calculator as CalcIcon,
  LogOut,
  CreditCard,
  History,
  Clock,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Calculator({ onNavigate }) {
  const { user, profile, subscription, hasAccess, signOut, registerDevice } =
    useAuth();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState("");
  const [result, setResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceError, setDeviceError] = useState(null);

  const trialTimeRemaining = profile
    ? Math.max(0, new Date(profile.trial_ends_at).getTime() - Date.now())
    : 0;
  const hoursRemaining = Math.floor(trialTimeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(
    (trialTimeRemaining % (1000 * 60 * 60)) / (1000 * 60),
  );

  const isTrialActive = !subscription && trialTimeRemaining > 0;
  const subscriptionActive = subscription?.status === "active";

  useEffect(() => {
    if (!hasAccess) {
      onNavigate("pricing");
    }
  }, [hasAccess, onNavigate]);

  useEffect(() => {
    if (user && !deviceError) {
      (async () => {
        try {
          await registerDevice();
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "DEVICE_LIMIT_EXCEEDED"
          ) {
            setDeviceError("device_limit_exceeded");
          }
        }
      })();
    }
  }, [user, registerDevice]);

  const fetchHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("calculation_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setHistory(data);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, user]);

  const calculateSheetMetal = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const t = parseFloat(thickness);

    if (isNaN(l) || isNaN(w) || isNaN(h) || isNaN(t)) {
      return;
    }

    const surfaceArea = 2 * (l * w + l * h + w * h);
    const sheetArea = surfaceArea + 4 * t * (l + w + h);
    const materialRequired = sheetArea * t;
    const wastage = ((sheetArea - surfaceArea) / surfaceArea) * 100;

    const calculationResult = {
      surfaceArea: Math.round(surfaceArea * 100) / 100,
      sheetArea: Math.round(sheetArea * 100) / 100,
      materialRequired: Math.round(materialRequired * 100) / 100,
      wastage: Math.round(wastage * 100) / 100,
    };

    setResult(calculationResult);
    saveCalculation(l, w, h, t, calculationResult);
  };

  const saveCalculation = async (l, w, h, t, result) => {
    if (!user) return;

    setLoading(true);
    await supabase.from("calculation_history").insert({
      user_id: user.id,
      length: l,
      width: w,
      height: h,
      material_thickness: t,
      result: result,
    });
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate("landing");
  };

  if (deviceError === "device_limit_exceeded") {
    return <div className="hidden" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <CalcIcon className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-slate-900">
                SheetMetal Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <History className="h-5 w-5" />
                <span className="hidden sm:inline">History</span>
              </button>
              <button
                onClick={() => onNavigate("device-management")}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Smartphone className="h-5 w-5" />
                <span className="hidden sm:inline">Devices</span>
              </button>
              {!subscriptionActive && (
                <button
                  onClick={() => onNavigate("pricing")}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isTrialActive && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">Free Trial Active:</span>{" "}
                  {hoursRemaining}h {minutesRemaining}m remaining
                </p>
              </div>
              <button
                onClick={() => onNavigate("pricing")}
                className="text-sm font-semibold text-amber-900 hover:text-amber-800"
              >
                Upgrade Now →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showHistory ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Calculation History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Back to Calculator
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-slate-600 text-center py-12">
                No calculations yet. Start calculating to see your history.
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((calc) => (
                  <div
                    key={calc.id}
                    className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          {new Date(calc.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">
                          Dimensions
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {calc.length} × {calc.width} × {calc.height}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">
                          Thickness
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {calc.material_thickness}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">
                          Surface Area
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {calc.result.surfaceArea} sq units
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">
                          Material Req.
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {calc.result.materialRequired} cu units
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Box Dimensions
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Length (units)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Enter length"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Width (units)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Enter width"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Height (units)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Enter height"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Material Thickness (units)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Enter thickness"
                  />
                </div>

                <button
                  onClick={calculateSheetMetal}
                  disabled={
                    loading || !length || !width || !height || !thickness
                  }
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Results
              </h2>

              {result ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <p className="text-sm text-emerald-700 mb-1">
                      Surface Area
                    </p>
                    <p className="text-3xl font-bold text-emerald-900">
                      {result.surfaceArea}
                    </p>
                    <p className="text-sm text-emerald-600">square units</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-sm text-blue-700 mb-1">
                      Sheet Area Required
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {result.sheetArea}
                    </p>
                    <p className="text-sm text-blue-600">square units</p>
                  </div>

                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-6">
                    <p className="text-sm text-violet-700 mb-1">
                      Material Volume
                    </p>
                    <p className="text-3xl font-bold text-violet-900">
                      {result.materialRequired}
                    </p>
                    <p className="text-sm text-violet-600">cubic units</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <p className="text-sm text-amber-700 mb-1">Wastage</p>
                    <p className="text-3xl font-bold text-amber-900">
                      {result.wastage}%
                    </p>
                    <p className="text-sm text-amber-600">of surface area</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-slate-500">
                    Enter dimensions and click Calculate to see results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
