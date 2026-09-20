import { useAccount } from '../context/useAccount';
import { Outlet, Navigate } from 'react-router-dom';
export default function ProtectedRoute() {
  const { account } = useAccount();
  if (!account || !account.token)
    return <Navigate to="/signin" replace></Navigate>;
  return <Outlet></Outlet>;
}
