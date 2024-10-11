const AccountInput = ({id, label}: any) => {
    return (
        <div className="input_container">
            <label htmlFor={id}>{label}</label>
            <input id={id} type="text" />
        </div>
    )
}

export default AccountInput