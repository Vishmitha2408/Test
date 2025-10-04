import api from './client';

export async function signupApi(payload) {
  const { data } = await api.post('/auth/signup', payload);
  return data;
}

export async function loginApi(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}