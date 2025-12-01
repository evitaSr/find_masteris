import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';

// component:
import CustomBody from '../../components/customBody';
import { ADMIN } from '../../assets/constants/roles';

export default function ServiceRequestList() {
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) return;
		if (!accessToken || !user) {
			navigate('/');
		}
		if (user && user.role !== ADMIN) {
			navigate('/unauthorized');
		}
	}, [authLoaded, accessToken, user, navigate]);

	return (
		<CustomBody>
			<h1>Requests to add services</h1>
		</CustomBody>
	);
}
