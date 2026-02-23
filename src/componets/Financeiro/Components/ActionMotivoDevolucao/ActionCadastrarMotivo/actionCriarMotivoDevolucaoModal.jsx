import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionCriarMotivoDevolucaoModal = ({ show, handleClose, optionsModulos, usuarioLogado }) => {
  
  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={'Criar Novo Motivo de Devolução'}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar 
            handleClose={handleClose} 
            optionsModulos={optionsModulos} 
            usuarioLogado={usuarioLogado}  
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}