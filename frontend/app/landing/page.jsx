import { Calculator, Shield, Clock, TrendingUp, CheckCircle } from 'lucide-react';

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-slate-900">SheetMetal Pro</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            Precise Sheet Metal Calculations in Seconds
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Professional-grade calculator for sheet metal fabrication. Get accurate material requirements, wastage estimates, and cost projections instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onNavigate('signup')}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-8 py-4 bg-white text-slate-700 rounded-lg hover:bg-slate-50 font-semibold text-lg transition-all border-2 border-slate-200 hover:border-slate-300"
            >
              View Pricing
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            1-day free trial. No credit card required.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Calculations</h3>
            <p className="text-slate-600 leading-relaxed">
              Get immediate results for surface area, material requirements, and wastage estimates with our advanced algorithms.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Accurate Results</h3>
            <p className="text-slate-600 leading-relaxed">
              Industry-standard formulas ensure precision in every calculation, helping you minimize material waste.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Save History</h3>
            <p className="text-slate-600 leading-relaxed">
              Track all your calculations and access them anytime. Perfect for referencing past projects.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-300 text-lg">
              Comprehensive tools for professional sheet metal fabrication
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Precise surface area calculations',
              'Material requirement estimates',
              'Wastage percentage tracking',
              'Multi-thickness support',
              'Calculation history & export',
              'Mobile-friendly interface',
              'Real-time results',
              'Professional reports',
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-linear-to-r from-emerald-600 to-emerald-700 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
            Join professionals who trust SheetMetal Pro for their fabrication calculations. Start your free trial today.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-slate-50 font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-semibold text-white">SheetMetal Pro</span>
          </div>
          <p className="text-sm">
            © 2025 SheetMetal Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
