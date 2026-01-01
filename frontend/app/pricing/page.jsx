import { useState } from 'react';
import { Calculator, Check, Clock, ArrowLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    id: '1',
    name: 'Monthly',
    price: 499,
    period: 'month',
    duration: 'monthly',
    includedDevices: 2,
    pricePerAdditionalDevice: 199,
    features: [
      'Unlimited calculations',
      'Calculation history',
      'Export results',
      'Email support',
      'Mobile access',
    ],
  },
  {
    id: '2',
    name: 'Quarterly',
    price: 1299,
    period: '3 months',
    duration: 'quarterly',
    savings: 'Save 13%',
    popular: true,
    includedDevices: 2,
    pricePerAdditionalDevice: 199,
    features: [
      'Unlimited calculations',
      'Calculation history',
      'Export results',
      'Priority email support',
      'Mobile access',
      'Advanced analytics',
    ],
  },
  {
    id: '3',
    name: 'Half Yearly',
    price: 2399,
    period: '6 months',
    duration: 'half_yearly',
    savings: 'Save 20%',
    includedDevices: 3,
    pricePerAdditionalDevice: 149,
    features: [
      'Unlimited calculations',
      'Calculation history',
      'Export results',
      'Priority support',
      'Mobile access',
      'Advanced analytics',
      'API access',
    ],
  },
  {
    id: '4',
    name: 'Yearly',
    price: 3999,
    period: 'year',
    duration: 'yearly',
    savings: 'Save 33%',
    includedDevices: 5,
    pricePerAdditionalDevice: 99,
    features: [
      'Unlimited calculations',
      'Calculation history',
      'Export results',
      'Priority support',
      'Mobile access',
      'Advanced analytics',
      'API access',
      'Custom integrations',
    ],
  },
];

export default function Pricing({ onNavigate }) {
  const { user, profile, subscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const trialTimeRemaining = profile ? Math.max(0, new Date(profile.trial_ends_at).getTime() - Date.now()) : 0;
  const isTrialActive = trialTimeRemaining > 0;
  const hoursRemaining = Math.floor(trialTimeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((trialTimeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePurchase = async () => {
    if (!selectedPlan || !user) return;

    setLoading(true);

    alert(
      `Razorpay Integration Placeholder\n\n` +
      `Selected Plan: ${selectedPlan.name}\n` +
      `Amount: ₹${selectedPlan.price}\n` +
      `Duration: ${selectedPlan.period}\n\n` +
      `This is where Razorpay payment gateway will be integrated.\n` +
      `The payment will create/update the subscription in the database.`
    );

    setLoading(false);
  };

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
              {user ? (
                <button
                  onClick={() => onNavigate('calculator')}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Calculator</span>
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {user && isTrialActive && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-emerald-900">
                <span className="font-semibold">Free Trial Active:</span> {hoursRemaining}h {minutesRemaining}m remaining
              </p>
            </div>
          </div>
        </div>
      )}

      {user && subscription && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center space-x-3">
              <Check className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Active Subscription:</span> {subscription.plan_type.replace('_', ' ')} plan
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-600">
            Select the perfect plan for your sheet metal calculation needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg border-2 transition-all ${
                selectedPlan?.id === plan.id
                  ? 'border-emerald-600 shadow-xl transform scale-105'
                  : 'border-slate-200 hover:border-slate-300'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                {plan.savings && (
                  <p className="text-sm text-emerald-600 font-semibold mb-2">{plan.savings}</p>
                )}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-600">/{plan.period}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-700 font-semibold">
                    {plan.includedDevices} devices included
                  </p>
                  <p className="text-xs text-blue-600">
                    ₹{plan.pricePerAdditionalDevice} per extra device
                  </p>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                    selectedPlan?.id === plan.id
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Complete Your Purchase</h2>

            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-700 font-medium">Selected Plan:</span>
                <span className="text-slate-900 font-bold">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-700 font-medium">Duration:</span>
                <span className="text-slate-900">{selectedPlan.period}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
                <span className="text-2xl font-bold text-emerald-600">₹{selectedPlan.price}</span>
              </div>
            </div>

            {!user ? (
              <div className="text-center py-6">
                <p className="text-slate-600 mb-4">Please sign in to purchase a plan</p>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
                >
                  Sign In to Continue
                </button>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-6 w-6" />
                <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
              </button>
            )}

            <p className="text-sm text-slate-500 text-center mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>
        )}
      </div>

      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              All plans include unlimited calculations, full access to the calculator, and regular updates. Choose the plan that fits your timeline.
            </p>
            {!user && (
              <button
                onClick={() => onNavigate('signup')}
                className="px-8 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 font-semibold transition-colors"
              >
                Start Free Trial
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
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
