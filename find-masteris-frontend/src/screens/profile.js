import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomBody from '../components/customBody';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { UserDetails } from '../models/fullUser';
import api from '../api/api';
import { HANDYMAN } from '../assets/constants/roles';
import '../assets/style/profile.css';
import '../assets/style/index.css';
import pfp from '../assets/images/pfp.jpg';
import { MdOutlineEmail, MdOutlineLocalPhone } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { Button } from 'react-bootstrap';

export default function Profile() {
	const { id } = useParams();
	const { accessToken, user } = useAuth();
	const [profile, setProfile] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id) return;
		async function fetchData() {
			try {
				let response = await api.get(`user/${id}/`);
				if (
					response &&
					response.data &&
					response.data.role === HANDYMAN
				) {
					response = await api.get(`handyman/${id}/`);
				}
				if (response && response.data) {
					const data = response.data;
					setProfile(
						new UserDetails(
							data.pk,
							data.username,
							data.role,
							data.email,
							data.date_joined,
							data.contact_email,
							data.phone_no,
							data.website,
							data.avg_rating
						)
					);
				}
			} catch (err) {}
		}
		fetchData();
	}, [id, accessToken, navigate, user]);

	return (
		<CustomBody>
			{profile ? (
				<div>
					<div className="inlineDivStart">
						<img src={pfp} alt="user profile" />
						<div style={{ marginTop: '2rem', padding: '0 2rem' }}>
							<div className="inlineDivCenter userTitle">
								<h1>{profile.username}</h1>
								{profile && profile.role === HANDYMAN && (
									<p>{profile.avgRating}/5</p>
								)}
							</div>
							<p className="helper">
								Member since {profile.dateJoined}
							</p>
							<div
								className="inlineDivCenter userTitle"
								style={{ marginTop: '1rem' }}
							>
								<div className="inlineDivCenter iconWithText">
									<MdOutlineEmail
										style={{ marginRight: '0.5rem' }}
									/>
									<p>
										{profile && profile.role === HANDYMAN
											? profile.contactEmail
											: profile.email}
									</p>
								</div>
								{profile.phoneNo && (
									<div className="inlineDivCenter iconWithText">
										<MdOutlineLocalPhone />
										<p>{profile.phoneNo}</p>
									</div>
								)}
							</div>
						</div>
					</div>
					{profile && user && profile.id == user.id && (
						<Button id="settingsBtn" className="iconWithText">
							<IoMdSettings />
							Settings
						</Button>
					)}
				</div>
			) : (
				<p>Loading...</p>
			)}
		</CustomBody>
	);
}
