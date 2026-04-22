import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { paymentService } from '../../../services/paymentService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { ArrowLeft, User, Calendar, CreditCard, DollarSign, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import './OrderDetailsPage.css';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('ESPÈCES');
    const [addingPayment, setAddingPayment] = useState(false);

    useEffect(() => {
        loadOrderData();
    }, [id]);

    const loadOrderData = async () => {
        try {
            setLoading(true);
            const [orderRes, paymentsRes] = await Promise.all([
                orderService.getById(id),
                paymentService.getPaymentsByOrder(id)
            ]);
            setOrder(orderRes);
            setPayments(paymentsRes);
        } catch (err) {
            console.error('Failed to load order details', err);
            setError('Failed to load order details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (newStatus === order.status) return;

        if (newStatus === 'CONFIRMED' && order.amountRemaining > 0) {
            alert(`Order must be fully paid to confirm. Remaining: ${order.amountRemaining.toFixed(2)} DH`);
            return;
        }

        if (!window.confirm(`Are you sure you want to change order #${id} status to ${newStatus}?`)) return;

        try {
            await orderService.updateStatus(id, newStatus);
            loadOrderData(); // Reload to reflect changes
        } catch (err) {
            console.error('Failed to update status', err);
            alert(err.response?.data?.message || 'Failed to update order status.');
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!paymentAmount || Number(paymentAmount) <= 0) return;

        try {
            setAddingPayment(true);
            const paymentData = {
                orderId: id,
                amount: Number(paymentAmount),
                paymentType: paymentType
            };
            await paymentService.recordPayment(paymentData);
            setPaymentAmount('');
            loadOrderData(); // Reload to see new payment and updated remaining amount
        } catch (err) {
            console.error('Failed to add payment', err);
            alert('Failed to record payment. Please try again.');
        } finally {
            setAddingPayment(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle size={20} className="text-success" />;
            case 'CANCELED':
            case 'REJECTED': return <XCircle size={20} className="text-danger" />;
            default: return <Clock size={20} className="text-warning" />;
        }
    };

    if (loading) return <div className="loading-container">Loading order details...</div>;
    if (error) return <div className="error-alert">{error}</div>;
    if (!order) return <div className="error-alert">Order not found</div>;

    return (
        <div className="order-details-page">
            <div className="page-header">
                <div>
                    <h1>Order #{order.id}</h1>
                    <div className="status-display">
                        {getStatusIcon(order.status)}
                        <span className={`status-text ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => navigate('/orders')}>
                    <ArrowLeft size={18} /> Back to Orders
                </Button>
            </div>

            <div className="details-grid">
                <div className="details-main">
                    <Card title="Order Items" icon={<Package size={20} />}>
                        <div className="table-responsive">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th className="text-right">Price HT</th>
                                        <th className="text-right">Qty</th>
                                        <th className="text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.productName || `Product #${item.productId}`}</td>
                                            <td className="text-right">{item.unitPrice?.toFixed(2)} DH</td>
                                            <td className="text-right">{item.quantity}</td>
                                            <td className="text-right">{item.lineTotal?.toFixed(2)} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="amount-breakdown">
                            <div className="breakdown-row">
                                <span>Sous-total HT:</span>
                                <span className="amount">{order.subTotalHT?.toFixed(2)} DH</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="breakdown-row text-success">
                                    <span>Remise:</span>
                                    <span>-{order.discountAmount?.toFixed(2)} DH</span>
                                </div>
                            )}
                            <div className="breakdown-row">
                                <span>HT après remise:</span>
                                <span className="amount">{(order.subTotalHT - (order.discountAmount || 0)).toFixed(2)} DH</span>
                            </div>
                            <div className="breakdown-row">
                                <span>TVA (20%):</span>
                                <span>+{order.taxAmount?.toFixed(2)} DH</span>
                            </div>
                            <hr className="breakdown-divider" />
                            <div className="breakdown-row total-row">
                                <span>Total TTC:</span>
                                <span className="total-amount">{order.totalTTC?.toFixed(2)} DH</span>
                            </div>
                            <div className="breakdown-row text-success">
                                <span>Payé:</span>
                                <span>{(order.totalTTC - order.amountRemaining)?.toFixed(2)} DH</span>
                            </div>
                            <div className="breakdown-row text-danger">
                                <span className="font-bold">Reste à payer:</span>
                                <span className="font-bold">{order.amountRemaining?.toFixed(2)} DH</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Payment History" icon={<CreditCard size={20} />}>
                        {payments.length === 0 ? (
                            <p className="text-muted">No payments recorded yet.</p>
                        ) : (
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Method</th>
                                        <th className="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                            <td>{payment.paymentType}</td>
                                            <td className="text-right">{payment.amount?.toFixed(2)} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Card>
                </div>

                <div className="details-sidebar">
                    <Card title="Customer Info" icon={<User size={20} />}>
                        <div className="info-row">
                            <span className="label">Name:</span>
                            <span className="value">
                                {order.clientId ? (
                                    <Link to={`/clients/${order.clientId}`} className="text-primary hover:underline">
                                        {order.clientName || 'Unknown Client'}
                                    </Link>
                                ) : (
                                    order.clientName || 'Unknown Client'
                                )}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="label">Date:</span>
                            <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </Card>

                    <Card title="Actions" icon={<DollarSign size={20} />}>
                        <div className="action-section">
                            <h3>Order Status</h3>
                            <div className="status-toggle-wrapper">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    className={`status-select ${order.status.toLowerCase()}`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CANCELED">Canceled</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                                {order.status === 'PENDING' && order.amountRemaining > 0 && (
                                    <p className="text-warning text-xs mt-2">
                                        ⚠ Fully pay the order to enable confirmation.
                                    </p>
                                )}
                            </div>
                        </div>

                        {order.amountRemaining > 0 && order.status !== 'CANCELED' && order.status !== 'REJECTED' && (
                            <div className="action-section">
                                <h3>Add Payment</h3>
                                <form onSubmit={handleAddPayment}>
                                    <div className="payment-input-group">
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            max={order.amountRemaining}
                                            min="0.01"
                                            step="0.01"
                                            required
                                            className="payment-input"
                                        />
                                        <select
                                            value={paymentType}
                                            onChange={(e) => setPaymentType(e.target.value)}
                                            className="payment-select"
                                        >
                                            <option value="ESPÈCES">Cash</option>
                                            <option value="CHÈQUE">Check</option>
                                            <option value="VIREMENT">Transfer</option>
                                        </select>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                        disabled={addingPayment}
                                    >
                                        {addingPayment ? 'Recording...' : 'Record Payment'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
