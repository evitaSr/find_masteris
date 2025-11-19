import { createContext, useState, useContext } from 'react';
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

	const apiUrl = process.env.REACT_APP_API_URL;

	const login = async (username, password) => {
		try {
			const response = await axios.post(`${apiUrl}token/`, {
				username: username,
				password: password,
			});
			const userData = JSON.parse(
				atob(response.data['access'].split('.')[1])
			);
			console.log(userData);
			setUser(
				new User(userData.user_id, userData.username, userData.role)
			);
			setAccessToken(response.data['access']);
			setAuthHeader(response.data['access']);
			localStorage.setItem('accessToken', response.data['access']);
			setRefreshToken(response.data['refresh']);
			localStorage.setItem('refreshToken', response.data['refresh']);
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
	};

	const value = { login, logout, accessToken, user };

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
