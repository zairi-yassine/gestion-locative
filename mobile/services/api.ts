import axios from 'axios';
import { getToken, removeToken } from '@/utils/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Pour Expo Go sur appareil physique: utilisez l'IP de votre PC
const API_URL = 'http://192.168.1.36:5000/api';
console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    // Debug: log token presence (do not log full token in production)
    try {
      console.log('Attaching auth token, length=', token.length);
    } catch (e) {}
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('No auth token found when making request to', config.url);
  }
  return config;
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Ne pas rediriger si c'est une requête de login/register
    const isAuthRequest = originalRequest.url?.includes('/auth/');
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthRequest) {
      // Token expiré ou invalide (mais pas pour les erreurs d'auth)
      await removeToken();
      router.replace('/(auth)/login');
      Alert.alert('Session expirée', 'Veuillez vous reconnecter');
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTIFICATION ==========
export async function register(email: string, password: string, name?: string) {
  // Create user in Firebase Auth and return ID token + user info
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCred.user.getIdToken();
  return { token: idToken, user: { email: userCred.user.email } };
}

export async function login(email: string, password: string) {
  // Sign in with Firebase Auth and return ID token + user info
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCred.user.getIdToken();
  return { token: idToken, user: { email: userCred.user.email } };
}

// ========== PROPRIÉTÉS ==========
export async function fetchProperties() {
  const res = await api.get('/properties');
  return res.data;
}

export async function createProperty(data: any) {
  const res = await api.post('/properties', data);
  return res.data;
}

export async function updateProperty(id: string, data: any) {
  const res = await api.put(`/properties/${id}`, data);
  return res.data;
}

export async function deleteProperty(id: string) {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
}

// ========== LOCATAIRES ==========
export async function fetchTenants() {
  const res = await api.get('/tenants');
  return res.data;
}

export async function createTenant(data: any) {
  const res = await api.post('/tenants', data);
  return res.data;
}

export async function updateTenant(id: string, data: any) {
  const res = await api.put(`/tenants/${id}`, data);
  return res.data;
}

export async function deleteTenant(id: string) {
  const res = await api.delete(`/tenants/${id}`);
  return res.data;
}

// ========== PAIEMENTS ==========
export async function fetchPayments() {
  const res = await api.get('/payments');
  return res.data;
}

export async function createPayment(data: any) {
  const res = await api.post('/payments', data);
  return res.data;
}

export async function updatePayment(id: string, data: any) {
  const res = await api.put(`/payments/${id}`, data);
  return res.data;
}

export async function deletePayment(id: string) {
  const res = await api.delete(`/payments/${id}`);
  return res.data;
}