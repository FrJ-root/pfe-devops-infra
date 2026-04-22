import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.username, formData.password);

        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">


                <div className="auth-header">
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(58, 110, 242, 0.1)', color: 'var(--primary)', marginBottom: '16px' }}>
                        <ShoppingCart size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your dashboard</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="error-alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit-btn"
                        >
                            Sign In
                        </Button>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="auth-link">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
