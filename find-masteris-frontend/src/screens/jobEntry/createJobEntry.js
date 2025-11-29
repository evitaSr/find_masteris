import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

// Components:
import CustomBody from '../../components/customBody';
import JobEntryForm from '../../components/jobEntry/jobEntryForm';
export function CreateJobEntry() {
	const { id } = useParams();
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user || !id) {
			navigate('/');
		}
	});
	return (
		<CustomBody>
			<h2>Create job entry</h2>
			<JobEntryForm handymanId={id} />
		</CustomBody>
	);
}
