import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

// api:
import { getFullUserInfo } from '../../api/requests';
import api from '../../api/api';

// assets:
import { ADMIN, HANDYMAN } from '../../assets/constants/roles';
import { FaTrash } from 'react-icons/fa6';
import { PiPasswordFill } from 'react-icons/pi';
import '../../assets/style/profile.css';

// components:
import CustomBody from '../../components/customBody';
import { Button, Modal } from 'react-bootstrap';
import PasswordChangeForm from '../../components/profile/passwordChangeForm';
import ProfileChangeForm from '../../components/profile/profileChangeForm';

// etc:
import { UserDetails } from '../../models/fullUser';

export default function ProfileSettings() {
	const { id } = useParams();
	const { accessToken, user, authLoaded, logout } = useAuth();
	const navigate = useNavigate();

	const [profile, setProfile] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
	const [passwordChangeSuccessful, setPasswordChangeSuccessful] =
		useState(true);

	useEffect(() => {
		const getUserInfo = async (id) => {
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
			} catch {}
			return profile;
		};

		if (!authLoaded) {
			return;
		}

		if (!accessToken || !user) {
			navigate('/');
			return;
		}
		if (!id) return;

		if (user.role !== ADMIN && user.id.toString() !== id) {
			navigate('/unauthorized/');
			return;
		}
		getUserInfo(id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken, authLoaded, id, user, navigate]);

	const handleOpen = () => {
		setModalOpen(true);
	};
	const handleClose = () => {
		setModalOpen(false);
	};

	const handleConfirm = () => {
		const removeProfile = async () => {
			let response = null;
			if (profile.role === HANDYMAN) {
				response = await api.delete(`handyman/${id}/`);
			} else {
				response = await api.delete(`user/${id}/`);
			}
			if (response && response.status === 204) {
				logout();
				navigate('/');
			}
		};
		setModalOpen(false);
		removeProfile();
	};

	const handleShowPasswordChangeForm = () => {
		setShowChangePasswordForm(!showChangePasswordForm);
	};

	return (
		<CustomBody>
			<h1>Profile settings</h1>
			{profile ? (
				<div>
					<ProfileChangeForm id={id} profile={profile} />
					<div className="alignedButtons">
						<Button
							onClick={handleShowPasswordChangeForm}
							className="btnWithIcon"
						>
							<PiPasswordFill />
							Change password
						</Button>
						<Button
							onClick={handleOpen}
							style={{ marginRight: '2rem' }}
							className="btnWithIcon"
							variant="danger"
						>
							<FaTrash />
							Delete
						</Button>
					</div>
					<Modal
						show={modalOpen}
						onHide={handleClose}
						backdrop="static"
						keyboard={false}
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title>
								Confirmation for profile deletion
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>Are you sure you want to remove this profile?</p>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={handleClose} variant="secondary">
								Close
							</Button>
							<Button onClick={handleConfirm} variant="danger">
								Confirm
							</Button>
						</Modal.Footer>
					</Modal>
					{showChangePasswordForm && (
						<PasswordChangeForm
							id={id}
							user={user}
							setShowChangePasswordForm={
								setShowChangePasswordForm
							}
							passwordChangeSuccessful={passwordChangeSuccessful}
							setPasswordChangeSuccessful={
								setPasswordChangeSuccessful
							}
						/>
					)}
				</div>
			) : (
				<p>Loading...</p>
			)}
		</CustomBody>
	);
}
