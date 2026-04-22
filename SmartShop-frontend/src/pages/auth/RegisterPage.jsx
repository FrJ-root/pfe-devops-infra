import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { UserPlus, AlertCircle } from 'lucide-react';
import '../auth/LoginPage.css';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // Clear error for this field
        setErrors(prev => ({
            ...prev,
            [e.target.name]: ''
        }));
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setGlobalError('');

        try {
            await clientService.create(formData);
            // Registration successful, redirect to login
            navigate('/login', {
                state: { message: 'Registration successful! Please login.' }
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            setGlobalError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">


                <div className="auth-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '16px' }}>
                        <UserPlus size={32} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join SmartShop and start trading today.</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="auth-form">
                        {globalError && (
                            <div className="error-alert">
                                <AlertCircle size={18} />
                                <span>{globalError}</span>
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            error={errors.name}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            error={errors.username}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            error={errors.password}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit-btn"
                        >
                            Register
                        </Button>

                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
