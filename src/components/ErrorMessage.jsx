import './ErrorMessage.css';

export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
        {onClose && (
          <button onClick={onClose} className="error-close" aria-label="Close error">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
