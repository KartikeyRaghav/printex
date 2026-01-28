import crypto from "crypto";

export const hashDevice = (fingerprint) => {
  return crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("hex");
};
