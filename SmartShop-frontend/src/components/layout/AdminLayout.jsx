import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../state/AuthContext';
import './AdminLayout.css';
import { User, Bell } from 'lucide-react';

export default function AdminLayout() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content-wrapper">
                <header className="admin-header">
                    <h2 className="page-title">{user?.role === 'ADMIN' ? 'Console de Gestion' : 'Espace Client'}</h2>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="badge-dot"></span>
                        </button>
                        <div className="user-profile-header">
                            <div className="avatar">
                                <User size={20} />
                            </div>
                            <div className="user-info-header">
                                <span className="name">{user?.username}</span>
                                <span className="role">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}