export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    role: 'admin' | 'editor';
    password?: string;
    last_login?: string;
    status?: 'activo' | 'inactivo';
    createdAt?: string;
  }
  