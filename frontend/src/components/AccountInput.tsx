const AccountInput = ({ id, label, onChange, errors = [] }: any) => {
	return (
		<div className="input_container">
			<label htmlFor={id}>{label}</label>
			<input
				className={errors.length > 0 ? 'error' : ''}
				id={id}
				onChange={onChange}
				type="text"
			/>
			{errors.length > 0 && (
				<ul className="error-list">
					{errors.map((error: string, index: number) => (
						<li key={index}>{error}</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default AccountInput;
