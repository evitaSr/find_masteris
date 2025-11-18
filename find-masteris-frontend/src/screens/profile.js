import { useEffect, useState } from 'react';
import CustomBody from '../components/customBody';
import { useAuth } from '../context/authContext';
import { UserDetails } from '../models/fullUser';
import api from '../api/api';

export default function Profile() {
	const { user } = useAuth();
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		if (!user) return;
		async function fetchData() {
			console.log(user);
			const response = await api.get(`user/${user.id}/`);
			console.log(response);
			if (response && response.data) {
				const data = response.data;
				setProfile(
					new UserDetails(
						data.pk,
						data.username,
						data.role,
						data.email,
						data.date_joined
					)
				);
			}
		}
		fetchData();
	}, [user]);

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
