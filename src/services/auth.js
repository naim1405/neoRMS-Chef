import api from "@/services/api"; 

export const loginManagement = async ({ email, password }) => {
  const response = await api.post("/auth/login/chef", { email, password });
  const { accessToken, user } = response.data?.data ?? {};
  if (!accessToken || !user?.role) {
    throw new Error("Invalid response from server");
  }

  return { accessToken, user };
};