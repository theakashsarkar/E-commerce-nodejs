const BASE_URL = "http://localhost:8000/api/v1/user";

export const registerUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "something want wrong");
  }
  return data;
};
