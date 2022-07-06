

function CustomSwitch({ id, isChecked, onChange }:{id:string, isChecked:any, onChange:(value:boolean)=>{}}) {
	return (
		<label className="switch">
			<input
				id={id}
				value={isChecked}
				defaultChecked={isChecked}
				type="checkbox"
				onChange={
					(evt) => {
						onChange(evt.target.checked)
					}
				} />
			<span className="slider" />
			<img
				src="/new_icons/switch_on.svg"
				style={{ position:'absolute', right: 6, top: 7, zIndex: 500 }} />
			<img
				src="/new_icons/switch_off.svg"
				style={{ position:'absolute', left: 6, top: 7, zIndex: 1 }} />
		</label>
	)
}

export default CustomSwitch