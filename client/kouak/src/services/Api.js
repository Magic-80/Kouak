import AxiosInstance from "./AxiosInstance";

const api = AxiosInstance();

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (email, username , password) => {
  const res = await api.post("/auth/register", { email, username, password });
  return res.data;
};

export const getMessages = async () => {
  const res = await api.get("/messages");
  return res.data;
};

export const sendMessage = async (content) => {
  const res = await api.post("/messages", { content });
  return res.data;
};
