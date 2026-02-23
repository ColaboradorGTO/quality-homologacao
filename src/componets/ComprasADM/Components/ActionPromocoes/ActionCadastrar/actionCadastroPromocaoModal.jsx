import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioCadastrar } from "./formularioCadastrar"


export const ActionCadastroPromocaoModal = ({ show, handleClose }) => {
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
          title={"Promoção"}
          subTitle={"Cadastrar Promoção"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}