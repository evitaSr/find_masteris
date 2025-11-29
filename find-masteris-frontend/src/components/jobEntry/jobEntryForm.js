import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// api:
import api from '../../api/api';

// components:
import { Button } from 'react-bootstrap';
import CategoryWatcher from '../profile/categoryWatcher';
import FileUpload from '../fileUpload';

export default function JobEntryForm({ handymanId }) {
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
			} catch {
				setError('Error when fetching categories');
			}
		};

		fetchCategories();
	}, []);

	return (
		<Formik
			initialValues={{
				title: '',
				description: '',
				category: '',
				service: '',
				image: null,
			}}
			validationSchema={Yup.object({
				category: Yup.number().required('Required'),
				service: Yup.number().required('Required'),
				title: Yup.string().required('Required'),
			})}
			onSubmit={async (values) => {
				const formData = new FormData();
				formData.append('title', values.title);
				formData.append('description', values.description);
				if (values.image) {
					formData.append('uploaded_files', values.image);
				}

				try {
					const response = await api.post(
						`/handyman/${handymanId}/category/${values.category}/service/${values.service}/job_entry/`,
						formData,
						{
							headers: { 'Content-Type': 'multipart/form-data' },
						}
					);
					if (response && response.status === 201) {
						setError(null);
						navigate('/');
					}
				} catch {
					setError('Error when creating job entry');
				}
			}}
		>
			{({ values, errors, setFieldValue }) => (
				<Form>
					<label>Category</label>
					<Field className="form-control" as="select" name="category">
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
					<CategoryWatcher
						setServices={setServices}
						error={error}
						setError={setError}
					/>

					<label>Service</label>
					<Field className="form-control" as="select" name="service">
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
					<label>Title</label>
					<Field
						className="form-control"
						type="text"
						name="title"
					></Field>
					<ErrorMessage
						className="text-danger"
						component="div"
						name="title"
					/>
					<label>Description</label>
					<Field
						className="form-control"
						as="textarea"
						rows={4}
						name="description"
					></Field>
					<ErrorMessage
						className="text-danger"
						component="div"
						name="description"
					/>
					<label>Photos</label>
					<FileUpload
						data={values}
						errors={errors}
						setFieldValue={setFieldValue}
					/>
					<br />
					{error && <p className="text-danger">{error}</p>}
					<Button type="Submit">Create</Button>
				</Form>
			)}
		</Formik>
	);
}
