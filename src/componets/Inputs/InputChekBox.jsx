import { Fragment, useState } from "react"

export const InputFieldCheckBox = ({ label, readOnly, id, nome, placeholder }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (

    <Fragment>
      <div className="col-sm-6 col-xl-2 custom-control custom-checkbox mt-4">
        <input
          style={{
            width: "15px",
            height: "15px", 
            marginRight: "10px",
           

          }}
          id={id}
          type="checkbox"
          name={nome}
          readOnly={readOnly}
          checked={isChecked}
          placeHolder={placeholder}
          onChange={handleCheckboxChange}
        />
        <label className="custom-label" htmlFor={id}>
          {label}
        </label>
      </div>
    </Fragment>
  )
}