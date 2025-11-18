import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function CustomHeader() {
	const { accessToken, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/');
		} catch (err) {}
	};
	return (
		<header className="customHeader">
			<Link to="/">Find masteris</Link>
			{accessToken && <Link to="/profile">Profile</Link>}
			{accessToken ? (
				<Link onClick={handleLogout}>Logout</Link>
			) : (
				<Link to="/login">Login</Link>
			)}
		</header>
	);
}
