import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';
// component:
import CustomBody from '../../components/customBody';
import JobEntryForm from '../../components/jobEntry/jobEntryForm';

export default function EditJobEntry() {
	const { id, categoryId, serviceId, jobEntryId } = useParams();
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user || !id) {
			navigate('/');
		}
	}, [authLoaded, accessToken, id, user, navigate]);

	return (
		<CustomBody>
			<h1>Edit job entry</h1>
			<JobEntryForm
				handymanId={id}
				categoryId={categoryId}
				serviceId={serviceId}
				jobEntryId={jobEntryId}
			/>
		</CustomBody>
	);
}
