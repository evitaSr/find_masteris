import { useEffect, useState } from 'react';
import CustomBody from '../components/customBody';
import { useAuth } from '../context/authContext';
import { UserDetails } from '../models/fullUser';

export default function Profile() {
	const { profileDetails } = useAuth();
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		async function fetchData() {
			let response = await profileDetails();
			if (response && response.data) {
				response = response.data;
				setProfile(
					new UserDetails(
						response.pk,
						response.username,
						response.role,
						response.email,
						response.date_joined
					)
				);
			}
		}
		fetchData();
	}, [profileDetails]);

	return (
		<CustomBody>
			<h1>Profile</h1>
			{profile && (
				<div>
					<p> {profile.username} </p>
					<p> {profile.email}</p>
					<p> {profile.role} </p>
					<p> {profile.date_joined} </p>
				</div>
			)}
		</CustomBody>
	);
}
