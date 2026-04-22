import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../state/AuthContext';
import { CartProvider } from '../state/CartContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Pages
import HomePage from '../pages/home/HomePage';
import DashboardPage from '../pages/home/DashboardPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import PublicProductListPage from '../pages/public/PublicProductListPage';
import ProfilePage from '../pages/admin/ProfilePage';
import AdminProductListPage from '../pages/admin/products/AdminProductListPage';
import ProductFormPage from '../pages/admin/products/ProductFormPage';
import AdminOrderListPage from '../pages/admin/orders/AdminOrderListPage';
import NewOrderPage from '../pages/admin/orders/NewOrderPage';
import OrderDetailsPage from '../pages/admin/orders/OrderDetailsPage';
import AdminClientListPage from '../pages/admin/clients/AdminClientListPage';
import ClientDetailsPage from '../pages/admin/clients/ClientDetailsPage';

// Client pages
import ClientCatalogPage from '../pages/client/catalog/ClientCatalogPage';
import ClientCartPage from '../pages/client/cart/ClientCartPage';
import ClientOrdersPage from '../pages/client/orders/ClientOrdersPage';
import ClientOrderDetailsPage from '../pages/client/orders/ClientOrderDetailsPage';
import ClientProfilePage from '../pages/client/profile/ClientProfilePage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <div className="app-layout">
                        {/* The layouts now handle navigation rendering */}
                        <Routes>
                            {/* Public Routes with Navbar */}
                            <Route element={<PublicLayout />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/contact" element={<ContactPage />} />
                                <Route path="/public/products" element={<PublicProductListPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                            </Route>

                            {/* Protected Admin Routes with Sidebar */}
                            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/profile" element={<ProfilePage />} />

                                {/* Client-specific routes moved here under unified layout */}
                                <Route path="/client/catalog" element={
                                    <ProtectedRoute clientOnly>
                                        <ClientCatalogPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/client/cart" element={
                                    <ProtectedRoute clientOnly>
                                        <ClientCartPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/client/orders" element={
                                    <ProtectedRoute clientOnly>
                                        <ClientOrdersPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/client/orders/:id" element={
                                    <ProtectedRoute clientOnly>
                                        <ClientOrderDetailsPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/client/profile" element={
                                    <ProtectedRoute clientOnly>
                                        <ClientProfilePage />
                                    </ProtectedRoute>
                                } />

                                {/* Orders Routes - Admin Only */}
                                <Route path="/orders" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminOrderListPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders/new" element={
                                    <ProtectedRoute adminOnly>
                                        <NewOrderPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders/:id" element={
                                    <ProtectedRoute adminOnly>
                                        <OrderDetailsPage />
                                    </ProtectedRoute>
                                } />

                                {/* Admin-only Routes */}
                                <Route path="/products" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminProductListPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/products/new" element={
                                    <ProtectedRoute adminOnly>
                                        <ProductFormPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/products/:id/edit" element={
                                    <ProtectedRoute adminOnly>
                                        <ProductFormPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/clients" element={
                                    <ProtectedRoute adminOnly>
                                        <AdminClientListPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/clients/:id" element={
                                    <ProtectedRoute adminOnly>
                                        <ClientDetailsPage />
                                    </ProtectedRoute>
                                } />
                            </Route>

                            {/* Fallback route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
