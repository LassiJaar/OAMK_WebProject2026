import { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ setModal, children }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setModal]);

  return (
    <div
      className={styles.modal}
      onClick={() => setModal(false)}
      role="presentation"
    >
      <div
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setModal(false)}
          aria-label="Close dialog"
          title="Close"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
