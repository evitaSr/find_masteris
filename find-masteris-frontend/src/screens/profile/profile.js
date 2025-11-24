import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

// api:
import { getFullUserInfo } from '../../api/requests';

// assets:
import { ADMIN, HANDYMAN } from '../../assets/constants/roles';
import '../../assets/style/profile.css';
import '../../assets/style/index.css';
import pfp from '../..//assets/images/pfp.jpg';
import {
	MdOutlineEmail,
	MdOutlineLocalPhone,
	MdOutlineRateReview,
} from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';

// components:
import CustomBody from '../../components/customBody';

// etc:
import { UserDetails } from '../../models/fullUser';

export default function Profile() {
	const { id } = useParams();
	const { accessToken, user, authLoaded } = useAuth();
	const [profile, setProfile] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id) return;
		async function fetchData() {
			try {
				const response = await getFullUserInfo(id);
				if (response && response.data) {
					const data = response.data;
					setProfile(
						new UserDetails(
							data.pk,
							data.username,
							data.first_name,
							data.last_name,
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
	}, [id, accessToken, navigate, user, authLoaded]);

	return (
		<CustomBody>
			{profile ? (
				<div>
					<div className="inlineDivStart">
						<img src={pfp} alt="user profile" />
						<div style={{ marginTop: '2rem', padding: '0 2rem' }}>
							<p className="helper" style={{ marginBottom: 0 }}>
								{profile.role}
							</p>
							<div className="inlineDivCenter userTitle">
								<h1>
									{profile.firstName && profile.lastName
										? `${profile.firstName} ${profile.lastName}`
										: profile.username}
								</h1>
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
								{profile.website && (
									<div className="inlineDivCenter iconWithText">
										<MdOutlineLocalPhone />
										<a
											href={
												profile.website.startsWith(
													'http://'
												) ||
												profile.website.startsWith(
													'https://'
												)
													? profile.website
													: 'https://' +
													  profile.website
											}
										>
											{profile.website}
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
					{profile &&
						user &&
						(profile.id.toString() === user.id.toString() ||
							user.role === ADMIN) && (
							<Button
								className="settingsBtn"
								onClick={() => navigate('change/')}
							>
								<IoMdSettings class="btnIcon" />
								Settings
							</Button>
						)}
					{profile &&
						user &&
						profile.id.toString() !== user.id.toString() &&
						profile.role === HANDYMAN && (
							<Button
								className="settingsBtn"
								onClick={() => navigate('review/')}
							>
								<MdOutlineRateReview class="btnIcon" />
								Write review
							</Button>
						)}
				</div>
			) : (
				<p>Loading...</p>
			)}
		</CustomBody>
	);
}
