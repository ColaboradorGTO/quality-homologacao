import { Fragment } from "react"
import { useForm } from "react-hook-form"

export const InputFieldModal = ({
  label,
  type,
  id,
  nome,
  value,
  readOnly,
  placeholder,
  onChangeModal,
  onFocus,
  onBlur,
  styleInputFieldModal,
  min,
  max,
  accept

}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  return (

    <Fragment>
      <div className="">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        <input
          className="form-control"
          id={id}
          type={type}
          name={nome}
          {...(type !== 'file' ? { value } : {})}
          readOnly={readOnly}
          placeHolder={placeholder}
          onChange={onChangeModal}
          onFocus={onFocus}
          onBlur={onBlur}
          style={styleInputFieldModal}
          min={min}
          max={max}
          accept={accept}
        />
      </div>
    </Fragment>
  )
}