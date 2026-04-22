import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Zap, ArrowRight, Github } from 'lucide-react';
import Button from '../../components/common/Button';
import './HomePage.css';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Modern B2B Commerce for <span className="text-gradient">Smart Shops</span></h1>
                    <p className="hero-subtitle">
                        The all-in-one platform to manage your products, clients, and orders with intelligent financial calculations and loyalty programs.
                    </p>
                    <div className="hero-actions">
                        <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
                            Get Started <ArrowRight size={18} />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                            Live Demo
                        </Button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="glass-card main-visual">
                        <div className="visual-header">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                        </div>
                        <div className="visual-content">
                            <div className="mock-chart"></div>
                            <div className="mock-list">
                                <div className="mock-item"></div>
                                <div className="mock-item"></div>
                                <div className="mock-item"></div>
                            </div>
                        </div>
                    </div>
                    <div className="floating-badge badge-1">
                        <Zap size={20} /> Smart Pricing
                    </div>
                    <div className="floating-badge badge-2">
                        <ShieldCheck size={20} /> Secure Payments
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Why Choose <span className="text-secondary">SmartShop?</span></h2>
                    <p>Built with modern technology to scale your business efficiently.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon primary">
                            <ShoppingBag size={24} />
                        </div>
                        <h3>Inventory Management</h3>
                        <p>Track your stock levels in real-time and manage your product catalog with ease.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon secondary">
                            <Zap size={24} />
                        </div>
                        <h3>Loyalty Program</h3>
                        <p>Automatically calculate discounts based on client tiers and purchase history.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon success">
                            <ShieldCheck size={24} />
                        </div>
                        <h3>Fractional Payments</h3>
                        <p>Support multiple payment methods and track partial payments for every order.</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="about-content">
                    <div className="about-text">
                        <h2>About SmartShop</h2>
                        <p>
                            SmartShop is a comprehensive B2B solution designed to bridge the gap between complex business logic and intuitive user experiences. Our platform simplifies the entire sales cycle, from product discovery to final payment settlement.
                        </p>
                        <div className="about-stats">
                            <div className="about-stat">
                                <h4>99.9%</h4>
                                <span>Uptime</span>
                            </div>
                            <div className="about-stat">
                                <h4>15%</h4>
                                <span>Avg. Growth</span>
                            </div>
                            <div className="about-stat">
                                <h4>24/7</h4>
                                <span>Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-image">
                        {/* Abstract design elements */}
                        <div className="abstract-shape shape-1"></div>
                        <div className="abstract-shape shape-2"></div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="glass-card contact-card">
                    <h2>Ready to transform your business?</h2>
                    <p>Get in touch with our team for a personalized demo or custom integration.</p>
                    <div className="contact-actions">
                        <Button variant="primary" size="lg">Contact Us</Button>
                        <Button variant="ghost" size="lg">
                            <Github size={20} /> View Github
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-logo">Smart<span>Shop</span></div>
                    <p>&copy; 2026 SmartShop Inc. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
