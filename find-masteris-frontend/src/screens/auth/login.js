import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import CustomBody from '../../components/customBody';
import Error from '../../components/error';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();
	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(username, password);
			setError('');
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<CustomBody>
			<p
				style={{
					textAlign: 'center',
					fontWeight: 'bold',
					fontSize: '22px',
				}}
			>
				Login screen
			</p>
			<form onSubmit={handleLogin}>
				<input
					placeholder="username"
					required
					onChange={(u) => setUsername(u.target.value)}
				/>{' '}
				<br />
				<input
					type="password"
					placeholder="password"
					required
					onChange={(p) => setPassword(p.target.value)}
				/>{' '}
				<br />
				{error && <Error text={error} />}
				<button type="submit">Login</button>
			</form>
		</CustomBody>
	);
}
