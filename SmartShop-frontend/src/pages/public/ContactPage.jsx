import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate API call
        setTimeout(() => {
            setSending(false);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1>Get in <span className="text-gradient">Touch</span></h1>
                <p className="subtitle">We'd love to hear from you. Our team is always here to chat.</p>
            </div>

            <div className="contact-container">
                <div className="contact-info">
                    <Card className="info-card">
                        <h2>Contact Information</h2>
                        <p className="info-desc">Fill up the form and our team will get back to you within 24 hours.</p>

                        <div className="info-items">
                            <div className="info-item">
                                <Phone className="icon" size={20} />
                                <span>+212 5 22 12 34 56</span>
                            </div>
                            <div className="info-item">
                                <Mail className="icon" size={20} />
                                <span>contact@smartshop.ma</span>
                            </div>
                            <div className="info-item">
                                <MapPin className="icon" size={20} />
                                <span>123 Tech Park, Sidi Maarouf, Casablanca, Morocco</span>
                            </div>
                        </div>

                        <div className="social-links">
                            {/* Social placeholders */}
                            <div className="social-circle"></div>
                            <div className="social-circle"></div>
                            <div className="social-circle"></div>
                        </div>
                    </Card>
                </div>

                <div className="contact-form-wrapper">
                    <Card className="form-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <Input
                                    label="Your Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <Input
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="How can we help?"
                                required
                            />
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    className="textarea-input"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                loading={sending}
                                className="submit-btn"
                                icon={<Send size={18} />}
                            >
                                {success ? 'Message Sent!' : 'Send Message'}
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
