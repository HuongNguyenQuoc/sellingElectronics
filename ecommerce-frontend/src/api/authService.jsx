import api from "./axiosConfig";

export const loginUser = async (emailOrPhone, password) => {
  const { data } = await api.post("/users/login", {
    email: emailOrPhone,
    password,
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const registerUser = async (name, emailOrPhone, password) => {
  const { data } = await api.post("/users/register", {
    userName: name,
    email: emailOrPhone,
    password,
  });
  localStorage.setItem("token", data.token);
  return data;
};