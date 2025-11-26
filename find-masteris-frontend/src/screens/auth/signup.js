// components:
import CustomBody from '../../components/customBody';
import SignupForm from '../../components/auth/signupForm';

export default function Signup() {
	return (
		<CustomBody>
			<p
				style={{
					textAlign: 'center',
					fontWeight: 'bold',
					fontSize: '22px',
				}}
			>
				Signup
			</p>
			<SignupForm />
		</CustomBody>
	);
}
