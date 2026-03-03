import api from "@/services/api";

/**
 * Get logged in chef profile
 */
export const getChefProfile = async () => {
  const res = await api.get("/user/me");
  console.debug("getChefProfile response", res);
  return res.data.data;
};

/**
 * Update chef basic info
 */
export const updateChefProfile = async (payload) => {
  console.debug("updateChefProfile payload", payload);
  // backend expects `fullName`; some callers still pass `name` so normalize here
  const normalized = { ...payload };
  if (normalized.name && !normalized.fullName) {
    normalized.fullName = normalized.name;
    delete normalized.name;
  }
  const res = await api.patch("/user/me", normalized);
  console.debug("updateChefProfile response", res);
  return res.data;
};

/**
 * Update chef password
 */
export const updateChefPassword = async (payload) => {
  const res = await api.patch("/user/me", payload);
  return res.data;
};

/**
 * Get the current logged-in user's profile (generic endpoint)
 */
export const getUserProfile = async () => {
  const res = await api.get("/user/me");
  // some backends wrap the result in data.data
  return res.data?.data ?? res.data;
};

/**
 * Update the current logged-in user's profile (name, etc.)
 * PATCH /user/me
 */
export const updateUserProfile = async (payload) => {
  // `fullName` normalization for generic user endpoint as well
  const normalized = { ...payload };
  if (normalized.name && !normalized.fullName) {
    normalized.fullName = normalized.name;
    delete normalized.name;
  }
  const res = await api.patch("/user/me", normalized);
  return res.data?.data ?? res.data;
};