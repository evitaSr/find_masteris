import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

// assets:
import { CLIENT } from '../../assets/constants/roles';

// component:
import CustomBody from '../../components/customBody';
import NewRequestForm from '../../components/requests/newRequestForm';

export default function AddCategoryRequest() {
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
			<h1>Add category</h1>
			<NewRequestForm type="category" />
		</CustomBody>
	);
}
