import { apiRequest } from "./apiClient";
export const registerUser = async (formData) => {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};
export const loginUser = async (formData) => {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};
export const logoutUser = async ($accesToken) => {
  return apiRequest("/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${$accesToken}`,
    },
  });
};
export const verifyEmail = async (token) => {
  return apiRequest("/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
