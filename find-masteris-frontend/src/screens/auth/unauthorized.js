import CustomBody from '../../components/customBody';

export default function Unauthorized() {
	return (
		<CustomBody>
			<div style={{ textAlign: 'center' }}>
				<h1>Unauthorized</h1>
				<p style={{ fontSize: '1.5rem' }}>
					You do not have permissions to view this page!
				</p>
			</div>
		</CustomBody>
	);
}
