import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// api:
import { getFullUserInfo } from '../../api/requests';
import api from '../../api/api';

// assets:
import { ADMIN, HANDYMAN } from '../../assets/constants/roles';
import { FaTrash } from 'react-icons/fa6';

// components:
import CustomBody from '../../components/customBody';
import { Button, Modal } from 'react-bootstrap';
// etc:
import { UserDetails } from '../../models/fullUser';
import axios from 'axios';

export default function ProfileSettings() {
	const { id } = useParams();
	const { accessToken, user, authLoaded, setUsername, logout } = useAuth();
	const navigate = useNavigate();

	const [profile, setProfile] = useState(null);
	const [error, setError] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

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

	const handymanContactEmailFieldValidation = Yup.string()
		.email('Invalid email address')
		.required('Required');
	const userContactEmailFieldValidation = Yup.string()
		.email('Invalid email address')
		.notRequired();

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

	return (
		<CustomBody>
			<h1>Profile settings</h1>
			{profile ? (
				<div>
					<Formik
						initialValues={{
							username:
								profile && profile.username
									? profile.username
									: '',
							email:
								profile && profile.email ? profile.email : '',
							first_name:
								profile && profile.firstName
									? profile.firstName
									: '',
							last_name:
								profile && profile.lastName
									? profile.lastName
									: '',
							contact_email:
								profile && profile.contactEmail
									? profile.contactEmail
									: '',
							phone_no:
								profile && profile.phoneNo
									? profile.phoneNo
									: '',
							website:
								profile && profile.website
									? profile.website
									: '',
						}}
						validationSchema={Yup.object({
							username: Yup.string()
								.required('Required')
								.min(
									3,
									'Username has to be at least 3 characters long'
								)
								.max(
									150,
									"Username can't exceed 150 characters"
								),
							email: Yup.string()
								.email('Invalid email address')
								.required('Required'),
							first_name: Yup.string().required('Required'),
							last_name: Yup.string().required('Required'),
							contact_email:
								profile.role === HANDYMAN
									? handymanContactEmailFieldValidation
									: userContactEmailFieldValidation,
						})}
						onSubmit={async (values, { setSubmitting }) => {
							try {
								if (!profile.id) {
									return;
								}
								let response = null;
								if (profile.role === HANDYMAN) {
									response = await api.patch(
										`handyman/${profile.id}/`,
										values
									);
								} else {
									response = await api.patch(
										`user/${profile.id}/`,
										values
									);
								}
								console.log(response);
								if (response.status === 200) {
									setUsername(response.data.username);
									navigate(`/user/${id}/`);
								} else if (response.status >= 400) {
									setError(
										'Update of user was not successful'
									);
								}
							} catch {
								setError('Update of user was not successful');
							}
						}}
					>
						{(formik) => (
							<form onSubmit={formik.handleSubmit}>
								<p>Base profile info</p>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<div style={{ width: '50%' }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<label
												style={{ paddingRight: '5%' }}
												htmlFor="username"
											>
												Username
											</label>
											<Field
												name="username"
												type="text"
											/>
										</div>
										<ErrorMessage name="username" />
									</div>
									<div style={{ width: '50%' }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<label
												htmlFor="email"
												style={{ paddingRight: '5%' }}
											>
												Email Address
											</label>
											<Field name="email" type="email" />
										</div>
										<ErrorMessage name="email" />
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<div style={{ width: '50%' }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<label
												style={{ paddingRight: '5%' }}
												htmlFor="first_name"
											>
												First name
											</label>
											<Field
												name="first_name"
												type="text"
											/>
										</div>
										<ErrorMessage name="first_name" />
									</div>
									<div style={{ width: '50%' }}>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<label
												htmlFor="last_name"
												style={{ paddingRight: '5%' }}
											>
												Last name
											</label>
											<Field
												name="last_name"
												type="text"
											/>
										</div>
										<ErrorMessage name="last_name" />
									</div>
								</div>
								<br />
								{profile.role === HANDYMAN && (
									<div>
										<p>Handyman profile info</p>
										<div>
											<label htmlFor="contact_email">
												Contact email
											</label>
											<Field
												name="contact_email"
												type="email"
											/>
											<br />
											<ErrorMessage name="contact_email" />
											<br />

											<label htmlFor="phone_no">
												Phone number
											</label>
											<Field
												name="phone_no"
												type="text"
											/>
											<br />
											<ErrorMessage name="phone_no" />
											<br />

											<label htmlFor="website">
												Website
											</label>
											<Field name="website" type="text" />
											<br />
											<ErrorMessage name="website" />
											<br />
										</div>
									</div>
								)}
								{error && <p>{error}</p>}
								<button type="submit">Save</button>
							</form>
						)}
					</Formik>
					<button onClick={handleOpen}>
						<FaTrash />
						Delete
					</button>
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
							<Button onClick={handleClose}>Close</Button>
							<Button onClick={handleConfirm}>Confirm</Button>
						</Modal.Footer>
					</Modal>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</CustomBody>
	);
}
