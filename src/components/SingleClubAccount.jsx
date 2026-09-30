import api from '../util/api';
import style from './ClubsCard.module.css';

const SingleClubAccount = ({ account, role, onChange }) => {
  const handleAccept = async () => {
    await api.patch(
      `${import.meta.env.VITE_API_URL}/clubs/${account.club_id}/accounts/${account.account_id}`,
      { role: 'member' }
    );
    onChange();
  };
  const handleDelete = async () => {
    await api.delete(
      `${import.meta.env.VITE_API_URL}/clubs/${account.club_id}/accounts/${account.account_id}`
    );
    onChange();
  };
  return (
    <div className={style.card}>
      <p>
        {account.email} {account.role}
      </p>
      {role === 'owner' && (
        <div>
          {account.role === 'pending' && (
            <button onClick={handleAccept}>Accept</button>
          )}
          {account.role !== 'owner' && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleClubAccount;
