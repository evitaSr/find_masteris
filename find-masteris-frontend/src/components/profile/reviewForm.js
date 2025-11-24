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

export default function ReviewForm({ id }) {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [services, setServices] = useState([]);
	const [error, setError] = useState(null);

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

	return (
		<Formik
			initialValues={{
				rating: 5,
				description: '',
				category: '',
				service: '',
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
				saveReview();
			}}
		>
			<Form id="reviewForm">
				<div className="field">
					<label>Category</label>
					<div role="group" className="radioList">
						{categories.map((category) => (
							<label key={category.pk}>
								<Field
									type="radio"
									name="category"
									value={category.pk.toString()}
								/>
								{category.title}
							</label>
						))}
					</div>
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
					<div role="group" className="radioList">
						{services.length === 0 && <p>No services available</p>}
						{services.map((service) => (
							<label
								key={service.pk}
								style={{ display: 'block', margin: '0.2rem 0' }}
							>
								<Field
									type="radio"
									name="service"
									value={service.pk.toString()}
								/>
								{service.title}
							</label>
						))}
					</div>

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
						style={{ width: '40%' }}
					/>
				</div>

				<Button type="submit">Save</Button>
			</Form>
		</Formik>
	);
}
