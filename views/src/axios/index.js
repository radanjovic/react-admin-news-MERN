import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/v1';

// Default axios requests
export default axios.create({
    baseURL: BASE_URL
});

// Private axios requests - for requesting protected data (where authentication/authorization is needed)
export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosFile = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'multipart/form-data'},
    withCredentials: true
});