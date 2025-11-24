import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
// api:
import api from '../../api/api';

export default function CategoryWatcher({ setServices, error, setError }) {
	const { values } = useFormikContext();
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await api.get(
					`category/${values.category}/service/`
				);
				console.log(response);
				if (response && response.data) {
					setServices(response.data);
				}
				setError(null);
			} catch {
				if (error === null) {
					setError("Can't fetch services");
				}
			}
		};
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}

		if (!values.category) {
			return;
		}
		console.log(values.category);
		fetchServices();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.category, accessToken, authLoaded]);
}
