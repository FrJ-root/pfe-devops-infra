import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Eye, Calendar } from 'lucide-react';
import orderService from '../../../services/orderService';
import './ClientOrdersPage.css';

const ClientOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await orderService.getAll();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders', err);
            setError('Impossible de charger vos commandes');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'status-confirmed';
            case 'PENDING':
                return 'status-pending';
            case 'CANCELED':
                return 'status-canceled';
            case 'REJECTED':
                return 'status-rejected';
            default:
                return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'Confirmée';
            case 'PENDING':
                return 'En attente';
            case 'CANCELED':
                return 'Annulée';
            case 'REJECTED':
                return 'Rejetée';
            default:
                return status;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="spinner"></div>
                <p>Chargement de vos commandes...</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>
                    <ClipboardList size={32} />
                    Mes Commandes
                </h1>
                <p className="subtitle">Historique de toutes vos commandes</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={64} />
                    <h2>Aucune commande</h2>
                    <p>Vous n'avez pas encore passé de commande</p>
                    <button onClick={() => navigate('/client/catalog')} className="btn-primary">
                        Découvrir le catalogue
                    </button>
                </div>
            ) : (
                <div className="orders-table-card">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>N° Commande</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Montant Total TTC</th>
                                <th>Reste à Payer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="order-id">#{order.id}</td>
                                    <td>
                                        <div className="date-cell">
                                            <Calendar size={16} />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="amount">{order.totalTTC.toFixed(2)} DH</td>
                                    <td>
                                        {order.amountRemaining > 0 ? (
                                            <span className="amount-remaining">
                                                {order.amountRemaining.toFixed(2)} DH
                                            </span>
                                        ) : (
                                            <span className="paid-full">Payé</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/client/orders/${order.id}`)}
                                            className="view-btn"
                                            title="Voir les détails"
                                        >
                                            <Eye size={18} />
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClientOrdersPage;
