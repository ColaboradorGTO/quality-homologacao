import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarEstilos } from "./formularioEditar";

export const ActionEditarEstilosModal = ({ show, handleClose, dadosDetalheEstilos }) => {
 
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
          subTitle={" Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarEstilos dadosDetalheEstilos={dadosDetalheEstilos}  />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}