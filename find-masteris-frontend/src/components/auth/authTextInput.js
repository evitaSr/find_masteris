import { ErrorMessage, Field } from 'formik';

export function AuthTextInput({ name, label, isEmail = false }) {
	return (
		<div style={{ marginBottom: '0.5rem' }}>
			<label style={{ marginRight: '1rem' }}>{label}</label>
			<Field
				name={name}
				type={isEmail ? 'email' : 'text'}
				className="form-control"
			/>
			<ErrorMessage component="div" name={name} className="text-danger" />
		</div>
	);
}
