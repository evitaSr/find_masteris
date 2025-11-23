import CustomBody from '../../components/customBody';

export default function Unauthorized() {
	return (
		<CustomBody>
			<p style={{ textAlign: 'center', fontSize: '1.5rem' }}>
				You do not have permissions to view this page!
			</p>
		</CustomBody>
	);
}
