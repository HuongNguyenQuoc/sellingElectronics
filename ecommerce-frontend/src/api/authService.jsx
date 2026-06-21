import api from "./axiosConfig";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event("auth-changed"));
};

export const loginUser = async (emailOrPhone, password) => {
  const { data } = await api.post("/users/login", {
    email: emailOrPhone,
    password,
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("user", JSON.stringify(data));
  notifyAuthChanged();
  return data;
};

export const registerUser = async (name, emailOrPhone, password) => {
  const { data } = await api.post("/users/register", {
    userName: name,
    email: emailOrPhone,
    password,
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("user", JSON.stringify(data));
  notifyAuthChanged();
  return data;
};
