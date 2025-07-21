import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';
import { type ReactElement } from 'react';

interface Props {
  children: ReactElement;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: Props) => {
  const user = getUserFromToken();

  if (!user) {
    alert("Debes iniciar sesión.");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("No tienes permiso para acceder a esta ruta.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
