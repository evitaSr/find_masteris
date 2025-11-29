import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router';
// assets:
import { HANDYMAN } from '../assets/constants/roles';
// components:
import CustomBody from '../components/customBody';
import { Button } from 'react-bootstrap';
import JobEntryFilter from '../components/homePage/jobEntryFilter';

function App() {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<CustomBody>
			<h1>Home page</h1>
			<JobEntryFilter />
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
