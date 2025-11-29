import { useState } from 'react';

// api:
import api from '../../api/api';

// components:
import {
	MdOutlineKeyboardArrowDown,
	MdOutlineKeyboardArrowUp,
} from 'react-icons/md';

export function JobEntriesList({ id, categories }) {
	const [expandedCategory, setExpandedCategory] = useState(null);
	const [services, setServices] = useState([]);
	const [selectedService, setSelectedService] = useState(null);
	const [jobEntries, setJobEntries] = useState([]);

	const handleCategoryClick = (categoryId) => {
		const fetchServices = async () => {
			try {
				const response = await api.get(
					`handyman/${id}/category/${categoryId}/service`
				);
				if (response && response.data) {
					setServices(response.data);
				}
			} catch {}
		};
		setServices([]);
		setSelectedService(null);
		setJobEntries([]);

		if (categoryId !== expandedCategory) {
			setExpandedCategory(categoryId);
			fetchServices();
		} else {
			setExpandedCategory(null);
		}
	};

	const handleServiceClick = (serviceId) => {
		const fetchJobEntries = async () => {
			try {
				const response = await api.get(
					`handyman/${id}/category/${expandedCategory}/service/${serviceId}/job_entry/`
				);
				if (response && response.data) {
					setJobEntries(response.data);
				}
			} catch {}
		};
		setJobEntries([]);

		if (serviceId !== selectedService) {
			setSelectedService(serviceId);
			fetchJobEntries();
		} else {
			setSelectedService(null);
		}
	};

	return (
		<div style={{ marginTop: '2rem' }}>
			{categories.map((category) => (
				<div key={category.pk} className="categoryOptionDiv">
					<div
						className="categoryOption"
						onClick={() => handleCategoryClick(category.pk)}
					>
						<h3>{category.title}</h3>
						{expandedCategory === category.pk ? (
							<MdOutlineKeyboardArrowUp className="categoryIcon" />
						) : (
							<MdOutlineKeyboardArrowDown className="categoryIcon" />
						)}
					</div>
					{expandedCategory === category.pk && (
						<div className="allServices">
							{services.map((service) => (
								<div key={service.pk}>
									<div
										className="serviceOption"
										onClick={() =>
											handleServiceClick(service.pk)
										}
									>
										<h5>{service.title}</h5>
										{selectedService === service.pk ? (
											<MdOutlineKeyboardArrowUp className="categoryIcon" />
										) : (
											<MdOutlineKeyboardArrowDown className="categoryIcon" />
										)}
									</div>
									{selectedService === service.pk && (
										<div className="jobEntriesList">
											{jobEntries.map((jobEntry, i) => (
												<div key={jobEntry.pk}>
													{i > 0 && <hr />}
													<div className="jobEntryTitle">
														<p
															style={{
																fontSize:
																	'1.5rem',
															}}
														>
															{jobEntry.title}
														</p>
														<p>
															{
																jobEntry.created_on
															}
														</p>
													</div>
													<p>
														{jobEntry.description
															.length > 500
															? jobEntry.description.substring(
																	0,
																	500
															  ) + '...'
															: jobEntry.description}
													</p>
													<a
														href={`/handyman/${id}/category/${expandedCategory}/service/${selectedService}/job_entry/${jobEntry.pk}`}
													>
														See more
													</a>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
