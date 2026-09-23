import { useState } from 'react';
import { AccountContext } from './AccountContext.js';
import axios from 'axios';
const AccountProvider = ({ children }) => {
  const accountFromStorage = sessionStorage.getItem('account');
  const [account, setAccount] = useState(
    accountFromStorage ? JSON.parse(accountFromStorage) : null
  );
  const signUp = async () => {
    const headers = { headers: { 'Content-Type': 'application/json' } };
    await axios.post(
      `${import.meta.env.VITE_API_URL}/accounts/signup`,
      JSON.stringify({ account: account }),
      headers
    );
    setAccount({ email: '', password: '' });
  };
  const signIn = async (credentials) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/accounts/signin`,
      { account: credentials }
    );
    setAccount(response.data);
    sessionStorage.setItem('account', JSON.stringify(response.data));
    sessionStorage.setItem('token', response.data.token);
    if (response.data.preferences) {
      sessionStorage.setItem('user_preferences', JSON.stringify(response.data.preferences));
    }
  };
  const signOut = async () => {
    sessionStorage.removeItem('account');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_preferences'); 
    setAccount(null);
  };
  return (
    <AccountContext.Provider
      value={{ account, setAccount, signUp, signIn, signOut }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
