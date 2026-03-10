import { Fragment } from "react";
import { Checkbox } from "primereact/checkbox";

export const InputFieldActionCheckBox = ({ 
  label, 
  type, 
  id, 
  nome, 
  value, 
  readOnly, 
  placeHolder, 
  disabled, 
  checked, 
  onChange = () => {}, 
  style 
}) => {
  return (
    <Fragment>
      <div style={style}>

        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        <div className="input-group" >
          {/* <input
            className="form-control"
            id={id}
            type={type}
            name={nome}
            value={value}
            readOnly={readOnly}
            placeHolder={placeHolder}
            onChange={onChange}
            disabled={disabled}
            style={style}
          /> */}
          <Checkbox 
            inputId={id} 
            name={nome} 
            value={value} 
            onChange={onChange} 
            checked={checked} 
          />
        </div>
      </div>
    </Fragment>
  );
};