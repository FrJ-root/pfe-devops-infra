import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { clientService } from '../../../services/clientService';
import { productService } from '../../../services/productService';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { ShoppingCart, Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import './NewOrderPage.css';

export default function NewOrderPage() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [cart, setCart] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadClientsAndProducts();
    }, []);

    const loadClientsAndProducts = async () => {
        try {
            const [clientsRes, productsRes] = await Promise.all([
                clientService.getAll(),
                productService.getAll()
            ]);
            setClients(clientsRes);
            setProducts(productsRes);
        } catch (err) {
            console.error('Failed to load data', err);
            setError('Failed to load clients/products');
        }
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existing = cart.find(item => item.productId === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                productName: product.name,
                unitPrice: product.unitPriceHT,
                stockAvailable: product.stockAvailable,
                quantity: 1
            }]);
        }
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: parseInt(quantity) }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const calculateTotals = () => {
        const subTotalHT = cart.reduce((sum, item) =>
            sum + (item.unitPrice * item.quantity), 0
        );

        // Simplified discount calculation - you may want to fetch client tier from backend
        const loyaltyDiscount = 0; // Will be calculated by backend based on client tier
        const promoDiscount = promoCode.match(/^PROMO-[A-Z0-9]{4}$/) ? subTotalHT * 0.05 : 0;
        const totalDiscount = loyaltyDiscount + promoDiscount;

        const htAfterDiscount = Math.max(0, subTotalHT - totalDiscount);
        const taxAmount = htAfterDiscount * 0.20;
        const totalTTC = htAfterDiscount + taxAmount;

        return {
            subTotalHT: subTotalHT.toFixed(2),
            loyaltyDiscount: loyaltyDiscount.toFixed(2),
            promoDiscount: promoDiscount.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            htAfterDiscount: htAfterDiscount.toFixed(2),
            taxAmount: taxAmount.toFixed(2),
            totalTTC: totalTTC.toFixed(2)
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedClientId) {
            setError('Please select a client');
            return;
        }

        if (cart.length === 0) {
            setError('Please add at least one product to the order');
            return;
        }

        // Check stock
        const stockIssues = cart.filter(item => item.quantity > item.stockAvailable);
        if (stockIssues.length > 0) {
            setError(`Insufficient stock for: ${stockIssues.map(i => i.productName).join(', ')}`);
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                clientId: parseInt(selectedClientId),
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                promoCode: promoCode.trim() || undefined
            };

            const response = await orderService.create(orderData);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/orders/${response.id}`);
            }, 1500);
        } catch (err) {
            console.error('Failed to create order', err);
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const totals = calculateTotals();
    const hasStockIssues = cart.some(item => item.quantity > item.stockAvailable);

    return (
        <div className="new-order-page">
            <div className="page-header">
                <div>
                    <h1>Create New Order</h1>
                    <p>Add products and create a new customer order</p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/orders')}>
                    Cancel
                </Button>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <Check size={18} />
                    <span>Order created successfully! Redirecting...</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="order-grid">
                    <div className="order-main">
                        {/* Client Selection */}
                        <Card className="section-card">
                            <h3>1. Select Client</h3>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="">-- Choose a client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} ({client.email})
                                    </option>
                                ))}
                            </select>
                        </Card>

                        {/* Product Selection */}
                        <Card className="section-card">
                            <h3>2. Add Products</h3>
                            <div className="product-selector">
                                <select
                                    onChange={(e) => {
                                        addToCart(e.target.value);
                                        e.target.value = '';
                                    }}
                                    className="form-select"
                                >
                                    <option value="">-- Select a product to add --</option>
                                    {products.map(product => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                            disabled={product.stockAvailable === 0}
                                        >
                                            {product.name} - {product.unitPriceHT.toFixed(2)} DH
                                            {product.stockAvailable === 0 && ' (Out of stock)'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cart Items */}
                            <div className="cart-items">
                                {cart.length === 0 ? (
                                    <div className="empty-cart">
                                        <ShoppingCart size={48} className="text-muted" />
                                        <p>No products added yet</p>
                                    </div>
                                ) : (
                                    <table className="cart-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map(item => {
                                                const subtotal = item.unitPrice * item.quantity;
                                                const stockIssue = item.quantity > item.stockAvailable;
                                                return (
                                                    <tr key={item.productId} className={stockIssue ? 'stock-error' : ''}>
                                                        <td>
                                                            {item.productName}
                                                            {stockIssue && (
                                                                <span className="stock-warning">
                                                                    (Only {item.stockAvailable} available)
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>{item.unitPrice.toFixed(2)} DH</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={item.stockAvailable}
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.productId, e.target.value)}
                                                                className="quantity-input"
                                                            />
                                                        </td>
                                                        <td className="font-bold">{subtotal.toFixed(2)} DH</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFromCart(item.productId)}
                                                                className="btn-remove"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>

                        {/* Promo Code */}
                        <Card className="section-card">
                            <h3>3. Promo Code (Optional)</h3>
                            <input
                                type="text"
                                placeholder="PROMO-XXXX"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                className="form-input"
                                pattern="PROMO-[A-Z0-9]{4}"
                            />
                            {promoCode && !promoCode.match(/^PROMO-[A-Z0-9]{4}$/) && (
                                <small className="text-danger">
                                    Invalid format. Expected: PROMO-XXXX
                                </small>
                            )}
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="order-sidebar">
                        <Card className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-line">
                                <span>Subtotal HT:</span>
                                <span className="amount">{totals.subTotalHT} DH</span>
                            </div>
                            <div className="summary-line text-success">
                                <span>Loyalty Discount:</span>
                                <span>-{totals.loyaltyDiscount} DH</span>
                            </div>
                            {promoCode.match(/^PROMO-[A-Z0-9]{4}$/) && (
                                <div className="summary-line text-success">
                                    <span>Promo Discount:</span>
                                    <span>-{totals.promoDiscount} DH</span>
                                </div>
                            )}
                            <hr />
                            <div className="summary-line">
                                <span>HT après remise:</span>
                                <span className="amount">{totals.htAfterDiscount} DH</span>
                            </div>
                            <div className="summary-line text-muted">
                                <span>TVA (20%):</span>
                                <span>+{totals.taxAmount} DH</span>
                            </div>
                            <hr className="bold-hr" />
                            <div className="summary-line total-line">
                                <span className="font-bold">Total TTC:</span>
                                <span className="total-amount">{totals.totalTTC} DH</span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={loading || cart.length === 0 || !selectedClientId || hasStockIssues}
                                className="submit-btn"
                            >
                                {loading ? 'Creating Order...' : 'Create Order'}
                            </Button>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
