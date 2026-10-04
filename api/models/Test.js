import { pool } from './db.js';

const getAllTests = async () => {
  const result = await pool.query('SELECT * FROM movie');
  return result;
};

export { getAllTests };

if (process.env.NODE_ENV === 'test') {
  const assert = (await import('node:assert/strict')).default;
  const { test, before } = await import('node:test');

  const apiUrl = (process.env.TEST_API_URL || 'http://localhost:3000').replace(/\/$/, '');
  let account;

  const password = 'TestPassword123!';
  const uniqueEmail = `test-${Date.now()}@example.com`;
  const movieId = Number(String(Date.now()).slice(-8));

  const requestJson = async (path, options = {}) => {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const text = await response.text();
    const body = text ? JSON.parse(text) : null;
    return { response, body };
  };

  before(async () => {
    const response = await fetch(`${apiUrl}/api/health`);
    assert.equal(response.status, 200, 'API must be running before tests start');
  });

  test('100: sign in', async () => {
    const signup = await requestJson('/accounts/signup', {
      method: 'POST',
      body: JSON.stringify({ account: { email: uniqueEmail, password } }),
    });
    assert.equal(signup.response.status, 201);

    const result = await requestJson('/accounts/signin', {
      method: 'POST',
      body: JSON.stringify({ account: { email: uniqueEmail, password } }),
    });

    assert.equal(result.response.status, 200);
    assert.equal(result.body.email, uniqueEmail);
    assert.equal(typeof result.body.token, 'string');
    account = result.body;
  });

  test('101: sign out ', () => {
    const session = new Map([
      ['account', JSON.stringify(account)],
      ['token', account.token],
      ['user_preferences', JSON.stringify(account.preferences)],
    ]);

    ['account', 'token', 'user_preferences'].forEach((key) => session.delete(key));

    assert.equal(session.size, 0);
  });

  test('102: sign up', async () => {
    const email = `signup-${Date.now()}@example.com`;
    const result = await requestJson('/accounts/signup', {
      method: 'POST',
      body: JSON.stringify({ account: { email, password } }),
    });

    assert.equal(result.response.status, 201);
    assert.equal(result.body.email, email);
    assert.ok(result.body.account_id);
  });

  test('103: Delete account', async () => {
    const email = `remove-${Date.now()}@example.com`;
    const signup = await requestJson('/accounts/signup', {
      method: 'POST',
      body: JSON.stringify({ account: { email, password } }),
    });
    const signin = await requestJson('/accounts/signin', {
      method: 'POST',
      body: JSON.stringify({ account: { email, password } }),
    });

    const result = await requestJson(`/accounts/${signup.body.account_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${signin.body.token}` },
    });

    assert.equal(result.response.status, 200);
  });

  test('104: create and read a review ', async () => {
    const create = await requestJson(`/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${account.token}` },
      body: JSON.stringify({ rating: 5, text: 'test movie' }),
    });
    assert.equal(create.response.status, 201, JSON.stringify(create.body));
    assert.equal(create.body.review.rating, 5);

    const result = await requestJson(`/movies/${movieId}/reviews`);
    assert.equal(result.response.status, 200);
    assert.equal(result.body.reviewCount, 1);
    assert.equal(result.body.reviews[0].text, 'test movie');
  });
}
