import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

// api:
import api from '../../api/api';

// assets:
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';

// components:
import CustomBody from '../../components/customBody';
import { Button, Form } from 'react-bootstrap';
import Rating from 'react-rating';

// etc:
import { ADMIN } from '../../assets/constants/roles';

export default function ReviewList() {
	const { id } = useParams();

	const { accessToken, user, authLoaded } = useAuth();
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [services, setServices] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedService, setSelectedService] = useState(null);
	const [avgRating, setAvgRating] = useState(0);
	const [error, setError] = useState(null);
	const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

	useEffect(() => {
		if (!authLoaded) {
			return;
		}
		if (!accessToken || !user) {
			navigate('/');
		}
		if (!id) {
			return;
		}

		const fetchCategories = async () => {
			try {
				const response = await api.get('category/');
				if (response && response.data) {
					setCategories(response.data);
					if (selectedCategory === null && response.data.length > 0) {
						setSelectedCategory(response.data[0].pk);
					}
				}
				setError(null);
			} catch {
				setError("Can't fetch categories");
			}
		};
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, authLoaded, accessToken, navigate, user]);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await api.get(
					`category/${selectedCategory}/service/`
				);
				if (response && response.data) {
					setServices(response.data);
					setSelectedService(null);
				}
				setError(null);
			} catch {
				if (error === null) {
					setError("Cant't fetch services");
				}
			}
		};
		if (selectedCategory === null) {
			return;
		}
		fetchServices();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

	useEffect(() => {
		setButtonIsDisabled(
			selectedCategory === null ||
				selectedCategory === '' ||
				selectedService === null ||
				selectedService === ''
		);
	}, [selectedCategory, selectedService]);

	const handleFilteredReviews = async () => {
		try {
			const response = await api.get(
				`handyman/${id}/category/${selectedCategory}/service/${selectedService}/review/`
			);
			if (response && response.data) {
				setReviews(response.data);
				if (response.data.length > 0) {
					setAvgRating(
						response.data.reduce(
							(avg, review) => (avg = avg + review.rating),
							0
						) / response.data.length
					);
				}
			}
			setError(null);
		} catch {
			setError('Error when fetching reviews');
		}
	};

	const handleDelete = (review) => {
		console.log(review);
	};

	const handleEdit = (review) => {
		navigate(
			`/user/${id}/category/${selectedCategory}/service/${selectedService}/review/${review.pk}/`
		);
	};

	return (
		<CustomBody>
			<h1>Reviews</h1>
			<label>Category:</label>
			<Form.Select
				name="category"
				onChange={(e) => setSelectedCategory(e.target.value)}
				value={selectedCategory ?? ''}
			>
				{categories.map((category) => (
					<option value={category.pk} key={category.pk}>
						{category.title}
					</option>
				))}
			</Form.Select>
			<br />
			<label>Service:</label>

			<Form.Select
				name="service"
				value={selectedService || ''}
				onChange={(e) => setSelectedService(e.target.value)}
			>
				<option value="" key="">
					--------------
				</option>
				{services.map((service) => (
					<option value={service.pk} key={service.pk}>
						{service.title}
					</option>
				))}
			</Form.Select>
			<br />
			{error && <p className="text-danger">{error}</p>}
			<div style={{ marginBottom: '2rem' }}>
				<Button
					disabled={buttonIsDisabled}
					onClick={handleFilteredReviews}
					style={{ marginRight: '2rem' }}
				>
					Show for this service
				</Button>
				<Button variant="secondary">Show all</Button>
			</div>
			{reviews.length === 0 ? (
				<div>
					<p>No reviews available</p>
				</div>
			) : (
				<div>
					<p style={{ textAlign: 'center' }}>
						Average rating: {avgRating}
					</p>
					{reviews.map((review) => (
						<div
							className="inlineDivStart reviewBlock"
							key={review.id}
						>
							<div className="userInfo">
								<p className="userName">
									{review.client_full_title}
								</p>
								<p className="helper">{review.created_on}</p>
							</div>
							<div className="reviewInfo">
								<div
									className="inlineDivStart"
									style={{ justifyContent: 'space-between' }}
								>
									<Rating
										initialRating={review.rating}
										readonly
										emptySymbol={<IoStarOutline />}
										fullSymbol={<IoStar color="gold" />}
									/>
									{(user.role === ADMIN ||
										review.client.toString() ===
											user.id.toString()) && (
										<div className="reviewActions">
											<LuPencil
												className="icon"
												onClick={() =>
													handleEdit(review)
												}
											/>
											<FaRegTrashAlt
												className="icon"
												onClick={() =>
													handleDelete(review)
												}
											/>
										</div>
									)}
								</div>
								<p>{review.description}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</CustomBody>
	);
}
