const AccountInput = ({id, label, onChange }: any) => {
    return (
        <div className="input_container">
            <label htmlFor={id}>{label}</label>
            <input id={id} onChange={onChange} type="text" />
        </div>
    )
}

export default AccountInput