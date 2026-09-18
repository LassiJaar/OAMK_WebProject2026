import { useContext } from 'react';
import { AccountContext } from './AccountContext';
export const useAccount = () => {
  return useContext(AccountContext);
};
