const BASE_URL = "http://localhost:8000/api/v1/user";
export const apiRequest = async (endPoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endPoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something want wrong");
  }
  return data;
};
