import styles from './Modal.module.css';
const Modal = ({ setModal, children }) => {
  return (
    <div className={styles.modal} onClick={() => setModal(false)}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default Modal;
