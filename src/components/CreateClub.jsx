import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Signup.module.css';
import api from '../util/api';

const CreateClub = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    if (name === '') return setError('Must have a name');

    try {
      await api.post(`${import.meta.env.VITE_API_URL}/clubs`, {
        name,
        description,
      });
      onCreate();

      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className={styles.container}>
        <div className={styles.formCard}>
          <h1>Club created successfully</h1>
          <Link className={styles.primaryLink} to="/">
            Continue to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.formCard}>
        <h1>Create club</h1>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="create-club-name">Name</label>
          <input
            id="create-club-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="create-club-description">Description</label>
          <input
            id="create-club-description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            Create club
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateClub;
