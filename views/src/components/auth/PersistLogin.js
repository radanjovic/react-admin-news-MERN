import {Outlet} from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';

import LoadingSpinner from '../UI/LoadingSpinner';

// Persist login state by sending all new reqs to fetch accessToken first
const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();
    const [persist] = useLocalStorage('persist', false);


    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async() => {
            try {
                await refresh();
            } catch(err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        // Avoid unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [auth?.accessToken, persist, refresh]);

    return (
        <>
            {!persist ? <Outlet /> : isLoading ? <LoadingSpinner /> : <Outlet />}
        </>
    )
}

export default PersistLogin;