import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

// Chaves de armazenamento
const STORAGE_KEYS = {
  USER: '@FURIAMeter:user',
  TOKEN: '@FURIAMeter:token',
  REGISTERED_FANS: '@FURIAMeter:registeredFans',
};

// Staff mockado que pode fazer login
const mockStaff = [
  {
    id: '1',
    name: 'Rafael Castello',
    email: 'rafael@furia.gg',
    role: 'staff' as const,
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: '2',
    name: 'Larissa Martins',
    email: 'larissa@furia.gg',
    role: 'staff' as const,
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
];

// Admin mockado
const mockAdmin = {
  id: 'admin',
  name: 'Admin FURIA',
  email: 'admin@furia.gg',
  role: 'admin' as const,
  image: 'https://randomuser.me/api/portraits/men/3.jpg',
};

// Lista de fãs cadastrados
let registeredFans: User[] = [];

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    // Admin
    if (credentials.email === mockAdmin.email && credentials.password === '123456') {
      return {
        user: mockAdmin,
        token: 'admin-token',
      };
    }

    // Staff
    const staff = mockStaff.find(
      (s) => s.email === credentials.email && credentials.password === '123456'
    );
    if (staff) {
      return {
        user: staff,
        token: `staff-token-${staff.id}`,
      };
    }

    // Fãs
    const fan = registeredFans.find((f) => f.email === credentials.email);
    if (fan && credentials.password === '123456') {
      return {
        user: fan,
        token: `fan-token-${fan.id}`,
      };
    }

    throw new Error('Email ou senha inválidos');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Verifica se o e-mail já está em uso
    if (
      mockStaff.some((s) => s.email === data.email) ||
      mockAdmin.email === data.email ||
      registeredFans.some((f) => f.email === data.email)
    ) {
      throw new Error('Email já está em uso');
    }

    // Cria novo fã
    const newFan: User = {
      id: `fan-${registeredFans.length + 1}`,
      name: data.name,
      email: data.email,
      role: 'fan' as const,
      image: `https://randomuser.me/api/portraits/${registeredFans.length % 2 === 0 ? 'men' : 'women'}/${registeredFans.length + 10}.jpg`,
    };

    registeredFans.push(newFan);

    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_FANS, JSON.stringify(registeredFans));

    return {
      user: newFan,
      token: `fan-token-${newFan.id}`,
    };
  },

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter fã armazenado:', error);
      return null;
    }
  },

  // Funções para admin
  async getAllUsers(): Promise<User[]> {
    return [...mockStaff, ...registeredFans];
  },

  async getStaff(): Promise<User[]> {
    return mockStaff;
  },

  async getFans(): Promise<User[]> {
    return registeredFans;
  },

  async loadRegisteredFans(): Promise<void> {
    try {
      const fansJson = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_FANS);
      if (fansJson) {
        registeredFans = JSON.parse(fansJson);
      }
    } catch (error) {
      console.error('Erro ao carregar fãs registrados:', error);
    }
  },
};
