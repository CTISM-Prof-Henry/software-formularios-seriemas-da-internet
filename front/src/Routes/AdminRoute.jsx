import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.jsx'
const AdminRoute = () => {
    const { usuario, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Verificando credenciais...</div>;
    }

    const perfil = usuario?.perfil_acesso?.toLowerCase();
    const isAdmin = perfil === 'auditor' || perfil === 'admin';

    return isAdmin ? <Outlet /> : <Navigate to="/todos-riscos" replace />;
};

export default AdminRoute;