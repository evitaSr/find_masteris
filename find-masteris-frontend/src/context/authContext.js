import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { User } from '../models/user';
import { setAuthHeader, clearAuthHeader } from '../api/api';

const AuthContext = createContext({
	login: () => {},
	logout: () => {},
	accessToken: null,
	user: null,
});

export function AuthProvider({ children }) {
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem('accessToken')
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem('refreshToken')
	);
	const [user, setUser] = useState(null);
	const [authLoaded, setAuthLoaded] = useState(false);

	const apiUrl = process.env.REACT_APP_API_URL;

	const decodeAccessToken = (token) => {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch {
			return null;
		}
	};

	const login = async (username, password) => {
		try {
			const response = await axios.post(`${apiUrl}token/`, {
				username: username,
				password: password,
			});
			const userData = decodeAccessToken(response.data.access);
			console.log(userData);
			setUser(
				new User(userData.user_id, userData.username, userData.role)
			);
			setAccessToken(response.data['access']);
			setAuthHeader(response.data['access']);
			localStorage.setItem('accessToken', response.data['access']);
			setRefreshToken(response.data['refresh']);
			localStorage.setItem('refreshToken', response.data['refresh']);
			setAuthLoaded(true);
		} catch (err) {
			if (err.response && err.response.status === 401) {
				throw new Error('Credentials are not correct');
			} else {
				throw new Error('Unexpected problems when trying to login');
			}
		}
	};

	const logout = async () => {
		try {
			await axios.post(
				`${apiUrl}logout/`,
				{
					refresh: refreshToken,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
		} catch (err) {}
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		clearAuthHeader();
		setUser(null);
		setAccessToken(null);
		setRefreshToken(null);
		setAuthLoaded(false);
	};

	const setUsername = (newUsername) => {
		user.username = newUsername;
	};

	useEffect(() => {
		const refreshAccessToken = async () => {
			try {
				const res = await axios.post(`${apiUrl}token/refresh/`, {
					refresh: refreshToken,
				});

				const newAccess = res.data.access;
				const data = decodeAccessToken(newAccess);

				setAccessToken(newAccess);
				localStorage.setItem('accessToken', newAccess);
				setAuthHeader(newAccess);

				setUser(new User(data.user_id, data.username, data.role));
				return true;
			} catch (err) {
				logout();
				return false;
			}
		};

		if (!accessToken) {
			return;
		}

		const data = decodeAccessToken(accessToken);
		if (!data) {
			logout();
			return;
		}
		const isExpired = data.exp * 1000 < Date.now();

		if (isExpired) {
			const success = refreshAccessToken();
			setAuthLoaded(success);
		} else {
			setUser(new User(data.user_id, data.username, data.role));
			setAuthHeader(accessToken);
			setAuthLoaded(true);
		}
	}, [accessToken, refreshToken, apiUrl]);

	const value = { login, logout, accessToken, user, authLoaded, setUsername };

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
