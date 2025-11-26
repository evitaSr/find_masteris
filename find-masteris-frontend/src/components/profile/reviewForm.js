import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
// api:
import api from '../../api/api';
// components:
import { Button } from 'react-bootstrap';
import Rating from 'react-rating';
import { IoStar, IoStarOutline } from 'react-icons/io5';

// etc:
import CategoryWatcher from './categoryWatcher';

export default function ReviewForm({ id, categoryId, serviceId, reviewId }) {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [services, setServices] = useState([]);
	const [error, setError] = useState(null);
	const [review, setReview] = useState(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('category/');
				if (response && response.data) {
					setCategories(response.data);
				}
				setError(null);
			} catch {
				setError("Can't fetch categories");
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchReview = async () => {
			try {
				const response = await api.get(
					`handyman/${id}/category/${categoryId}/service/${serviceId}/review/${reviewId}/`
				);
				if (response && response.data) {
					setReview(response.data);
				}
				setError(null);
			} catch {
				setError('Error when fetching review');
			}
		};
		if (categoryId && serviceId && reviewId) {
			fetchReview();
		}
	}, [categoryId, serviceId, reviewId, id]);

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				rating: review && review.rating ? review.rating : 5,
				description:
					review && review.description ? review.description : '',
				category: categoryId || '',
				service: serviceId || '',
			}}
			validationSchema={Yup.object({
				rating: Yup.number().required('Required').min(1).max(5),
				category: Yup.number().required('Required'),
				service: Yup.number().required('Required'),
			})}
			onSubmit={(values) => {
				const saveReview = async () => {
					try {
						const response = await api.post(
							`handyman/${id}/category/${values.category}/service/${values.service}/review/`,
							{
								rating: values.rating,
								description: values.description,
								client: user.id,
							}
						);
						if (response.status === 201) {
							navigate(`/user/${id}/`);
						} else {
							setError('Error when saving review');
						}
					} catch {
						setError('Error when saving review');
					}
				};

				const editReview = async () => {
					try {
						const response = await api.patch(
							`handyman/${id}/category/${categoryId}/service/${serviceId}/review/${reviewId}/`,
							{
								rating: values.rating,
								description: values.description,
							}
						);
						if (response.status === 200) {
							navigate(`/user/${id}/review/`);
						} else {
							setError('Error when saving review');
						}
					} catch {
						setError('Error when updating review');
					}
				};
				if (id && categoryId && serviceId && reviewId) {
					editReview();
				} else {
					saveReview();
				}
			}}
		>
			<Form id="reviewForm">
				<div className="field">
					<label>Category</label>
					<Field
						as="select"
						name="category"
						className="form-control"
						disabled={categoryId && serviceId && reviewId}
					>
						<option value="">--------------</option>
						{categories.map((category) => (
							<option value={category.pk} key={category.pk}>
								{category.title}
							</option>
						))}
					</Field>
					<ErrorMessage
						className="text-danger"
						component="div"
						name="category"
					/>
				</div>
				<CategoryWatcher
					setServices={setServices}
					error={error}
					setError={setError}
				/>
				<div className="field">
					<label>Service</label>
					<Field
						as="select"
						name="service"
						className="form-control"
						disabled={categoryId && serviceId && reviewId}
					>
						<option value="">--------------</option>
						{services.map((service) => (
							<option value={service.pk} key={service.pk}>
								{service.title}
							</option>
						))}
					</Field>
					<ErrorMessage
						className="text-danger"
						component="div"
						name="service"
					/>
				</div>
				<div className="field">
					<label>Rating</label>
					<Field name="rating">
						{({ field, form }) => (
							<Rating
								initialRating={field.value}
								onChange={(val) =>
									form.setFieldValue('rating', val)
								}
								emptySymbol={<IoStarOutline />}
								fullSymbol={<IoStar color="gold" />}
							/>
						)}
					</Field>
					<ErrorMessage
						className="text-danger"
						component="div"
						name="rating"
					/>
				</div>
				<div className="field">
					<label>Description</label>
					<br />
					<Field
						name="description"
						as="textarea"
						rows={2}
						style={{ width: '100%' }}
						className="form-control"
					/>
				</div>

				<Button type="submit">Save</Button>
			</Form>
		</Formik>
	);
}
