import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioVisualizar } from "./formularioVisualizar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionVisualizarOTModal = ({show, handleClose, dadosDetalheTransferencia }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <HeaderModal
          title="Faturamento Ordem de Transferência"
          subtitle=""
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioVisualizar handleClose={handleClose} dadosDetalheTransferencia={dadosDetalheTransferencia} />
        </Modal.Body>
    
      </Modal>
    </Fragment>
  )
}