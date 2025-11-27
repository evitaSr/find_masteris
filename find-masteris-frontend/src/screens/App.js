import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';
// assets:
import { HANDYMAN } from '../assets/constants/roles';
// components:
import CustomBody from '../components/customBody';
import { Button } from 'react-bootstrap';

function App() {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<CustomBody>
			<h1>Home page</h1>
			{user && user.role === HANDYMAN && (
				<Button
					onClick={() => navigate(`handyman/${user.id}/job_entry/`)}
				>
					Upload job entry
				</Button>
			)}
		</CustomBody>
	);
}

export default App;
