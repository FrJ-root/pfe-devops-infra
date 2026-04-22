import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import Button from '../common/Button';
import { LogOut, LayoutDashboard, Package, Users, ShoppingCart, User, Info, PhoneCall, Home } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <ShoppingCart size={28} />
                    <span>SmartShop</span>
                </Link>

                <div className="navbar-links">
                    {isAuthenticated() ? (
                        // Authenticated Links
                        <>
                            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>

                            {isAdmin() && (
                                <>
                                    <Link to="/products" className={`navbar-link ${isActive('/products') ? 'active' : ''}`}>
                                        <Package size={18} />
                                        <span>Inventory</span>
                                    </Link>
                                    <Link to="/clients" className={`navbar-link ${isActive('/clients') ? 'active' : ''}`}>
                                        <Users size={18} />
                                        <span>Clients</span>
                                    </Link>
                                </>
                            )}

                            <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}>
                                <ShoppingCart size={18} />
                                <span>Orders</span>
                            </Link>
                        </>
                    ) : (
                        // Public Links
                        <>
                            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
                                <Home size={18} />
                                <span>Home</span>
                            </Link>
                            <Link to="/public/products" className={`navbar-link ${isActive('/public/products') ? 'active' : ''}`}>
                                <Package size={18} />
                                <span>Products</span>
                            </Link>
                            <a href="#about" className="navbar-link">
                                <Info size={18} />
                                <span>About</span>
                            </a>
                            <a href="#contact" className="navbar-link">
                                <PhoneCall size={18} />
                                <span>Contact</span>
                            </a>
                        </>
                    )}
                </div>

                <div className="navbar-actions">
                    {isAuthenticated() ? (
                        <div className="navbar-user">
                            <div className="user-info">
                                <User size={20} />
                                <div className="user-details">
                                    <span className="user-name">{user?.username}</span>
                                    <span className={`user-badge ${user?.role?.toLowerCase()}`}>
                                        {user?.role}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                icon={<LogOut size={18} />}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
