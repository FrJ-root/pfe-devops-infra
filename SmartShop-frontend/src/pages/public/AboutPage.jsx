import React from 'react';
import Card from '../../components/common/Card';
import './AboutPage.css';
import { Award, Users, Globe, Target } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>About <span className="text-gradient">SmartShop</span></h1>
                <p className="subtitle">Empowering businesses with intelligent commerce solutions since 2024.</p>
            </div>

            <div className="about-content">
                <section className="mission-section">
                    <Card className="mission-card">
                        <div className="icon-wrapper">
                            <Target size={32} />
                        </div>
                        <h2>Our Mission</h2>
                        <p>
                            To revolutionize B2B commerce by providing a seamless, intelligent, and efficient platform that bridges the gap between suppliers and retailers. We believe in transparency, speed, and data-driven growth.
                        </p>
                    </Card>
                    <div className="image-placeholder gradient-1"></div>
                </section>

                <section className="values-grid">
                    <div className="value-item">
                        <Award size={40} className="value-icon" />
                        <h3>Excellence</h3>
                        <p>We strive for perfection in every code we write and every pixel we design.</p>
                    </div>
                    <div className="value-item">
                        <Users size={40} className="value-icon" />
                        <h3>Customer First</h3>
                        <p>Your success is our success. We build tools that actually solve your problems.</p>
                    </div>
                    <div className="value-item">
                        <Globe size={40} className="value-icon" />
                        <h3>Global Reach</h3>
                        <p>Connecting businesses across borders with scalable technology.</p>
                    </div>
                </section>

                <section className="story-section">
                    <div className="image-placeholder gradient-2"></div>
                    <Card className="story-card">
                        <h2>Our Story</h2>
                        <p>
                            Started as a small project to help local shops manage their inventory, SmartShop has grown into a comprehensive ecosystem. We noticed that small to medium enterprises lacked professional-grade tools that were also easy to use.
                        </p>
                        <p>
                            Today, we serve hundreds of clients, helping them process thousands of orders daily with our robust architecture and intuitive design.
                        </p>
                    </Card>
                </section>
            </div>
        </div>
    );
}
