import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			error.response?.data?.code === 'token_not_valid' &&
			!originalRequest._retry
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers['Authorization'] =
							'Bearer ' + token;
						return api(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;
			try {
				const refreshToken = localStorage.getItem('refreshToken');
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}token/refresh/`,
					{
						refresh: refreshToken,
					}
				);

				const newAccessToken = response.data.access;

				setAuthHeader(newAccessToken);
				localStorage.setItem('accessToken', newAccessToken);
				processQueue(null, newAccessToken);
				originalRequest.headers['Authorization'] =
					'Bearer ' + newAccessToken;
				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				clearAuthHeader();
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.href = '/';
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}
		return Promise.reject(error);
	}
);

export const setAuthHeader = (accessToken) => {
	api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const clearAuthHeader = () => {
	delete api.defaults.headers.common['Authorization'];
};

export default api;
