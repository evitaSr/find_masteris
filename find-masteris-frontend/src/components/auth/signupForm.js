import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as Yup from 'yup';

// api:
import api from '../../api/api';

// assets:
import { CLIENT, HANDYMAN } from '../../assets/constants/roles';

// components:
import Error from '../../components/error';
import { Button } from 'react-bootstrap';
import { AuthTextInput } from './authTextInput';

export default function SignupForm() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [error, setError] = useState('');
	const [roleChosen, setRoleChosen] = useState(CLIENT);

	return (
		<div>
			<p style={{ textAlign: 'center' }}>Choose role:</p>
			<div className="roleBtns">
				<Button
					variant={roleChosen === CLIENT ? 'primary' : 'secondary'}
					onClick={() => setRoleChosen(CLIENT)}
				>
					Client
				</Button>
				<Button
					onClick={() => setRoleChosen(HANDYMAN)}
					variant={roleChosen === HANDYMAN ? 'primary' : 'secondary'}
				>
					Handyman
				</Button>
			</div>
			<Formik
				enableReinitialize
				initialValues={{
					username: '',
					password: '',
					passwordRepeat: '',
					firstName: '',
					lastName: '',
					email: '',
					contactEmail: '',
					phoneNo: '',
					website: '',
				}}
				validationSchema={Yup.object({
					username: Yup.string().required('Required'),
					password: Yup.string().required('Required'),
					passwordRepeat: Yup.string()
						.required('Required')
						.oneOf([Yup.ref('password')], 'Passwords must match'),
					firstName: Yup.string().required('Required'),
					lastName: Yup.string().required('Required'),
					email: Yup.string()
						.email('Enter valid email address')
						.required('Required'),
					contactEmail:
						roleChosen === HANDYMAN
							? Yup.string()
									.email('Invalid email address')
									.required('Required')
							: Yup.string()
									.email('Invalid email address')
									.notRequired(),
				})}
				onSubmit={async (values) => {
					try {
						let response = null;
						if (roleChosen === HANDYMAN) {
							response = await api.post('handyman/', {
								first_name: values.firstName,
								lastName: values.lastName,
								username: values.username,
								password: values.password,
								email: values.email,
								contact_email: values.contactEmail,
								phone_no: values.phoneNo,
								website: values.website,
							});
						} else if (roleChosen === CLIENT) {
							response = await api.post('user/', {
								first_name: values.firstName,
								lastName: values.lastName,
								username: values.username,
								password: values.password,
								email: values.email,
							});
						}
						if (response && response.status === 201) {
							await login(values.username, values.password);
							navigate('/');
							setError('');
						}
					} catch (err) {
						setError('Unable to sign in');
					}
				}}
			>
				<Form>
					<AuthTextInput name="firstName" label="First name" />
					<AuthTextInput name="lastName" label="Last name" />
					<AuthTextInput name="username" label="Username" />
					<AuthTextInput name="email" label="Email" isEmail={true} />
					<div
						className={`roleFields ${
							roleChosen === HANDYMAN ? 'show' : ''
						}`}
					>
						<AuthTextInput
							name="contactEmail"
							label="Contact email"
							isEmail={true}
						/>
						<AuthTextInput name="phoneNo" label="Phone number" />
						<AuthTextInput name="website" label="Website" />
					</div>
					<div style={{ marginBottom: '1rem' }}>
						<label style={{ marginRight: '0.5rem' }}>
							Password
						</label>
						<Field
							name="password"
							type="password"
							className="form-control"
						/>
						<ErrorMessage
							component="div"
							name="password"
							className="text-danger"
						/>
					</div>
					<div style={{ marginBottom: '2rem' }}>
						<label style={{ marginRight: '1rem' }}>
							Repeat your password
						</label>
						<Field
							name="passwordRepeat"
							type="password"
							className="form-control"
						/>
						<ErrorMessage
							component="div"
							name="passwordRepeat"
							className="text-danger"
						/>
					</div>
					{error && <Error text={error} />}
					<div className="alignedBtns">
						<Button type="submit">Sign up</Button>
						<div className="alignedBtnsGroup">
							<p>Already a member?</p>
							<Button onClick={() => navigate('/login')}>
								Login
							</Button>
						</div>
					</div>
				</Form>
			</Formik>
		</div>
	);
}
