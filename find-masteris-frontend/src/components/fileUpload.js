export default function FileUpload({ data, setFieldValue, errors }) {
	return (
		<div>
			<input
				type="file"
				name="image"
				accept="image/png, .svg"
				onChange={(e) => {
					if (e.currentTarget.files) {
						setFieldValue('image', e.currentTarget.files[0]);
					}
				}}
			/>
			{errors.image && (
				<div>
					<p className="text-danger">{errors.image}</p>
				</div>
			)}
		</div>
	);
}
