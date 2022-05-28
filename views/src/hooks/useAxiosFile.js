import { axiosFile } from "../axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosFile = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        // Intercept first request and add access token to it
        const requestIntercept = axiosFile.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Access token expired - try to refresh it, if refresh token is still valid
        const responseIntercept = axiosFile.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // avoid loop
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosFile(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        // Clean-up for unmount
        return () => {
            axiosFile.interceptors.request.eject(requestIntercept);
            axiosFile.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosFile;
}

export default useAxiosFile;
