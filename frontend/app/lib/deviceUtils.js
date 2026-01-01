export const generateDeviceId = () => {
  const navigatorData = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
  };

  const dataString = JSON.stringify(navigatorData);
  const hash = Array.from(dataString).reduce((hash, char) => {
    const charCode = char.charCodeAt(0);
    return ((hash << 5) - hash + charCode) | 0;
  }, 0);

  return `device_${Math.abs(hash).toString(16)}`;
};

export const getDeviceName = () => {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) {
    return "Windows Desktop";
  } else if (ua.includes("Macintosh")) {
    return "Mac Desktop";
  } else if (ua.includes("Linux") && !ua.includes("Android")) {
    return "Linux Desktop";
  } else if (ua.includes("iPhone")) {
    return "iPhone";
  } else if (ua.includes("iPad")) {
    return "iPad";
  } else if (ua.includes("Android")) {
    return "Android Device";
  }

  return "Unknown Device";
};

export const getDeviceType = () => {
  const ua = navigator.userAgent;

  if (
    ua.includes("iPhone") ||
    (ua.includes("Android") && !ua.includes("iPad"))
  ) {
    return "mobile";
  } else if (
    ua.includes("iPad") ||
    (ua.includes("Android") && ua.includes("Tablet"))
  ) {
    return "tablet";
  }

  return "desktop";
};

export const getStoredDeviceId = () => {
  return localStorage.getItem("device_id");
};

export const setStoredDeviceId = (deviceId) => {
  localStorage.setItem("device_id", deviceId);
};

export const initializeDevice = () => {
  let deviceId = getStoredDeviceId();

  if (!deviceId) {
    deviceId = generateDeviceId();
    setStoredDeviceId(deviceId);
  }

  return deviceId;
};
