import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Trash2, ArrowLeft, Smartphone as Mobile, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DeviceManagement({ onNavigate }) {
  const { devices, removeDevice, allowedDevices, getAvailableDeviceSlots, currentDevice } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="h-6 w-6" />;
      case 'mobile':
        return <Mobile className="h-6 w-6" />;
      case 'tablet':
        return <Tablet className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    setDeletingId(deviceId);
    try {
      await removeDevice(deviceId);
    } finally {
      setDeletingId(null);
    }
  };

  const availableSlots = getAvailableDeviceSlots();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900">Device Management</h1>
            <button
              onClick={() => onNavigate('calculator')}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Devices</h2>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-700 mb-2 font-semibold">Device Usage</p>
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {devices.length} / {allowedDevices}
                  </p>
                  <p className="text-sm text-blue-600">
                    {availableSlots > 0
                      ? `${availableSlots} device slot${availableSlots === 1 ? '' : 's'} available`
                      : 'Device limit reached'}
                  </p>
                </div>
                {availableSlots === 0 && (
                  <button
                    onClick={() => onNavigate('add-devices')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Devices</span>
                  </button>
                )}
              </div>
            </div>

            {devices.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium mb-2">No devices registered yet</p>
                <p className="text-slate-500">Devices will appear here once you access your account from different devices</p>
              </div>
            ) : (
              <div className="space-y-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={`border-2 rounded-lg p-6 transition-all ${
                      currentDevice?.id === device.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          currentDevice?.id === device.id
                            ? 'bg-emerald-200 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {getDeviceIcon(device.device_type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {device.device_name}
                            </h3>
                            {currentDevice?.id === device.id && (
                              <span className="px-3 py-1 bg-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
                                Current Device
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            Device Type: {device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Last active: {new Date(device.last_active_at).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            Registered: {new Date(device.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {currentDevice?.id !== device.id && (
                        <button
                          onClick={() => handleRemoveDevice(device.id)}
                          disabled={deletingId === device.id}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remove device"
                        >
                          <Trash2 className={`h-5 w-5 ${deletingId === device.id ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {availableSlots === 0 && devices.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Device Limit Reached</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    You've reached the maximum number of devices allowed with your current plan.
                    To use additional devices, you'll need to purchase more device slots or remove an existing device.
                  </p>
                  <button
                    onClick={() => onNavigate('add-devices')}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                  >
                    Purchase Additional Device Slots
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">How Device Limits Work</h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Each subscription plan includes a limited number of concurrent devices</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>A device is identified by your browser and device fingerprint, preventing account sharing</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>You can remove older devices to register new ones</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Additional device slots can be purchased as add-ons</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Device add-ons expire when your subscription ends</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
