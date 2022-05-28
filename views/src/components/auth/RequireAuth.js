import {useLocation, Navigate, Outlet} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Protect views, send unauthorized users to /login, but save page where they wanted to go
const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

  return (
    auth?.accessToken ? <Outlet /> : <Navigate to='/login' state={{from: location}} replace />
  )
}

export default RequireAuth;