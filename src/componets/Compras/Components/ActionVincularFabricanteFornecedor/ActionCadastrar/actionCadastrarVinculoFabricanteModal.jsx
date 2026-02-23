import { Fragment } from "react"
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../../Modais/HeaderModal/HeaderModal";

export const ActionCadastrarVinculoFabricanteModal = ({ show, handleClose }) => {
  
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
          title={"Vínculo Fabricante / Fornecedor"}
          subTitle={"Inclusão e Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}