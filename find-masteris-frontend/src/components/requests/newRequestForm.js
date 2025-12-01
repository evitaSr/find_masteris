import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
// api:
import api from '../../api/api';
// components:
import { Button } from 'react-bootstrap';

export default function NewRequestForm({ type }) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setError(null);
				const response = await api.get('category/');
				if (response && response.data) {
					setCategories(response.data);
				}
			} catch {
				setError('Error when fetching categories');
			}
		};
		if (type === 'service') {
			fetchCategories();
		}
	}, [type]);

	return (
		<Formik
			initialValues={{
				title: '',
			}}
			validationSchema={Yup.object({
				title: Yup.string()
					.required('Required')
					.max(100, "Title can't exceed 100 characters"),
				category:
					type === 'service'
						? Yup.number().required('Required')
						: Yup.number().notRequired(),
			})}
			onSubmit={(values) => {
				const submitCategory = async () => {
					try {
						await api.post('category_request/', {
							title: values.title,
							requested_by: user.id,
						});
						navigate('/');
					} catch {
						setError('Error submitting category request');
					}
				};

				const submitService = async () => {
					try {
						await api.post('service_request/', {
							title: values.title,
							requested_by: user.id,
							category: values.category,
						});
						navigate('/');
					} catch {
						setError('Error submitting service request');
					}
				};
				if (type === 'category') {
					setError(null);
					submitCategory();
				} else if (type === 'service') {
					setError(null);
					submitService();
				} else {
					setError('Unknown action');
				}
			}}
		>
			<Form>
				{type === 'service' && (
					<div style={{ marginBottom: '1rem' }}>
						<Field
							as="select"
							name="category"
							className="form-control"
						>
							<option value="">--------------</option>
							{categories.map((category) => (
								<option value={category.pk} key={category.pk}>
									{category.title}
								</option>
							))}
						</Field>
					</div>
				)}
				<div style={{ marginBottom: '1rem' }}>
					<label>Title</label>
					<Field name="title" className="form-control" type="text" />
					<ErrorMessage
						className="text-danger"
						component="div"
						name="title"
					/>
				</div>
				{error && <p className="text-danger">{error}</p>}
				<Button type="submit">Submit</Button>
			</Form>
		</Formik>
	);
}
