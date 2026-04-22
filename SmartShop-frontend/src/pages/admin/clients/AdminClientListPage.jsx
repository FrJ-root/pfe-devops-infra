import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../../services/clientService';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import {
    Users,
    Trophy,
    ShoppingCart,
    DollarSign,
    Eye,
    Trash2,
    Search,
    AlertCircle,
    Loader2,
    Ban,
    CheckCircle
} from 'lucide-react';
import './AdminClientListPage.css';

export default function AdminClientListPage() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getAll();
            setClients(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch clients:', err);
            setError('Could not load clients. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (id) => {
        navigate(`/clients/${id}`);
    };

    const handleToggleBlock = async (client) => {
        const isBlocked = client.status === 'BLOCKED';
        try {
            if (isBlocked) {
                await clientService.unblock(client.id);
            } else {
                await clientService.block(client.id);
            }
            // Reload the client list to reflect the status change
            fetchClients();
        } catch (err) {
            console.error('Failed to toggle block status:', err);
            alert(`Failed to ${isBlocked ? 'unblock' : 'block'} client. Please try again.`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client? This action will archive the client.')) {
            return;
        }

        try {
            await clientService.delete(id);
            // Reload the client list
            fetchClients();
        } catch (err) {
            console.error('Failed to delete client:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete client. Please try again.';
            alert(errorMessage);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTierColor = (tier) => {
        switch (tier) {
            case 'PLATINUM': return '#8b5cf6';
            case 'GOLD': return '#f59e0b';
            case 'SILVER': return '#64748b';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="admin-clients-page">
            <header className="page-header">
                <div className="header-title">
                    <Users className="header-icon" />
                    <div>
                        <h1>Clients Management</h1>
                        <p>Total: {clients.length} clients registered</p>
                    </div>
                </div>
                <div className="header-search">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <Button variant="ghost" size="sm" onClick={fetchClients}>Retry</Button>
                </div>
            )}

            <Card className="clients-card">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="animate-spin" size={40} />
                        <p>Fetching clients data...</p>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="empty-state">
                        <Users size={48} />
                        <p>{searchTerm ? 'No clients match your search.' : 'No clients found in the database.'}</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="clients-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Tier</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map(client => {
                                    const isBlocked = client.status === 'BLOCKED';
                                    return (
                                        <tr key={client.id} className={isBlocked ? 'row-blocked' : ''}>
                                            <td>
                                                <div className="client-name-cell">
                                                    <div className={`client-avatar ${isBlocked ? 'avatar-blocked' : ''}`}>
                                                        {client.name?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="client-info-stack">
                                                        <span className="font-medium">{client.name}</span>
                                                        <span className="text-muted text-xs">{client.email}</span>
                                                        {isBlocked && <span className="blocked-tag">Blocked</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="tier-badge" style={{ backgroundColor: `${getTierColor(client.tier)}15`, color: getTierColor(client.tier) }}>
                                                    <Trophy size={12} />
                                                    <span>{client.tier || 'BRONZE'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="info-item">
                                                    <ShoppingCart size={14} />
                                                    <span>{client.totalOrders} Orders</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="info-item highlight">
                                                    <DollarSign size={14} />
                                                    <span>{client.totalSpent?.toLocaleString() || '0'} DH</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="action-btns">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="btn-view"
                                                        onClick={() => handleView(client.id)}
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={isBlocked ? 'btn-unblock' : 'btn-block'}
                                                        onClick={() => handleToggleBlock(client)}
                                                        title={isBlocked ? 'Unblock Client' : 'Block Client'}
                                                    >
                                                        {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(client.id)}
                                                        title="Delete Client"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
