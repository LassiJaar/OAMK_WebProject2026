import { useEffect, useState } from 'react';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import { Navigate, useNavigate, useParams } from 'react-router';
import SingleClubAccount from './SingleClubAccount';

const SingleClub = () => {
  const { account } = useAccount();
  const { club_id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLeave = async () => {
    const result = await api.delete(
      `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts/me`
    );
    console.log(result);
    await fetchData();
  };
  const handleDelete = async () => {
    await api.delete(`${import.meta.env.VITE_API_URL}/clubs/${club_id}`);
    navigate('/clubs');
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const clubResponse = await api.get(
        `${import.meta.env.VITE_API_URL}/clubs/${club_id}`
      );
      setClub(clubResponse.data);
      const clubAccountResponse = await api.get(
        `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts`
      );
      setMembers(clubAccountResponse.data);
      if (account) {
        const clubRoleResponse = await api.get(
          `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts/me`
        );
        setRole(clubRoleResponse.data.role);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {club && (
        <div>
          {role !== 'owner' && <button onClick={handleLeave}>Leave</button>}
          {role === 'owner' && <button onClick={handleDelete}>Delete</button>}
          <p>{role}</p>
          <h2>{club.name}</h2>
          <p>{club.description}</p>
          {members &&
            members.map((m) => (
              <SingleClubAccount
                key={m.account_id}
                account={m}
                role={role}
                onChange={fetchData}
              ></SingleClubAccount>
            ))}
        </div>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default SingleClub;
