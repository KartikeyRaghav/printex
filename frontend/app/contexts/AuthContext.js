import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import {
  supabase,
  UserProfile,
  Subscription,
  Device,
  PlanDeviceLimit,
  AdditionalDevicePurchase,
} from "../lib/supabase";
import {
  initializeDevice,
  getDeviceName,
  getDeviceType,
  getStoredDeviceId,
} from "../lib/deviceUtils";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowedDevices, setAllowedDevices] = useState(2);

  const checkAccess = (profile, subscription) => {
    if (!profile) return false;

    if (subscription && subscription.status === "active") {
      const now = new Date();
      const endDate = new Date(subscription.end_date);
      return now < endDate;
    }

    const now = new Date();
    const trialEnd = new Date(profile.trial_ends_at);
    return now < trialEnd;
  };

  const hasAccess = checkAccess(profile, subscription);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  };

  const fetchSubscription = async (userId) => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }

    return data;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      const subscriptionData = await fetchSubscription(user.id);
      setProfile(profileData);
      setSubscription(subscriptionData);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          const profileData = await fetchProfile(session.user.id);
          const subscriptionData = await fetchSubscription(session.user.id);
          setProfile(profileData);
          setSubscription(subscriptionData);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => {
          const profileData = await fetchProfile(session.user.id);
          const subscriptionData = await fetchSubscription(session.user.id);
          setProfile(profileData);
          setSubscription(subscriptionData);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          trial_started_at: new Date().toISOString(),
          trial_ends_at: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(),
        });

      if (profileError) throw profileError;
    }
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const fetchDevices = async (userId) => {
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("user_id", userId)
      .order("last_active_at", { ascending: false });

    if (error) {
      console.error("Error fetching devices:", error);
      return [];
    }

    return data || [];
  };

  const fetchAllowedDevices = async (userId, subscriptionData) => {
    let baseDevices = 2;

    if (subscriptionData) {
      const { data: planLimit } = await supabase
        .from("plan_device_limits")
        .select("included_devices")
        .eq("plan_type", subscriptionData.plan_type)
        .maybeSingle();

      if (planLimit) {
        baseDevices = planLimit.included_devices;
      }
    }

    const { data: additionalPurchases } = await supabase
      .from("additional_device_purchases")
      .select("additional_devices_count")
      .eq("user_id", userId)
      .eq("end_date", `gt.${new Date().toISOString()}`);

    const additionalDevices =
      additionalPurchases?.reduce(
        (sum, purchase) => sum + purchase.additional_devices_count,
        0
      ) || 0;

    return baseDevices + additionalDevices;
  };

  const registerDevice = async () => {
    if (!user) return;

    const deviceId = initializeDevice();
    const deviceName = getDeviceName();
    const deviceType = getDeviceType();

    const devicesData = await fetchDevices(user.id);
    const allowedCount = await fetchAllowedDevices(user.id, subscription);

    if (devicesData.length >= allowedCount) {
      const existingCurrentDevice = devicesData.find(
        (d) => d.device_id === deviceId
      );
      if (!existingCurrentDevice) {
        throw new Error("DEVICE_LIMIT_EXCEEDED");
      }
    }

    const { data: existingDevice } = await supabase
      .from("devices")
      .select("*")
      .eq("user_id", user.id)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (existingDevice) {
      await supabase
        .from("devices")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", existingDevice.id);
    } else {
      await supabase.from("devices").insert({
        user_id: user.id,
        device_id: deviceId,
        device_name: deviceName,
        device_type: deviceType,
        last_active_at: new Date().toISOString(),
      });
    }

    const updatedDevices = await fetchDevices(user.id);
    setDevices(updatedDevices);

    const currentDeviceData = updatedDevices.find(
      (d) => d.device_id === deviceId
    );
    setCurrentDevice(currentDeviceData || null);

    setAllowedDevices(allowedCount);
  };

  const removeDevice = async (deviceId) => {
    if (!user) return;

    const { error } = await supabase
      .from("devices")
      .delete()
      .eq("user_id", user.id)
      .eq("id", deviceId);

    if (!error) {
      const updatedDevices = await fetchDevices(user.id);
      setDevices(updatedDevices);
    }
  };

  const getAvailableDeviceSlots = () => {
    return Math.max(0, allowedDevices - devices.length);
  };

  const deviceLimitReached = devices.length >= allowedDevices && !currentDevice;

  useEffect(() => {
    if (user && !loading) {
      (async () => {
        const devicesData = await fetchDevices(user.id);
        setDevices(devicesData);
        const allowedCount = await fetchAllowedDevices(user.id, subscription);
        setAllowedDevices(allowedCount);

        const deviceId = getStoredDeviceId();
        if (deviceId) {
          const current = devicesData.find((d) => d.device_id === deviceId);
          setCurrentDevice(current || null);
        }
      })();
    }
  }, [user, subscription, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        loading,
        hasAccess,
        devices,
        deviceLimitReached,
        currentDevice,
        allowedDevices,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        registerDevice,
        removeDevice,
        getAvailableDeviceSlots,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
