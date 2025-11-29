import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// api:
import api from '../../api/api';
// components:
import { Button } from 'react-bootstrap';
import CategoryWatcher from '../profile/categoryWatcher';

export default function JobEntryFilter() {
	const [error, setError] = useState(null);
	const [categories, setCategories] = useState([]);
	const [services, setServices] = useState([]);
	const [jobEntries, setJobEntries] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('category/');
				if (response && response.status === 200 && response.data) {
					setCategories(response.data);
				}
				setError(null);
			} catch {
				setError('Error when fetching categories');
			}
		};

		fetchCategories();
	}, []);

	return (
		<Formik
			enableReinitialize
			initialValues={{
				category: '',
				service: '',
			}}
			validationSchema={Yup.object({
				category: Yup.number().required('Required'),
				service: Yup.number().required('Required'),
			})}
			onSubmit={(values) => {
				const getJobEntries = async () => {
					try {
						setError(null);
					} catch {
						setError('Error when fetching job entries');
					}
				};

				getJobEntries();
			}}
		>
			<Form style={{ marginBottom: '2rem' }}>
				<label>Category</label>
				<Field as="select" name="category" className="form-control">
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
				<Field as="select" name="service" className="form-control">
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
				{error && <p className="text-danger">{error}</p>}
				<br />
				<Button type="submit">Search</Button>
			</Form>
		</Formik>
	);
}
