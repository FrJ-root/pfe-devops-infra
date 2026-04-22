import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, CreditCard, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import orderService from '../../../services/orderService';
import paymentService from '../../../services/paymentService';
import './ClientOrderDetailsPage.css';

const ClientOrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // Payment form state
    const [paymentData, setPaymentData] = useState({
        amount: '',
        paymentType: 'ESPECES',
        reference: '',
        bank: '',
        dueDate: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        loadOrderData();
    }, [id]);

    const loadOrderData = async () => {
        try {
            setLoading(true);
            setError('');

            const [orderData, paymentsData] = await Promise.all([
                orderService.getById(id),
                paymentService.getByOrderId(id)
            ]);

            setOrder(orderData);
            setPayments(paymentsData);
        } catch (err) {
            console.error('Failed to load order details', err);
            setError('Impossible de charger les détails de la commande');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentError('');

        // Validation
        if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
            setPaymentError('Veuillez entrer un montant valide');
            return;
        }

        if (parseFloat(paymentData.amount) > order.amountRemaining) {
            setPaymentError(`Le montant ne peut pas dépasser le reste à payer (${order.amountRemaining.toFixed(2)} DH)`);
            return;
        }

        // Type-specific validation
        if (paymentData.paymentType === 'ESPECES') {
            if (parseFloat(paymentData.amount) > 20000) {
                setPaymentError('Les paiements en espèces ne peuvent pas dépasser 20 000 DH');
                return;
            }
            if (!paymentData.reference.trim()) {
                setPaymentError('Le numéro de reçu est requis pour les paiements en espèces');
                return;
            }
        }

        if (paymentData.paymentType === 'CHEQUE') {
            if (!paymentData.reference.trim()) {
                setPaymentError('Le numéro de chèque est requis');
                return;
            }
            if (!paymentData.bank.trim()) {
                setPaymentError('Le nom de la banque est requis pour les chèques');
                return;
            }
            if (!paymentData.dueDate) {
                setPaymentError('La date d\'échéance est requise pour les chèques');
                return;
            }
        }

        if (paymentData.paymentType === 'VIREMENT') {
            if (!paymentData.reference.trim()) {
                setPaymentError('La référence de virement est requise');
                return;
            }
            if (!paymentData.bank.trim()) {
                setPaymentError('Le nom de la banque est requis pour les virements');
                return;
            }
        }

        try {
            setSubmitting(true);

            const payload = {
                orderId: parseInt(id),
                amount: parseFloat(paymentData.amount),
                paymentType: paymentData.paymentType,
                reference: paymentData.reference.trim() || undefined,
                bank: paymentData.bank.trim() || undefined,
                dueDate: paymentData.dueDate || undefined
            };

            await paymentService.recordPayment(payload);

            // Reset form
            setPaymentData({
                amount: '',
                paymentType: 'ESPECES',
                reference: '',
                bank: '',
                dueDate: ''
            });
            setShowPaymentForm(false);

            // Reload order data
            alert('Paiement enregistré avec succès !');
            loadOrderData();
        } catch (err) {
            console.error('Failed to record payment', err);
            setPaymentError(err.response?.data?.message || 'Échec de l\'enregistrement du paiement');
        } finally {
            setSubmitting(false);
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
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="order-details-loading">
                <div className="spinner"></div>
                <p>Chargement des détails...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-details-page">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate('/client/orders')} className="btn-secondary">
                        Retour à mes commandes
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const canAddPayment = order.amountRemaining > 0 && order.status !== 'CANCELED' && order.status !== 'REJECTED';

    return (
        <div className="order-details-page">
            <div className="page-header">
                <button onClick={() => navigate('/client/orders')} className="back-btn">
                    <ArrowLeft size={20} />
                    Retour
                </button>
                <div className="header-content">
                    <h1>
                        <Package size={32} />
                        Commande #{order.id}
                    </h1>
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                    </span>
                </div>
                <p className="order-date">
                    <Calendar size={16} />
                    Créée le {formatDate(order.createdAt)}
                </p>
            </div>

            <div className="details-grid">
                {/* Order Summary */}
                <div className="card">
                    <h3>Récapitulatif de la commande</h3>
                    <div className="summary-section">
                        <div className="summary-row">
                            <span>Sous-total HT</span>
                            <span className="value">{order.subTotalHT.toFixed(2)} DH</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="summary-row discount">
                                <span>Remise</span>
                                <span className="value">- {order.discountAmount.toFixed(2)} DH</span>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>TVA (20%)</span>
                            <span className="value">{order.taxAmount.toFixed(2)} DH</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total TTC</span>
                            <span className="value">{order.totalTTC.toFixed(2)} DH</span>
                        </div>
                        <div className="summary-row remaining">
                            <span>Reste à payer</span>
                            <span className="value">{order.amountRemaining.toFixed(2)} DH</span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="card items-card">
                    <h3>Produits commandés</h3>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Prix Unitaire</th>
                                <th>Quantité</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.productName}</td>
                                    <td>{item.unitPrice.toFixed(2)} DH</td>
                                    <td>{item.quantity}</td>
                                    <td className="item-total">{item.lineTotal.toFixed(2)} DH</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payments Section */}
            <div className="payments-section">
                <div className="payments-header">
                    <h3>
                        <CreditCard size={24} />
                        Paiements
                    </h3>
                    {canAddPayment && !showPaymentForm && (
                        <button onClick={() => setShowPaymentForm(true)} className="add-payment-btn">
                            <DollarSign size={18} />
                            Ajouter un paiement
                        </button>
                    )}
                </div>

                {showPaymentForm && (
                    <div className="payment-form-card">
                        <h4>Nouveau paiement</h4>
                        {paymentError && (
                            <div className="form-error">
                                <p>{paymentError}</p>
                            </div>
                        )}
                        <form onSubmit={handlePaymentSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Montant (DH) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={order.amountRemaining}
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                    <small>Maximum: {order.amountRemaining.toFixed(2)} DH</small>
                                </div>

                                <div className="form-group">
                                    <label>Type de paiement *</label>
                                    <select
                                        value={paymentData.paymentType}
                                        onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
                                    >
                                        <option value="ESPECES">Espèces (max 20k DH)</option>
                                        <option value="CHEQUE">Chèque</option>
                                        <option value="VIREMENT">Virement</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        {paymentData.paymentType === 'ESPECES' && 'N° Reçu *'}
                                        {paymentData.paymentType === 'CHEQUE' && 'N° Chèque *'}
                                        {paymentData.paymentType === 'VIREMENT' && 'Référence *'}
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.reference}
                                        onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                                        placeholder="Référence"
                                        required
                                    />
                                </div>

                                {paymentData.paymentType !== 'ESPECES' && (
                                    <div className="form-group">
                                        <label>Banque *</label>
                                        <input
                                            type="text"
                                            value={paymentData.bank}
                                            onChange={(e) => setPaymentData({ ...paymentData, bank: e.target.value })}
                                            placeholder="Nom de la banque"
                                            required={paymentData.paymentType !== 'ESPECES'}
                                        />
                                    </div>
                                )}

                                {paymentData.paymentType === 'CHEQUE' && (
                                    <div className="form-group">
                                        <label>Date d'échéance *</label>
                                        <input
                                            type="date"
                                            value={paymentData.dueDate}
                                            onChange={(e) => setPaymentData({ ...paymentData, dueDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowPaymentForm(false)} className="btn-cancel">
                                    Annuler
                                </button>
                                <button type="submit" disabled={submitting} className="btn-submit">
                                    {submitting ? 'Enregistrement...' : 'Enregistrer le paiement'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {payments.length > 0 ? (
                    <div className="payments-list">
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment.id}>
                                        <td>#{payment.paymentNumber}</td>
                                        <td>{formatDate(payment.paymentDate)}</td>
                                        <td>{payment.paymentType}</td>
                                        <td className="payment-amount">{payment.amount.toFixed(2)} DH</td>
                                        <td>
                                            <span className={`payment-status ${payment.status.toLowerCase()}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-payments">
                        <CreditCard size={48} />
                        <p>Aucun paiement enregistré pour cette commande</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientOrderDetailsPage;
