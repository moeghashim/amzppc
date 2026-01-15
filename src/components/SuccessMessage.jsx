import './SuccessMessage.css';

export default function SuccessMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="success-message">
      <div className="success-content">
        <span className="success-icon">✓</span>
        <span className="success-text">{message}</span>
        {onClose && (
          <button onClick={onClose} className="success-close" aria-label="Close success message">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
