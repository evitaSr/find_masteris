import { Link } from 'react-router';
import { useAuth } from '../context/authContext';

// assets:
import { HANDYMAN } from '../assets/constants/roles';

export default function CustomFooter() {
	const { accessToken, user } = useAuth();

	return (
		<footer>
			<div className="footerDiv">
				<div>
					<p>Evita Šriupšaitė, IFF-2/2</p>
					<p>evita.sriupsaite@ktu.edu</p>
				</div>
				<div>
					<p>Kauno technologijos universitetas, 2025</p>
					{accessToken && user && user.role === HANDYMAN && (
						<div>
							<Link
								to="/category_request/add/"
								style={{ marginBottom: '1rem' }}
							>
								Request to add new category
							</Link>
							<Link to="/service_request/add/">
								Request to add new service
							</Link>
						</div>
					)}
				</div>
			</div>
		</footer>
	);
}
