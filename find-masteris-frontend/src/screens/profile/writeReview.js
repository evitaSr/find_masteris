import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
// component:
import CustomBody from '../../components/customBody';
import ReviewForm from '../../components/profile/reviewForm';

export default function WriteReviewScreen() {
	const { id } = useParams();
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id) {
			return;
		}
	}, [id, authLoaded, accessToken, navigate, user]);
	return (
		<CustomBody>
			<h1>Write a review</h1>
			<ReviewForm id={id} />
		</CustomBody>
	);
}
