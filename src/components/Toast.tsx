interface ToastProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export function Toast({ type, title, message, onClose }: ToastProps) {
  return (
    <div className="toast-container" role="status">
      <div className={`toast toast-${type}`}>
        <span className="toast-icon">{type === 'success' ? '✓' : '!'}</span>
        <div className="toast-content">
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
        <button type="button" className="toast-close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}