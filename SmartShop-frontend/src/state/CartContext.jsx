import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('smartshop_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart from localStorage', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('smartshop_cart', JSON.stringify(cart));
    }, [cart]);

    // Add product to cart
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);

            if (existingItem) {
                // Update quantity if product already in cart
                return prevCart.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new product to cart
                return [...prevCart, {
                    productId: product.id,
                    productName: product.name,
                    unitPrice: product.unitPriceHT,
                    quantity: quantity,
                    stockAvailable: product.stockAvailable
                }];
            }
        });
    };

    // Update quantity of a product in cart
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Remove product from cart
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    // Clear entire cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate total HT (for UI display before sending to backend)
    const calculateSubtotalHT = () => {
        return cart.reduce((total, item) => {
            return total + (item.unitPrice * item.quantity);
        }, 0);
    };

    // Get cart item count
    const getCartItemCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateSubtotalHT,
        getCartItemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
