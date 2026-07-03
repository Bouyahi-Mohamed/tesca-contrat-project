import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchContracts() {
  const { data } = await api.get('/contracts');
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data;
}

export async function fetchFournisseurs() {
  const { data } = await api.get('/fournisseurs');
  return data;
}

export async function createFournisseur(payload) {
  const { data } = await api.post('/fournisseurs', payload);
  return data;
}

export async function createContract(payload) {
  const { data } = await api.post('/contracts', payload);
  return data;
}

export async function updateContract(id, payload) {
  const { data } = await api.put(`/contracts/${id}`, payload);
  return data;
}

export async function deleteContract(id) {
  const { data } = await api.delete(`/contracts/${id}`);
  return data;
}

export async function checkRenewals(daysThreshold = 30) {
  const { data } = await api.post(`/contracts/check-renewals?daysThreshold=${daysThreshold}`);
  return data;
}

export async function continueContract(id, extensionMonths = 12) {
  const { data } = await api.put(`/contracts/${id}/continue`, { extensionMonths });
  return data;
}

export async function cancelContract(id) {
  const { data } = await api.put(`/contracts/${id}/cancel`);
  return data;
}
