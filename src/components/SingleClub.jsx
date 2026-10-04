import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAccount } from '../context/useAccount';
import api from '../util/api';
import SingleClubAccount from './SingleClubAccount';
import styles from './SingleClub.module.css';
import ClubMovies from './ClubMovies';

const DEFAULT_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/6/6c/Image.svg';

const SingleClub = () => {
  const { account } = useAccount();
  const { club_id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const clubResponse = await api.get(
        `${import.meta.env.VITE_API_URL}/clubs/${club_id}`
      );

      setClub(clubResponse.data);

      if (!account) {
        setRole(null);
        setMembers([]);
        return;
      }

      const roleResponse = await api.get(
        `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts/me`
      );

      const currentRole = roleResponse.data?.role || null;
      setRole(currentRole);

      if (currentRole === 'owner' || currentRole === 'member') {
        const membersResponse = await api.get(
          `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts`
        );

        setMembers(membersResponse.data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not load this club.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account, club_id]);

  const handleLeave = async () => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/clubs/${club_id}/accounts/me`
      );

      navigate('/clubs');
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not leave the club.'
      );
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/clubs/${club_id}`);

      navigate('/clubs');
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Could not delete the club.'
      );
    }
  };

  if (loading) {
    return <p className={styles.message}>Loading club...</p>;
  }

  if (error) {
    return (
      <p className={styles.error} role="alert">
        {error}
      </p>
    );
  }

  if (!club) {
    return <p className={styles.error}>Club not found.</p>;
  }

  return (
    <main className={styles.page}>
      <Link to="/clubs" className={styles.backLink}>
        ← Back to clubs
      </Link>

      <section className={styles.hero}>
        <div className={styles.heroMain}>
          <img
            src={club.image_url || DEFAULT_IMAGE}
            alt=""
            className={styles.heroImage}
          />

          <div className={styles.heroContent}>
            <div className={styles.titleRow}>
              <div>
                <h1>{club.name}</h1>

                {role && <span className={styles.role}>{role}</span>}
              </div>
            </div>

            {club.description && (
              <p className={styles.description}>{club.description}</p>
            )}

            <div className={styles.actions}>
              {!account && (
                <Link to="/account" className={styles.primaryButton}>
                  Sign in to join
                </Link>
              )}

              {account && !role && (
                <JoinButton clubId={club_id} onJoin={fetchData} />
              )}

              {(role === 'member' || role === 'pending') && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleLeave}
                >
                  {role === 'pending' ? 'Cancel request' : 'Leave club'}
                </button>
              )}

              {role === 'owner' && (
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={handleDelete}
                >
                  Delete club
                </button>
              )}
            </div>
          </div>
        </div>

        {role === 'owner' && (
          <div className={styles.settingsArea}>
            <button
              type="button"
              className={styles.settingsButton}
              onClick={() => setShowSettings((current) => !current)}
            >
              {showSettings ? 'Hide settings' : 'Settings'}
            </button>

            {showSettings && <ClubSettings club={club} onSave={fetchData} />}
          </div>
        )}
      </section>

      <div className={styles.sections}>
        {(role === 'owner' || role === 'member') && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <h2>Members</h2>
                <span>{members.length}</span>
              </div>

              <p>People who belong to this club.</p>
            </div>

            <div className={styles.members}>
              {members.map((member) => (
                <SingleClubAccount
                  key={member.account_id}
                  account={member}
                  role={role}
                  onChange={fetchData}
                />
              ))}
            </div>
          </section>
        )}

        {(role === 'owner' || role === 'member') && (
          <ClubMovies clubId={club_id} role={role} />
        )}
      </div>
    </main>
  );
};

const JoinButton = ({ clubId, onJoin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post(`${import.meta.env.VITE_API_URL}/clubs/${clubId}`);

      await onJoin();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Could not request to join the club.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleJoin}
        disabled={loading}
      >
        {loading ? 'Requesting...' : 'Request to join'}
      </button>

      {error && <span className={styles.actionError}>{error}</span>}
    </>
  );
};

const ClubSettings = ({ club, onSave }) => {
  const [name, setName] = useState(club.name || '');
  const [description, setDescription] = useState(club.description || '');
  const [imageUrl, setImageUrl] = useState(club.image_url || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Club name is required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await api.put(`${import.meta.env.VITE_API_URL}/clubs/${club.club_id}`, {
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
      });

      setMessage('Changes saved.');
      await onSave();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.settings}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Club settings</h2>
          <p>Only the club owner can edit these settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="club-name">Name</label>
        <input
          id="club-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="club-description">Description</label>
        <textarea
          id="club-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="4"
        />

        <label htmlFor="club-image">Image URL</label>
        <input
          id="club-image"
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://example.com/image.jpg"
        />

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>

        {message && <p className={styles.success}>{message}</p>}

        {error && (
          <p className={styles.actionError} role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
};

export default SingleClub;
