import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

export const setAuthHeader = (accessToken) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization'];
};

export default api;
