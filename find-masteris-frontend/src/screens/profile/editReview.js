import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
// component:
import CustomBody from '../../components/customBody';
import ReviewForm from '../../components/profile/reviewForm';

export default function EditReviewScreen() {
	const { id, categoryId, serviceId, reviewId } = useParams();
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id || !categoryId || !serviceId || !reviewId) {
			return;
		}
	}, [
		id,
		authLoaded,
		accessToken,
		navigate,
		user,
		categoryId,
		serviceId,
		reviewId,
	]);
	return (
		<CustomBody>
			<h1>Edit a review</h1>
			<ReviewForm
				id={id}
				categoryId={categoryId}
				serviceId={serviceId}
				reviewId={reviewId}
			/>
		</CustomBody>
	);
}
