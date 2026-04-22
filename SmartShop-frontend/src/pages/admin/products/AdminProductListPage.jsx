import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { Plus, Edit, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
import './AdminProductListPage.css';

export default function AdminProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on search change
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        loadProducts();
    }, [page, debouncedSearch]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll(page, 10, debouncedSearch);
            // Verify structure of response data based on Spring Page interface
            const data = response;
            setProducts(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Failed to load products', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await productService.delete(id);
            // Reload current page
            loadProducts();
        } catch (err) {
            console.error('Failed to delete product', err);
            alert('Failed to delete product. It might be in use in existing orders.');
        }
    };

    return (
        <div className="admin-product-list">
            <div className="page-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Manage your product catalog, stock levels, and pricing.</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/products/new')}>
                    <Plus size={18} /> Add Product
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
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Add Filter Component Here if needed */}
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Unit Price (HT)</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th className="actions-col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="font-medium">{product.name}</td>
                                        <td>{product.unitPriceHT?.toFixed(2)} DH</td>
                                        <td>
                                            <span className={`stock-badge ${product.stockAvailable > 10 ? 'success' : product.stockAvailable > 0 ? 'warning' : 'danger'}`}>
                                                {product.stockAvailable} units
                                            </span>
                                        </td>
                                        <td>
                                            {!product.deleted ? (
                                                <span className="status-badge active">Active</span>
                                            ) : (
                                                <span className="status-badge inactive">Archived</span>
                                            )}
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="action-btn edit"
                                                onClick={() => navigate(`/products/${product.id}/edit`)}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(product.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <Button
                            variant="ghost"
                            disabled={page === 0}
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                        >
                            Previous
                        </Button>
                        <span className="page-info">
                            Page {page + 1} of {totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
