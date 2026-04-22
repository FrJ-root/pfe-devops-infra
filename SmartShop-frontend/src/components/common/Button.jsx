import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    icon,
    onClick,
    className = '',
    ...props
}) {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="btn-spinner"></span>}
            {icon && !loading && <span className="btn-icon">{icon}</span>}
            <span className="btn-text">{children}</span>
        </button>
    );
}
