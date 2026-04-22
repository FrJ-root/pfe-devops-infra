import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { clientService } from '../../services/clientService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
    Package,
    Users,
    ShoppingCart,
    TrendingUp,
    PlusCircle,
    UserPlus,
    FileText,
    ArrowRight,
    Search
} from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState([
        { title: 'Total Products', value: '...', icon: <Package size={24} />, color: 'var(--primary)' },
        { title: user?.role === 'ADMIN' ? 'Total Clients' : 'Total Orders', value: '...', icon: user?.role === 'ADMIN' ? <Users size={24} /> : <FileText size={24} />, color: 'var(--success)' },
        { title: 'Pending Orders', value: '...', icon: <ShoppingCart size={24} />, color: 'var(--warning)' },
        { title: user?.role === 'ADMIN' ? 'Total Revenue' : 'Total Spent', value: '...', icon: <TrendingUp size={24} />, color: 'var(--info)' },
    ]);

    const [recentProducts, setRecentProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);

        // Fetch products
        try {
            const productsRes = await productService.getAll(0, 5);
            const productsData = productsRes;
            setRecentProducts(productsData.content || []);
            setStats(prev => prev.map(s =>
                s.title === 'Total Products' ? { ...s, value: productsData.totalElements?.toString() || '0' } : s
            ));
        } catch (err) {
            console.error('Failed to load products for dashboard', err);
        }

        // Fetch orders
        try {
            const ordersRes = await orderService.getAll();
            const ordersData = ordersRes;
            const pendingOrders = ordersData.filter(o => o.status === 'PENDING').length;
            const totalRevenue = ordersData.reduce((sum, o) => sum + (o.totalTTC || 0), 0);

            setStats(prev => prev.map(s => {
                if (s.title === 'Pending Orders') return { ...s, value: pendingOrders.toString() };
                if (s.title === 'Total Revenue' || s.title === 'Total Spent') return { ...s, value: `${totalRevenue.toLocaleString()} DH` };
                if (s.title === 'Total Orders' && user?.role === 'CLIENT') return { ...s, value: ordersData.length.toString() };
                return s;
            }));

            if (user?.role === 'CLIENT') {
                setRecentOrders(ordersData.slice(0, 5));
            }
        } catch (err) {
            console.error('Failed to load orders for dashboard', err);
        }

        // Fetch client count
        try {
            const clientCount = await clientService.getCount();
            setStats(prev => prev.map(s =>
                s.title === 'Total Clients' ? { ...s, value: clientCount.toString() } : s
            ));
        } catch (err) {
            console.error('Failed to load client count for dashboard', err);
        }

        setLoading(false);
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.username || 'User'}!</h1>
                    <p>Here's what's happening in your shop today.</p>
                </div>
                <div className="quick-actions">
                    {user?.role === 'ADMIN' && (
                        <>
                            <Button variant="primary" onClick={() => navigate('/products/new')}>
                                <PlusCircle size={18} /> Add Product
                            </Button>
                        </>
                    )}
                    <Button variant="success" onClick={() => navigate(user?.role === 'ADMIN' ? '/orders/new' : '/client/catalog')}>
                        <ShoppingCart size={18} /> {user?.role === 'ADMIN' ? 'New Order' : 'Shop Now'}
                    </Button>
                </div>
            </header>

            <section className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </section>

            <div className="dashboard-content">
                <Card title={user?.role === 'ADMIN' ? "Product Inventory (Recent)" : "Mes Commandes Récentes"} className="activity-card">
                    {loading ? (
                        <div className="loader">Chargement...</div>
                    ) : (user?.role === 'ADMIN' ? recentProducts : recentOrders).length === 0 ? (
                        <div className="empty-state">
                            {user?.role === 'ADMIN' ? <Package size={48} /> : <FileText size={48} />}
                            <p>{user?.role === 'ADMIN' ? 'No products found in inventory.' : 'Aucune commande trouvée.'}</p>
                            {user?.role === 'ADMIN' && (
                                <Button variant="ghost" onClick={() => navigate('/products/new')}>Add Your First Product</Button>
                            )}
                        </div>
                    ) : (
                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    {user?.role === 'ADMIN' ? (
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Statut</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {user?.role === 'ADMIN' ? (
                                        recentProducts.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.unitPriceHT?.toFixed(2)} DH</td>
                                                <td>{product.stockAvailable}</td>
                                                <td>
                                                    <span className={`status-pill ${product.stockAvailable > 10 ? 'success' : product.stockAvailable > 0 ? 'warning' : 'danger'}`}>
                                                        {product.stockAvailable > 10 ? 'In Stock' : product.stockAvailable > 0 ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        recentOrders.map(order => (
                                            <tr key={order.id} onClick={() => navigate(`/client/orders/${order.id}`)} style={{ cursor: 'pointer' }}>
                                                <td>#{order.id}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="font-bold">{order.totalTTC?.toFixed(2)} DH</td>
                                                <td>
                                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div className="card-footer-action">
                                <Button variant="ghost" size="sm" onClick={() => navigate(user?.role === 'ADMIN' ? '/products' : '/client/orders')}>
                                    {user?.role === 'ADMIN' ? 'View Full Inventory' : 'Voir toutes mes commandes'} <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <div className="dashboard-side-col">
                    <Card title="Shortcuts" className="shortcuts-card">
                        <ul className="shortcuts-list">
                            <li onClick={() => navigate(user?.role === 'ADMIN' ? '/products' : '/client/catalog')}>
                                {user?.role === 'ADMIN' ? 'View Product Catalog' : 'Go to Shop'}
                            </li>
                            <li onClick={() => navigate(user?.role === 'ADMIN' ? '/orders' : '/client/orders')}>
                                {user?.role === 'ADMIN' ? 'Track Orders' : 'My Orders'}
                            </li>
                            {user?.role === 'ADMIN' && <li onClick={() => navigate('/profile')}>Admin Settings</li>}
                        </ul>
                    </Card>

                    {user?.role === 'ADMIN' && (
                        <Card title="Search Order" className="search-order-card">
                            <div className="search-input-wrapper">
                                <Search size={18} />
                                <input type="text" placeholder="Order ID..." />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
