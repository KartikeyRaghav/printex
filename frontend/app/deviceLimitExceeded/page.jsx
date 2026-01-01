import { AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DeviceLimitExceeded({ onNavigate }) {
  const { allowedDevices, devices, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
            Device Limit Exceeded
          </h1>

          <p className="text-slate-600 text-center mb-6">
            You've reached the maximum number of devices allowed with your current plan.
            You cannot access your account from this device.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-900 font-semibold mb-2">Current Usage:</p>
            <p className="text-lg font-bold text-red-700">
              {devices.length} / {allowedDevices} devices
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm text-slate-700 font-semibold">To regain access, you can:</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold shrink-0">1.</span>
                <span>
                  <strong>Manage devices:</strong> Remove an unused device from your Device Management page
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold shrink-0">2.</span>
                <span>
                  <strong>Purchase more slots:</strong> Add device slots to your subscription
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold shrink-0">3.</span>
                <span>
                  <strong>Upgrade your plan:</strong> Choose a plan with more included device slots
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('add-devices')}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
            >
              Purchase Device Slots
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            Device limits help prevent unauthorized account sharing
          </p>
        </div>
      </div>
    </div>
  );
}
