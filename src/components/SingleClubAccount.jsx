import api from '../util/api';
import styles from './SingleClubAccount.module.css';

const SingleClubAccount = ({ account, role, onChange }) => {
  const handleAccept = async () => {
    try {
      await api.patch(
        `${import.meta.env.VITE_API_URL}/clubs/${account.club_id}/accounts/${account.account_id}`,
        { role: 'member' }
      );

      onChange();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/clubs/${account.club_id}/accounts/${account.account_id}`
      );

      onChange();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.memberInfo}>
        <span className={styles.email}>{account.email}</span>
        <span className={styles.role}>{account.role}</span>
      </div>

      {role === 'owner' && (
        <div className={styles.actions}>
          {account.role === 'pending' && (
            <button onClick={handleAccept}>Accept</button>
          )}

          {account.role !== 'owner' && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleClubAccount;
