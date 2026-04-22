import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../../../state/CartContext';
import { useAuth } from '../../../state/AuthContext';
import orderService from '../../../services/orderService';
import './ClientCartPage.css';

const ClientCartPage = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, calculateSubtotalHT } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const subtotalHT = calculateSubtotalHT();

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            setError('Votre panier est vide');
            return;
        }

        // Prepare order data
        const orderData = {
            clientId: user.id, // Assuming user.id is the client ID
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            promoCode: promoCode.trim() || undefined
        };

        try {
            setSubmitting(true);
            setError('');

            const response = await orderService.create(orderData);

            // Clear cart on success
            clearCart();

            // Navigate to order details
            alert('Commande créée avec succès !');
            navigate(`/client/orders/${response.id}`);
        } catch (err) {
            console.error('Failed to create order', err);

            // Handle specific error messages from backend
            const errorMessage = err.response?.data?.message || 'Échec de la création de la commande';

            if (errorMessage.includes('Stock')) {
                setError('Stock insuffisant pour un ou plusieurs produits. Veuillez ajuster les quantités.');
            } else if (errorMessage.includes('Code Promo') || errorMessage.includes('Promo')) {
                setError(errorMessage);
            } else {
                setError(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-header">
                    <h1>
                        <ShoppingCart size={32} />
                        Mon Panier
                    </h1>
                </div>
                <div className="empty-cart">
                    <ShoppingCart size={64} />
                    <h2>Votre panier est vide</h2>
                    <p>Ajoutez des produits depuis le catalogue pour commencer votre commande</p>
                    <button onClick={() => navigate('/client/catalog')} className="btn-primary">
                        Voir le catalogue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>
                    <ShoppingCart size={32} />
                    Mon Panier ({cart.length} produit{cart.length > 1 ? 's' : ''})
                </h1>
            </div>

            {error && (
                <div className="error-banner">
                    <p>{error}</p>
                </div>
            )}

            <div className="cart-layout">
                <div className="cart-items-section">
                    <div className="cart-items-card">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Prix Unitaire (HT)</th>
                                    <th>Quantité</th>
                                    <th>Total (HT)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.productId}>
                                        <td>
                                            <div className="product-info">
                                                <span className="product-name">{item.productName}</span>
                                                {item.quantity > item.stockAvailable && (
                                                    <span className="stock-warning">
                                                        ⚠ Stock disponible: {item.stockAvailable}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="price">{item.unitPrice.toFixed(2)} DH</td>
                                        <td>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="qty-btn"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="qty-btn"
                                                    disabled={item.quantity >= item.stockAvailable}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="price total">{(item.unitPrice * item.quantity).toFixed(2)} DH</td>
                                        <td>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="remove-btn"
                                                title="Retirer du panier"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h3>Récapitulatif</h3>

                        <div className="promo-input-group">
                            <label>
                                <Tag size={16} />
                                Code Promo
                            </label>
                            <input
                                type="text"
                                placeholder="PROMO-XXXX"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                maxLength={10}
                                className="promo-input"
                            />
                            <small className="promo-hint">Format: PROMO-XXXX (optionnel)</small>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Sous-total HT</span>
                            <span className="amount">{subtotalHT.toFixed(2)} DH</span>
                        </div>

                        <div className="summary-note">
                            <p>Les remises fidélité et promo seront appliquées lors de la validation.</p>
                            <p>La TVA (20%) sera calculée automatiquement.</p>
                        </div>

                        <div className="summary-divider"></div>

                        <button
                            onClick={handleSubmitOrder}
                            disabled={submitting}
                            className="submit-order-btn"
                        >
                            {submitting ? 'Validation en cours...' : 'Valider la commande'}
                        </button>

                        <button
                            onClick={() => navigate('/client/catalog')}
                            className="continue-shopping-btn"
                        >
                            Continuer mes achats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientCartPage;
