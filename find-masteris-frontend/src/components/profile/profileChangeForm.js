import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
import { useState } from 'react';
// assets:
import { HANDYMAN } from '../../assets/constants/roles';
// api:
import api from '../../api/api';
// components:
import { Button } from 'react-bootstrap';

export default function ProfileChangeForm({ id, profile }) {
	const navigate = useNavigate();
	const { setUsername } = useAuth();
	const [error, setError] = useState(null);

	const handymanContactEmailFieldValidation = Yup.string()
		.email('Invalid email address')
		.required('Required');
	const userContactEmailFieldValidation = Yup.string()
		.email('Invalid email address')
		.notRequired();

	return (
		<Formik
			initialValues={{
				username: profile && profile.username ? profile.username : '',
				email: profile && profile.email ? profile.email : '',
				first_name:
					profile && profile.firstName ? profile.firstName : '',
				last_name: profile && profile.lastName ? profile.lastName : '',
				contact_email:
					profile && profile.contactEmail ? profile.contactEmail : '',
				phone_no: profile && profile.phoneNo ? profile.phoneNo : '',
				website: profile && profile.website ? profile.website : '',
			}}
			validationSchema={Yup.object({
				username: Yup.string()
					.required('Required')
					.min(3, 'Username has to be at least 3 characters long')
					.max(150, "Username can't exceed 150 characters"),
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
			onSubmit={async (values) => {
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
					if (response.status === 200) {
						setUsername(response.data.username);
						navigate(`/user/${id}/`);
					} else if (response.status >= 400) {
						setError('Update of user was not successful');
					}
				} catch {
					setError('Update of user was not successful');
				}
			}}
		>
			<Form style={{ marginBottom: '2rem' }}>
				<h3>Base profile info</h3>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: '2rem',
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
							<Field name="username" type="text" />
						</div>
						<ErrorMessage
							className="text-danger"
							component="div"
							name="username"
						/>
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
						<ErrorMessage
							className="text-danger"
							component="div"
							name="email"
						/>
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
							<Field name="first_name" type="text" />
						</div>
						<ErrorMessage
							className="text-danger"
							name="first_name"
							component="div"
						/>
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
							<Field name="last_name" type="text" />
						</div>
						<ErrorMessage
							className="text-danger"
							component="div"
							name="last_name"
						/>
					</div>
				</div>
				<br />
				{profile.role === HANDYMAN && (
					<div>
						<h3>Handyman profile info</h3>
						<div>
							<label htmlFor="contact_email">Contact email</label>
							<Field name="contact_email" type="email" />
							<br />
							<ErrorMessage
								className="text-danger"
								component="div"
								name="contact_email"
							/>
							<br />

							<label htmlFor="phone_no">Phone number</label>
							<Field name="phone_no" type="text" />
							<br />
							<ErrorMessage
								className="text-danger"
								component="div"
								name="phone_no"
							/>
							<br />

							<label htmlFor="website">Website</label>
							<Field name="website" type="text" />
							<br />
							<ErrorMessage
								className="text-danger"
								component="div"
								name="website"
							/>
							<br />
						</div>
					</div>
				)}
				{error && <p>{error}</p>}
				<Button type="submit">Save</Button>
			</Form>
		</Formik>
	);
}
