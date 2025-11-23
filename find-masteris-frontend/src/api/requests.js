import api from './api';
import { HANDYMAN } from '../assets/constants/roles';

export const getFullUserInfo = async (id) => {
	let response = await api.get(`user/${id}/`);
	if (response && response.data && response.data.role === HANDYMAN) {
		response = await api.get(`handyman/${id}/`);
	}
	return response;
};
