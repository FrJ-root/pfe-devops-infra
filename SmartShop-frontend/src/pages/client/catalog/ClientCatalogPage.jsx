import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Package } from 'lucide-react';
import { useCart } from '../../../state/CartContext';
import productService from '../../../services/productService';
import './ClientCatalogPage.css';

const ClientCatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, [page, search]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await productService.getAll(page, 12, search);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Failed to load products', err);
            setError('Impossible de charger les produits');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        // Optional: Show toast notification
        alert(`${product.name} ajouté au panier !`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        loadProducts();
    };

    if (loading && products.length === 0) {
        return (
            <div className="catalog-loading">
                <div className="spinner"></div>
                <p>Chargement des produits...</p>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            <div className="catalog-header">
                <h1>
                    <Package size={32} />
                    Catalogue Produits
                </h1>
                <div className="header-actions">
                    <p className="subtitle">Découvrez notre sélection de matériel professionnel</p>
                    <button onClick={() => navigate('/client/cart')} className="header-cart-btn">
                        <ShoppingCart size={20} />
                        <span>Mon Panier ({useCart().getCartItemCount()})</span>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button type="submit" className="search-btn">
                    Rechercher
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            <Package size={64} />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">
                                {product.unitPriceHT.toFixed(2)} DH
                                <span className="price-label">HT</span>
                            </p>
                            <div className="product-stock">
                                {product.stockAvailable > 0 ? (
                                    <span className="stock-badge in-stock">
                                        ✓ En stock ({product.stockAvailable})
                                    </span>
                                ) : (
                                    <span className="stock-badge out-of-stock">
                                        ✗ Rupture de stock
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stockAvailable === 0}
                                className="add-to-cart-btn"
                            >
                                <ShoppingCart size={18} />
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className="empty-state">
                    <Package size={64} />
                    <p>Aucun produit trouvé</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="pagination-btn"
                    >
                        Précédent
                    </button>
                    <span className="pagination-info">
                        Page {page + 1} sur {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="pagination-btn"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientCatalogPage;
