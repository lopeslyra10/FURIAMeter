/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = 'admin' | 'staff' | 'fan';

/**
 * Links de redes sociais
 */
export interface SocialLinks {
  instagram: string;
  twitter: string;
  steam: string;
}

/**
 * Interface base do usuário
 */
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string;
  social: SocialLinks;
}

/**
 * Interface do fã
 */
export interface Fan extends BaseUser {
  role: 'fan';
}

/**
 * Interface da equipe (staff)
 */
export interface Staff extends BaseUser {
  role: 'staff';
}

/**
 * Interface do administrador
 */
export interface Admin extends BaseUser {
  role: 'admin';
}

/**
 * Interface do usuário autenticado
 */
export type User = Admin | Staff | Fan;

/**
 * Dados necessários para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Dados necessários para registro
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
}
