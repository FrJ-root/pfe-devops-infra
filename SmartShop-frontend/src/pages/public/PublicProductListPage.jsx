import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Search, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PublicProductListPage.css';

export default function PublicProductListPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for public display
    const products = [
        { id: 1, name: 'Premium Laptop Stand', price: 450, category: 'Accessories', image: 'bg-blue-100' },
        { id: 2, name: 'Wireless Ergonomic Mouse', price: 299, category: 'Peripherals', image: 'bg-green-100' },
        { id: 3, name: 'Mechanical Keyboard RGB', price: 890, category: 'Peripherals', image: 'bg-purple-100' },
        { id: 4, name: 'HD Webcam 1080p', price: 350, category: 'Electronics', image: 'bg-red-100' },
        { id: 5, name: 'Noise Cancelling Headset', price: 1200, category: 'Audio', image: 'bg-yellow-100' },
        { id: 6, name: 'USB-C Docking Station', price: 750, category: 'Accessories', image: 'bg-indigo-100' },
    ];

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="public-products-page">
            <div className="products-header">
                <h1>Our <span className="text-gradient">Catalog</span></h1>
                <p className="subtitle">Explore our variety of high-quality products for your business needs.</p>

                <div className="search-bar-wrapper">
                    <div className="search-input-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="product-card">
                        <div className={`product-image ${product.image}`}>
                            <ShoppingBag size={48} className="product-placeholder-icon" />
                        </div>
                        <div className="product-info">
                            <div className="product-meta">
                                <span className="product-category"><Tag size={12} /> {product.category}</span>
                                <span className="product-price">{product.price.toFixed(2)} DH</span>
                            </div>
                            <h3>{product.name}</h3>
                            <p className="product-desc">High quality {product.name.toLowerCase()} suitable for professional use.</p>

                            <Button
                                variant="outline"
                                className="view-btn"
                                onClick={() => navigate('/login')}
                                fullWidth
                            >
                                Login to Order <ArrowRight size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-results">
                    <p>No products found matching "{searchTerm}"</p>
                </div>
            )}

            <div className="cta-section">
                <Card className="cta-card">
                    <h2>Ready to place an order?</h2>
                    <p>Create an account today to access wholesale pricing and bulk ordering.</p>
                    <div className="cta-buttons">
                        <Button variant="primary" onClick={() => navigate('/register')}>Register Now</Button>
                        <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
