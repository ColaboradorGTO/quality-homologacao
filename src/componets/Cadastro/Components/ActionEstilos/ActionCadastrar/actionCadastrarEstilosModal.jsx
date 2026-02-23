import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrarEstilos} from "./formularioCadastrar";

export const ActionCadastrarEstilosModal = ({ show, handleClose }) => {
 
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
          <FormularioCadastrarEstilos   />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}