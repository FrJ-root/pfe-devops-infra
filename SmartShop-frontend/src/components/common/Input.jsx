import './Input.css';

export default function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) {
    const inputClass = `input ${error ? 'input-error' : ''} ${className}`;

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={inputClass}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}
