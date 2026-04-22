import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../../services/clientService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { ArrowLeft, User, ShoppingBag, Mail, Phone, MapPin, Edit } from 'lucide-react';
import './ClientDetailsPage.css';

export default function ClientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadClientData();
    }, [id]);

    const loadClientData = async () => {
        try {
            setLoading(true);
            const [clientRes, ordersRes] = await Promise.all([
                clientService.getById(id),
                clientService.getOrderHistory(id)
            ]);
            setClient(clientRes);
            setOrders(ordersRes);
        } catch (err) {
            console.error('Failed to load client details', err);
            setError('Failed to load client details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container">Loading client details...</div>;
    if (error) return <div className="error-alert">{error}</div>;
    if (!client) return <div className="error-alert">Client not found</div>;

    const totalSpent = orders.reduce((sum, order) => sum + (order.totalTTC || 0), 0);

    return (
        <div className="client-details-page">
            <div className="page-header">
                <div>
                    <h1>Client Profile</h1>
                    <p>Manage client information and view history.</p>
                </div>
                <div className="header-actions">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} /> Back
                    </Button>
                    {/* Add Edit button if we implement ClientFormPage */}
                </div>
            </div>

            <div className="client-grid">
                <div className="client-info-col">
                    <Card title="Personal Information" icon={<User size={20} />}>
                        <div className="info-list">
                            <div className="info-item">
                                <span className="label">Name</span>
                                <span className="value font-medium">{client.nom} {client.prenom}</span>
                            </div>
                            <div className="info-item">
                                <span className="label"><Mail size={16} /> Email</span>
                                <span className="value">{client.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="label"><Phone size={16} /> Phone</span>
                                <span className="value">{client.telephone || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label"><MapPin size={16} /> Address</span>
                                <span className="value">{client.adresse || 'Not provided'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Statistics">
                        <div className="stats-list">
                            <div className="stat-item">
                                <span className="label">Total Orders</span>
                                <span className="value-large">{orders.length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="label">Total Spent</span>
                                <span className="value-large text-primary">{totalSpent.toFixed(2)} DH</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="client-history-col">
                    <Card title="Order History" icon={<ShoppingBag size={20} />}>
                        {orders.length === 0 ? (
                            <p className="text-muted">No orders placed yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th className="text-right">Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge-sm ${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="text-right">{order.totalTTC?.toFixed(2)} DH</td>
                                                <td className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
