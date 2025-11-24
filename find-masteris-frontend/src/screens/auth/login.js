// components:
import CustomBody from '../../components/customBody';
import LoginForm from '../../components/auth/loginForm';

export default function Login() {
	return (
		<CustomBody>
			<p
				style={{
					textAlign: 'center',
					fontWeight: 'bold',
					fontSize: '22px',
				}}
			>
				Login
			</p>
			<LoginForm />
		</CustomBody>
	);
}
