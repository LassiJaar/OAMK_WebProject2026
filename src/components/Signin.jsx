import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Signup.module.css';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/accounts/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: {
              email: trimmedEmail,
              password,
            },
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Sign in failed.');
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(
        requestError.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className={styles.container}>
        <div className={styles.formCard}>
          <h1>Sign in successful</h1>
          <p className={styles.success}>
            Welcome to MovieNight!
          </p>
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
        <h1>Sign in</h1>
        <p className={styles.intro}>
          Sign in to get the most out of MovieNight.
        </p>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={styles.signInText}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </section>
  );
};

export default Signin;