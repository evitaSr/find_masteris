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

export default function JobEntryForm({
	handymanId,
	categoryId,
	serviceId,
	jobEntryId,
}) {
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	const [services, setServices] = useState([]);
	const [error, setError] = useState(null);
	const [jobEntry, setJobEntry] = useState(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('category/');
				if (response && response.data) {
					setCategories(response.data);
				}
				setError(null);
			} catch {
				setError('Error when fetching categories');
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchJobEntry = async () => {
			try {
				const response = await api.get(
					`handyman/${handymanId}/category/${categoryId}/service/${serviceId}/job_entry/${jobEntryId}/`
				);
				if (response && response.data) {
					setJobEntry(response.data);
				}
				setError(null);
			} catch {
				setError('Error when fetching jpb entry');
			}
		};
		if (categoryId && serviceId && jobEntryId) {
			fetchJobEntry();
		}
	}, [categoryId, serviceId, jobEntryId, handymanId]);

	return (
		<Formik
			enableReinitialize={true}
			initialValues={{
				title: jobEntry && jobEntry.title ? jobEntry.title : '',
				description:
					jobEntry && jobEntry.description
						? jobEntry.description
						: '',
				category: categoryId ? categoryId : '',
				service: serviceId ? serviceId : '',
				image: null,
			}}
			validationSchema={Yup.object({
				category: Yup.number().required('Required'),
				service: Yup.number().required('Required'),
				title: Yup.string()
					.required('Required')
					.max(100, "Title can't exceed 100 characters"),
				description: Yup.string().required('Required'),
			})}
			onSubmit={async (values) => {
				const saveJobEntry = async () => {
					const formData = new FormData();
					formData.append('title', values.title);
					formData.append('description', values.description);
					if (values.image) {
						const files = Array.isArray(values.image)
							? values.image
							: [values.image];
						files.forEach((file) => {
							if (
								file instanceof File &&
								file.size > 0 &&
								file.name
							) {
								formData.append('uploaded_files', file);
							}
						});
					}
					console.log(formData);
					try {
						await api.post(
							`/handyman/${handymanId}/category/${values.category}/service/${values.service}/job_entry/`,
							formData
						);
						setError(null);
						navigate('/');
					} catch {
						setError('Error when creating job entry');
					}
				};

				const editJobEntry = async () => {
					const formData = new FormData();
					formData.append('title', values.title);
					formData.append('description', values.description);
					if (values.image) {
						const files = Array.isArray(values.image)
							? values.image
							: [values.image];
						files.forEach((file) => {
							if (
								file instanceof File &&
								file.size > 0 &&
								file.name
							) {
								formData.append('uploaded_files', file);
							}
						});
					}
					try {
						await api.patch(
							`/handyman/${handymanId}/category/${values.category}/service/${values.service}/job_entry/${jobEntryId}/`,
							formData
						);
						setError(null);
						navigate(
							`/handyman/${handymanId}/category/${categoryId}/service/${serviceId}/job_entry/${jobEntryId}/`
						);
					} catch {
						setError('Error when editing job entry');
					}
				};

				if (handymanId && categoryId && serviceId && handymanId) {
					editJobEntry();
				} else {
					saveJobEntry();
				}
			}}
		>
			{({ values, errors, setFieldValue }) => (
				<Form>
					<label>Category</label>
					<Field
						className="form-control"
						as="select"
						name="category"
						disabled={categoryId && serviceId && jobEntryId}
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
					<CategoryWatcher
						setServices={setServices}
						error={error}
						setError={setError}
					/>

					<label>Service</label>
					<Field
						className="form-control"
						as="select"
						name="service"
						disabled={categoryId && serviceId && jobEntryId}
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
					<Button type="Submit">
						{handymanId && categoryId && serviceId && handymanId
							? 'Edit'
							: 'Create'}
					</Button>
				</Form>
			)}
		</Formik>
	);
}
