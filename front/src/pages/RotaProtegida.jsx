import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext.jsx'

function RotaProtegida() {

    const { usuario, carregando } = useAuth();
    const uidStorage = localStorage.getItem('uid');

    if (carregando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh', color: '#0f172a' }}>
                <h2>Carregando sessão...</h2>
            </div>
        );
    }
    
    if (!usuario && !uidStorage) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RotaProtegida;