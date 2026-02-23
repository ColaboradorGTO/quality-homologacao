import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioCadastrar } from "./formularioCadastrar"

export const ActionCadastroTrasnportadorModal = ({ show, handleClose, usuarioLogado, optionsModulos, handleClick }) => {

  return (
    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="lg"
        centered
      >
        <HeaderModal
          title={"Transportador"}
          subTitle={"Inclusão"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioCadastrar 
            handleClose={handleClose} 
            usuarioLogado={usuarioLogado} 
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}               