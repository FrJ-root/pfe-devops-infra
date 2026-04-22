import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '', // Assuming email is available in user object, otherwise mock it
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API update
        setTimeout(() => {
            setLoading(false);
            alert('Profile updated successfully!');
        }, 1500);
    };

    return (
        <div className="profile-page">
            <div className="profile-header-card">
                <div className="profile-cover"></div>
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        <User size={64} />
                    </div>
                    <button className="camera-btn">
                        <Camera size={18} />
                    </button>
                </div>
                <div className="profile-identity">
                    <h1>{user?.username}</h1>
                    <span className={`role-badge ${user?.role?.toLowerCase()}`}>{user?.role}</span>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-sidebar">
                    <Card className="info-card">
                        <h3>Account Info</h3>
                        <div className="info-item">
                            <User size={18} />
                            <span>{user?.username}</span>
                        </div>
                        <div className="info-item">
                            <Mail size={18} />
                            <span>{user?.email || 'No email set'}</span>
                        </div>
                        <div className="info-item">
                            <Shield size={18} />
                            <span>Role: {user?.role}</span>
                        </div>
                    </Card>
                </div>

                <div className="profile-content">
                    <Card>
                        <div className="card-header">
                            <h3>Edit Profile</h3>
                            <p>Update your personal information and security settings.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <Input
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    icon={<User size={18} />}
                                    disabled // Prevent username change for now
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<Mail size={18} />}
                                />
                            </div>

                            <div className="divider"></div>

                            <h4>Change Password</h4>
                            <div className="form-row">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-row">
                                <Input
                                    label="New Password"
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-actions">
                                <Button type="submit" variant="primary" loading={loading} icon={<Save size={18} />}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
