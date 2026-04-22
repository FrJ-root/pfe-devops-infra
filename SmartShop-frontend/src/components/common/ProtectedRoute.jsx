import { Navigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, clientOnly = false }) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="btn-spinner" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" replace />;
    }

    if (clientOnly && isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
