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
      <div className="form-check" style={{ display: 'flex', alignItems: 'center',  }}>

        <div className="row" >
            <label className="form-check-label" htmlFor={id} style={{marginRight: '0.5rem', fontSize: '1rem', fontWeight: '700'}}>
              {label}
            </label>
            <Checkbox 
              inputId={id} 
              name={nome} 
              value={value} 
              onChange={onChange} 
              checked={checked} 
              />
            {/* <input
              className="form-check-input"
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
        </div>
      </div>
    </Fragment>
  );
};