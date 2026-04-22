import { useState, useEffect } from 'react';
import { User, Mail, Award, ShoppingBag, DollarSign } from 'lucide-react';
import { useAuth } from '../../../state/AuthContext';
import clientService from '../../../services/clientService';
import './ClientProfilePage.css';

const ClientProfilePage = () => {
    const { user } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClientData();
    }, []);

    const loadClientData = async () => {
        try {
            setLoading(true);
            setError('');
            // Assuming user.id corresponds to client ID
            const data = await clientService.getById(user.id);
            setClientData(data);
        } catch (err) {
            console.error('Failed to load client data', err);
            setError('Impossible de charger vos informations');
        } finally {
            setLoading(false);
        }
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'PLATINUM':
                return 'tier-platinum';
            case 'GOLD':
                return 'tier-gold';
            case 'SILVER':
                return 'tier-silver';
            case 'BASIC':
            default:
                return 'tier-basic';
        }
    };

    const getTierLabel = (tier) => {
        switch (tier) {
            case 'PLATINUM':
                return 'Platine';
            case 'GOLD':
                return 'Or';
            case 'SILVER':
                return 'Argent';
            case 'BASIC':
            default:
                return 'Basique';
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Chargement de votre profil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="error-message">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!clientData) return null;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>
                    <User size={32} />
                    Mon Profil
                </h1>
            </div>

            <div className="profile-grid">
                {/* Profile Info */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        <User size={64} />
                    </div>
                    <h2>{clientData.name}</h2>
                    <div className="profile-info-row">
                        <Mail size={18} />
                        <span>{clientData.email}</span>
                    </div>
                    <div className={`tier-badge ${getTierColor(clientData.tier)}`}>
                        <Award size={20} />
                        Niveau {getTierLabel(clientData.tier)}
                    </div>
                </div>

                {/* Statistics */}
                <div className="stats-card">
                    <h3>Statistiques</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-icon orders">
                                <ShoppingBag size={24} />
                            </div>
                            <div className="stat-details">
                                <span className="stat-value">{clientData.totalOrders}</span>
                                <span className="stat-label">Commandes confirmées</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon spending">
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-details">
                                <span className="stat-value">{clientData.totalSpent?.toFixed(2) || '0.00'} DH</span>
                                <span className="stat-label">Montant total dépensé</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loyalty Info */}
                <div className="loyalty-card">
                    <h3>
                        <Award size={24} />
                        Programme de Fidélité
                    </h3>
                    <div className="loyalty-info">
                        <p className="loyalty-text">
                            Votre niveau actuel: <strong>{getTierLabel(clientData.tier)}</strong>
                        </p>
                        <div className="loyalty-benefits">
                            <h4>Avantages selon votre niveau:</h4>
                            <ul>
                                <li><strong>Basique:</strong> Pas de remise</li>
                                <li><strong>Argent:</strong> 5% de remise (commande ≥ 500 DH)</li>
                                <li><strong>Or:</strong> 10% de remise (commande ≥ 800 DH)</li>
                                <li><strong>Platine:</strong> 15% de remise (commande ≥ 1200 DH)</li>
                            </ul>
                        </div>
                        <div className="tier-progression">
                            <h4>Comment progresser?</h4>
                            <ul>
                                <li><strong>Argent:</strong> 3 commandes OU 1000 DH dépensés</li>
                                <li><strong>Or:</strong> 10 commandes OU 5000 DH dépensés</li>
                                <li><strong>Platine:</strong> 20 commandes OU 15000 DH dépensés</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfilePage;
