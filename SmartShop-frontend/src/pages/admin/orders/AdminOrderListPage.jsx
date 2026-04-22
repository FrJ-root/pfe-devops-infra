import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { Search, Eye, Filter, AlertCircle, ShoppingCart } from 'lucide-react';
import './AdminOrderListPage.css';

export default function AdminOrderListPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Sort orders by most recent first
    const sortOrders = (orderList) => {
        return [...orderList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        if (statusFilter === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === statusFilter));
        }
    }, [statusFilter, orders]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAll();
            const sortedOrders = sortOrders(response);
            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
        } catch (err) {
            console.error('Failed to load orders', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const order = orders.find(o => o.id === id);
        if (order.status === newStatus) return;

        if (newStatus === 'CONFIRMED' && order.amountRemaining > 0) {
            alert("Order must be fully paid to confirm.");
            return;
        }

        if (!window.confirm(`Are you sure you want to change order #${id} status to ${newStatus}?`)) return;

        try {
            await orderService.updateStatus(id, newStatus);
            await loadOrders(); // Refresh the list
        } catch (err) {
            console.error('Failed to update status', err);
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'CONFIRMED': return 'success';
            case 'CANCELED': return 'danger';
            case 'REJECTED': return 'danger';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-order-list">
            <div className="page-header">
                <div>
                    <h1>Order Management</h1>
                    <p>Track and manage customer orders.</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/orders/new')}>
                    <ShoppingCart size={18} /> New Order
                </Button>
            </div>

            {error && (
                <div className="error-alert">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <Card className="table-card">
                <div className="table-actions">
                    <div className="filter-group">
                        <Filter size={18} className="text-secondary" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="status-filter"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELED">Canceled</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Total TTC</th>
                                <th>Status</th>
                                <th>Remaining Due</th>
                                <th className="actions-col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">Loading orders...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-medium">#{order.id}</td>
                                        <td className="text-primary">{order.clientName || `Client #${order.clientId}`}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td className="font-bold">{order.totalTTC?.toFixed(2)} DH</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`status-select ${getStatusColor(order.status)}`}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CANCELED">Canceled</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={order.amountRemaining > 0 ? 'text-danger' : 'text-success'}>
                                                {order.amountRemaining?.toFixed(2)} DH
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                icon={<Eye size={16} />}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
