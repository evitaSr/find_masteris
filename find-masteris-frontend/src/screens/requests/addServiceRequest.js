import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

// assets:
import { CLIENT } from '../../assets/constants/roles';
import NewRequestForm from '../../components/requests/newRequestForm';

// component:
import CustomBody from '../../components/customBody';

export default function AddServiceRequest() {
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) return;
		if (!accessToken || !user) {
			navigate('/');
		}
		if (user && user.role === CLIENT) {
			navigate('/unauthorized');
		}
	}, [authLoaded, accessToken, user, navigate]);

	return (
		<CustomBody>
			<h1>Add service</h1>
			<NewRequestForm type="service" />
		</CustomBody>
	);
}
