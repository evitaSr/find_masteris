import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';

export default function CustomHeader() {
	const { accessToken, logout, user } = useAuth();
	const navigate = useNavigate();
	const navRef = useRef();

	const handleLogout = async () => {
		try {
			logout();
			navigate('/');
		} catch (err) {}
	};

	const showNavBar = () => {
		navRef.current.classList.toggle('responsive_nav');
	};

	return (
		<header className="customHeader">
			<nav ref={navRef}>
				<Link to="/">Find masteris</Link>
				{accessToken && user && (
					<Link to={`user/${user.id}/`}>Profile</Link>
				)}
				{accessToken ? (
					<Link onClick={handleLogout}>Logout</Link>
				) : (
					<Link to="/login">Login</Link>
				)}
				<Button onClick={showNavBar} className="nav-btn nav-close-btn">
					<FaTimes />
				</Button>
			</nav>
			<Button onClick={showNavBar} className="nav-btn">
				<FaBars />
			</Button>
		</header>
	);
}
