import { Fragment } from "react"


export const ButtonCadastrar = ({ nome, onClickSubmit, id }) => {
  return (

    <Fragment>
      <div className="">
        <button
          name={nome}
          id={id}
          class="btn btn-success waves-effect waves-themed"
          type="button"
          onClick={() => onClickSubmit()}
        >
     
          {nome}
        </button>
      </div>
    </Fragment>
  )
}