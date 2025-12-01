import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';

// api:
import api from '../../api/api';
// component:
import CustomBody from '../../components/customBody';
import { ADMIN } from '../../assets/constants/roles';
import { Button } from 'react-bootstrap';

export default function CategoryRequestList() {
	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();
	const [requests, setRequests] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				setError(null);
				const response = await api.get('category_request/');
				if (response && response.data) {
					setRequests(response.data);
				}
			} catch {
				setError('Error when fetching requests');
			}
		};
		if (!authLoaded) return;
		if (!accessToken || !user) {
			navigate('/');
		}
		if (user && user.role !== ADMIN) {
			navigate('/unauthorized');
		}

		fetchRequests();
	}, [authLoaded, accessToken, user, navigate]);

	const handleReject = async (req) => {
		try {
			setError(null);
			await api.patch(`category_request/${req.pk}/`, {
				decision: '2',
			});
			setRequests((r) => requests.filter((item) => item.pk !== req.pk));
		} catch {
			setError('Error rejecting');
		}
	};

	const handleAccept = async (r) => {
		try {
			setError(null);
			await api.patch(`category_request/${r.pk}/`, {
				title: r.title,
				decision: '1',
			});
			setRequests((req) => requests.filter((item) => item.pk !== r.pk));
		} catch {
			setError('Error accepting');
		}
	};

	return (
		<CustomBody>
			<h1>Requests to add categories</h1>
			{error && <p className="text-danger">{error}</p>}

			{requests && requests.length > 0 ? (
				<p>
					{requests.map((request) => (
						<div key={request.pk} className="suggestion">
							<p>Requested by: {request.user_full_title}</p>
							<p>
								Suggested title:{' '}
								<span style={{ fontWeight: 'bold' }}>
									{request.title}
								</span>
							</p>
							<div className="choicesBtns">
								<Button onClick={() => handleAccept(request)}>
									Accept
								</Button>
								<Button
									variant="danger"
									onClick={() => handleReject(request)}
								>
									Reject
								</Button>
							</div>
						</div>
					))}
				</p>
			) : (
				<p>No requests</p>
			)}
		</CustomBody>
	);
}
