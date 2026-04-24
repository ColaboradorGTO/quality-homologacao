import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";

export const ActionCadastrarEstilosModal = ({ show, handleClose, usuarioLogado, optionsModulos, handleClick }) => {
 
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >
        <HeaderModal
          title={"Estilos"}
          subTitle={"Cadastrar Estilos"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario
            handleClose={handleClose}
            handleClick={handleClick}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}