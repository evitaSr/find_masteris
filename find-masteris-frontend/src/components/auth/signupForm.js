import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as Yup from 'yup';

// assets:
import { CLIENT, HANDYMAN } from '../../assets/constants/roles';

// components:
import Error from '../../components/error';
import { Button } from 'react-bootstrap';
import { AuthTextInput } from './authTextInput';

export default function SignupForm() {
	const navigate = useNavigate();
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
				initialValues={{
					username: '',
					password: '',
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
					firstName: Yup.string().required('Required'),
					lastName: Yup.string().required('Required'),
					email: Yup.string().required('Required'),
				})}
				onSubmit={async (values) => {
					try {
						setError('');
						// navigate('/');
					} catch (err) {
						setError(err.message);
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
					<div style={{ marginBottom: '2rem' }}>
						<label style={{ marginRight: '1rem' }}>Password</label>
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
					{error && <Error text={error} />}
					<div className="alignedBtns">
						<Button type="submit">Signup</Button>
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
