import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Supondo que você tenha um hook useAuth para gerenciar autenticação
import { UserRole } from '../../types'; 

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  allowedRoles, 
  redirectPath = "/dashboard" 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // Se o usuário não estiver autenticado, redirecione para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Se o usuário estiver autenticado, mas não tiver a função permitida, redirecione
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Se tudo estiver ok, renderize os componentes filhos
  return <Outlet />;
};

export default RoleBasedRoute;