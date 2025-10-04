import axios from "axios";

const API_URL = "http://localhost:3000"; 

export const getConfig = async () => {
  const res = await axios.get(`${API_URL}/config`);
  return res.data;
};

export const addUser = async (wallet: string, kyc_status: boolean) => {
  const res = await axios.post(`${API_URL}/user`, { wallet, kyc_status });
  return res.data;
};

export const addInvoice = async (id: string, wallet: string, amount: number, status: string) => {
  const res = await axios.post(`${API_URL}/invoice`, { id, wallet, amount, status });
  return res.data;
};

export const updateKyc = async (wallet: string) => {
  const res = await axios.put(`${API_URL}/kyc/request`, { wallet });
  return res.data;
};

export const getWalletData = async (wallet: string) => {
  console.log(wallet);
  const res = await axios.get(`${API_URL}/wallet/${wallet}`);
  return res.data;
};
