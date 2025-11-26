import { HANDYMAN } from '../assets/constants/roles';

export class UserDetails {
	constructor(
		id,
		username,
		firstName,
		lastName,
		role,
		email,
		dateJoined,
		contactEmail,
		phoneNo,
		website,
		avgRating,
		totalCount
	) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.role = role;
		this.email = email;
		this.dateJoined = dateJoined;
		this.contactEmail = contactEmail;
		this.phoneNo = phoneNo;
		this.website = website;
		this.avgRating = avgRating;
		this.total = totalCount;
	}

	/**
	 *
	 */
	getData() {
		const baseUserData = {
			id: this.id,
			role: this.role,
			email: this.email,
			date_joined: this.dateJoined,
		};
		if (this.role === HANDYMAN) {
			baseUserData.contact_email = this.contactEmail;
			baseUserData.phone_no = this.phoneNo;
		}
		return baseUserData;
	}
}
