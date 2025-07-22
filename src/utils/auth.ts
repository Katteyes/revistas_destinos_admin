import { jwtDecode } from "jwt-decode";
export interface DecodedToken {
  id: number;
  username: string;
  role: 'admin' | 'editor' | 'user';
  exp: number;
  iat: number;
}

export const getUserFromToken = (): DecodedToken | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    return null;
  }
};
