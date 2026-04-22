import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { useCart } from '../../state/CartContext';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    LogOut,
    Settings,
    ChevronLeft,
    ChevronRight,
    Store
} from 'lucide-react';
import './Sidebar.css';
import { useState } from 'react';

export default function Sidebar() {
    const { user, logout, isAdmin } = useAuth();
    const { getCartItemCount } = useCart();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleSidebar = () => setCollapsed(!collapsed);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (isAdmin()) {
        navItems.push(
            { path: '/products', label: 'Inventory', icon: Package },
            { path: '/orders', label: 'Orders', icon: ShoppingCart },
            { path: '/clients', label: 'Clients', icon: Users }
        );
    } else {
        navItems.push(
            { path: '/client/catalog', label: 'Catalogue', icon: Package },
            { path: '/client/cart', label: 'Panier', icon: ShoppingCart, badge: getCartItemCount() },
            { path: '/client/orders', label: 'Mes Commandes', icon: ShoppingCart }
        );
    }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link to="/" className="sidebar-brand">
                    <Store size={28} />
                    {!collapsed && <span>SmartShop</span>}
                </Link>
                <button className="collapse-btn" onClick={toggleSidebar}>
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        title={collapsed ? item.label : ''}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span>{item.label}</span>}
                        {item.badge > 0 && (
                            <span className={`nav-badge ${collapsed ? 'collapsed' : ''}`}>{item.badge}</span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-mini">
                    <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
                        <Settings size={20} />
                        {!collapsed && <span>Settings</span>}
                    </Link>
                </div>
                <button onClick={logout} className="sidebar-link logout-btn">
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
