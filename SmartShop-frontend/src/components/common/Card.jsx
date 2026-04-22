import './Card.css';

export default function Card({
    children,
    title,
    subtitle,
    className = '',
    ...props
}) {
    return (
        <div className={`card ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="card-header">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}
