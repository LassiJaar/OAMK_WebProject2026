import { useState } from 'react';
import { Link } from 'react-router';
import styles from './Signup.module.css';

const PASSWORD_MIN_LENGTH = 8;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (value) => {
    return (
      value.length >= PASSWORD_MIN_LENGTH &&
      /[A-Z]/.test(value) &&
      /\d/.test(value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter and one number.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/accounts/signup`,
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
        throw new Error(data?.error?.message || 'Registration failed.');
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
          <h1>Account created</h1>
          <p className={styles.success}>
            Your account has been created successfully.
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
        <h1>Create account</h1>
        <p className={styles.intro}>
          Create an account to get the most out of MovieNight.
        </p>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <p className={styles.hint}>
            At least 8 characters, one uppercase letter and one number.
          </p>

          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={styles.signInText}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
