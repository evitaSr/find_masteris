import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as Yup from 'yup';

// components:
import Error from '../../components/error';
import { Button } from 'react-bootstrap';

export default function LoginForm() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState('');

	return (
		<Formik
			initialValues={{
				username: '',
				password: '',
			}}
			validationSchema={Yup.object({
				username: Yup.string().required('Required'),
				password: Yup.string().required('Required'),
			})}
			onSubmit={async (values) => {
				try {
					await login(values.username, values.password);
					setError('');
					navigate('/');
				} catch (err) {
					setError(err.message);
				}
			}}
		>
			<Form>
				<div style={{ marginBottom: '2rem' }}>
					<label style={{ marginRight: '1rem' }}>Username</label>
					<Field
						name="username"
						type="text"
						className="form-control"
					/>
					<ErrorMessage
						component="div"
						name="username"
						className="text-danger"
					/>
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
					<Button type="submit">Login</Button>
					<div className="alignedBtnsGroup">
						<p>Not a member?</p>
						<Button onClick={() => navigate('/signup')}>
							Sign up
						</Button>
					</div>
				</div>
			</Form>
		</Formik>
	);
}
