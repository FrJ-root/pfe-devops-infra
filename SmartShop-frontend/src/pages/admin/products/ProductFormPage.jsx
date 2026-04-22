import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../../services/productService';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import './ProductFormPage.css';

export default function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        unitPriceHT: '',
        stockAvailable: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setPageLoading(true);
            const response = await productService.getById(id);
            const product = response;
            setFormData({
                name: product.name,
                unitPriceHT: product.unitPriceHT,
                stockAvailable: product.stockAvailable
            });
        } catch (err) {
            console.error('Failed to load product', err);
            setError('Failed to load product details.');
        } finally {
            setPageLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';

        if (!formData.unitPriceHT) {
            newErrors.unitPriceHT = 'Price is required';
        } else if (Number(formData.unitPriceHT) < 0) {
            newErrors.unitPriceHT = 'Price must be positive';
        }

        if (formData.stockAvailable === '') {
            newErrors.stockAvailable = 'Stock is required';
        } else if (Number(formData.stockAvailable) < 0) {
            newErrors.stockAvailable = 'Stock cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const dataToSubmit = {
                name: formData.name,
                unitPriceHT: Number(formData.unitPriceHT),
                stockAvailable: Number(formData.stockAvailable)
            };

            if (isEditMode) {
                await productService.update(id, dataToSubmit);
            } else {
                await productService.create(dataToSubmit);
            }
            navigate('/products');
        } catch (err) {
            console.error('Failed to save product', err);
            setError(err.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="loading-container">Loading form...</div>;
    }

    return (
        <div className="product-form-page">
            <div className="page-header">
                <div>
                    <h1>{isEditMode ? 'Edit Product' : 'New Product'}</h1>
                    <p>{isEditMode ? 'Update product details and inventory.' : 'Add a new item to your catalog.'}</p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/products')}>
                    <ArrowLeft size={18} /> Back to List
                </Button>
            </div>

            {error && (
                <div className="error-alert">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="form-container">
                <Card title="Product Details">
                    <form onSubmit={handleSubmit} className="product-form">
                        <Input
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="e.g. Laptop Dell XPS 15"
                            required
                        />

                        <div className="form-row">
                            <Input
                                label="Unit Price HT (DH)"
                                name="unitPriceHT"
                                type="number"
                                value={formData.unitPriceHT}
                                onChange={handleChange}
                                error={errors.unitPriceHT}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />

                            <Input
                                label="Stock Available"
                                name="stockAvailable"
                                type="number"
                                value={formData.stockAvailable}
                                onChange={handleChange}
                                error={errors.stockAvailable}
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/products')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                icon={loading ? null : <Save size={18} />}
                            >
                                {loading ? 'Saving...' : 'Save Product'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
