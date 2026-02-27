import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FomularioEditar,  } from "./formularioEditar";

export const ActionEditarMotivoDevolucaoModal = ({ show, handleClose, dadosDetalheMotivoDevolucao, optionsModulos, usuarioLogado }) => {

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
          title={`Visualização dos Detalhes do Motivo de Devolução`}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FomularioEditar 
            dadosDetalheMotivoDevolucao={dadosDetalheMotivoDevolucao}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClose={handleClose} 
            
          />
        </Modal.Body>
       
      </Modal>
    </Fragment>
  )
}