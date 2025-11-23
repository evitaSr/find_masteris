import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// api:
import api from '../../api/api';
// assets:
import { ADMIN } from '../../assets/constants/roles';
// components:
import { Button } from 'react-bootstrap';

export default function PasswordChangeForm({
	id,
	user,
	setShowChangePasswordForm,
	passwordChangeSuccessful,
	setPasswordChangeSuccessful,
}) {
	return (
		<Formik
			initialValues={{
				oldPassword: '',
				newPassword: '',
				newPasswordRepeated: '',
			}}
			validationSchema={Yup.object({
				oldPassword:
					user.role === ADMIN
						? Yup.string()
						: Yup.string().required('Required'),
				newPassword: Yup.string()
					.required('Required')
					.notOneOf(
						[Yup.ref('oldPassword')],
						"Password can't match old one"
					),
				newPasswordRepeated: Yup.string()
					.required('Required')
					.oneOf([Yup.ref('newPassword')], 'Passwords must match'),
			})}
			onSubmit={(values) => {
				const changeUserPassword = async () => {
					let data = {
						new_password: values.newPassword,
					};
					if (user.role !== ADMIN) {
						data.old_password = values.oldPassword;
					}
					try {
						const response = await api.put(
							`user/${id}/password/`,
							data
						);
						if (response && response.status === 204) {
							setShowChangePasswordForm(false);
							setPasswordChangeSuccessful(true);
						} else {
							setPasswordChangeSuccessful(false);
						}
					} catch {
						setPasswordChangeSuccessful(false);
					}
				};
				changeUserPassword();
			}}
		>
			<Form>
				{user.role !== ADMIN && (
					<div>
						<label htmlFor="oldPassword">Current password</label>
						<Field name="oldPassword" type="password" />
						<br />
						<ErrorMessage
							className="text-danger"
							component="div"
							name="oldPassword"
						/>
					</div>
				)}
				<label htmlFor="newPassword">New password</label>
				<Field name="newPassword" type="password" />
				<br />
				<ErrorMessage
					className="text-danger"
					component="div"
					name="newPassword"
				/>
				<br />
				<label htmlFor="newPasswordRepeated">Repeat new password</label>
				<Field name="newPasswordRepeated" type="password" />
				<br />
				<ErrorMessage
					className="text-danger"
					component="div"
					name="newPasswordRepeated"
				/>
				<br />
				{!passwordChangeSuccessful && (
					<p className="text-danger">
						Password change was unsuccessful
					</p>
				)}
				<Button variant="primary" type="submit">
					Save
				</Button>
			</Form>
		</Formik>
	);
}
