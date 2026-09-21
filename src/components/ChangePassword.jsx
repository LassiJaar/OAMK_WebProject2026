import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Signup.module.css';
import { useAccount } from '../context/useAccount';
import api from '../util/api';

const ChangePassword = () => {
  const { account } = useAccount();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await api.patch(
        `${import.meta.env.VITE_API_URL}/accounts/${account.account_id}`,
        { oldPassword, newPassword }
      );

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
          <h1>Password change Successful</h1>
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
        <h1>Change Password</h1>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="change-pass-old">Old Password</label>
          <input
            id="change-pass-old"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
            autoComplete="password"
            required
          />

          <label htmlFor="change-pass-new">New Password</label>
          <input
            id="change-pass-new"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            Change password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
