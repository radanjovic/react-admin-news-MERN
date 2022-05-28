import { axiosAuth } from "../axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosAuth = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        // Intercept first request and add access token to it
        const requestIntercept = axiosAuth.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Access token expired - try to refresh it, if refresh token is still valid
        const responseIntercept = axiosAuth.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // avoid loop
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosAuth(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        // Clean-up for unmount
        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
            axiosAuth.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosAuth;
}

export default useAxiosAuth;

// Code inspired by Dave Gray;
