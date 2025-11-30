import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate, useParams } from 'react-router';

// api:
import api from '../../api/api';
// assets:
import { HANDYMAN, ADMIN } from '../../assets/constants/roles';
// components:
import CustomBody from '../../components/customBody';
import { Button, Modal } from 'react-bootstrap';

export default function JobEntryDetail() {
	const BASE_URL = process.env.REACT_APP_API_URL;
	const { id, categoryId, serviceId, jobEntryId } = useParams();
	const navigate = useNavigate();
	const { accessToken, user, authLoaded } = useAuth();
	const [jobEntry, setJobEntry] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalError, setModalError] = useState(null);

	useEffect(() => {
		const fetchJobEntry = async () => {
			try {
				const response = await api.get(
					`handyman/${id}/category/${categoryId}/service/${serviceId}/job_entry/${jobEntryId}/`
				);
				if (response && response.data) {
					setJobEntry(response.data);
				}
			} catch {}
		};

		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id || !categoryId || !serviceId || !jobEntryId) return;

		fetchJobEntry();
	}, [
		accessToken,
		authLoaded,
		id,
		user,
		navigate,
		categoryId,
		serviceId,
		jobEntryId,
	]);

	const openModal = () => {
		setModalOpen(true);
	};
	const closeModal = () => {
		setModalOpen(false);
	};

	const handleDelete = () => {
		const deleteJobEntry = async () => {
			try {
				await api.delete(
					`handyman/${id}/category/${categoryId}/service/${serviceId}/job_entry/${jobEntryId}/`
				);
				closeModal();
				navigate(`/user/${id}/`);
			} catch {
				setModalError('Error when deleting');
			}
		};
		setModalError(null);
		deleteJobEntry();
	};

	return (
		<CustomBody>
			{jobEntry ? (
				<div>
					<p className="helper" style={{ marginBottom: 0 }}>
						{jobEntry.created_on}
					</p>
					<h1>{jobEntry.title}</h1>
					<p>{jobEntry.description}</p>
					{jobEntry.files.map((file) => (
						<>
							{console.log(
								`${BASE_URL.slice(0, -1)}${file.file}`
							)}
							<img
								key={file.pk}
								alt="Job entry"
								src={
									BASE_URL.endsWith('/')
										? `${BASE_URL.slice(0, -1)}${file.file}`
										: `${BASE_URL}${file.file}`
								}
							/>
						</>
					))}
					{((user.id === id && user.role === HANDYMAN) ||
						user.role === ADMIN) && (
						<div>
							<Button
								style={{ marginRight: '0.5rem' }}
								onClick={() => navigate('change/')}
							>
								Edit
							</Button>
							<Button
								variant="danger"
								onClick={() => openModal()}
							>
								Delete
							</Button>
						</div>
					)}
					<Modal
						show={modalOpen}
						onHide={closeModal}
						backdrop="static"
						keyboard={false}
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title>
								Confirmation for job entry deletion
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>
								Are you sure you want to remove this job entry?
							</p>
							{modalError && (
								<p className="text-danger">{modalError}</p>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={closeModal} variant="secondary">
								Close
							</Button>
							<Button onClick={handleDelete} variant="danger">
								Confirm
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</CustomBody>
	);
}
