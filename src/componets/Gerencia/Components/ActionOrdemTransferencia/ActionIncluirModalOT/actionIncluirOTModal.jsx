import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioIncuirOT } from "./formularioIncluirOT";

export const ActionIncluirOTModal = ({ show, handleClose, handleClick, usuarioLogado, optionsModulos }) => {

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <div className="modal-content">
          <HeaderModal
            title="Controle Ordem de Transferência"
            subTitle="Nome da Loja"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioIncuirOT
              handleClick={handleClick}
              handleClose={handleClose}
              usuarioLogado={usuarioLogado}
              optionsModulos={optionsModulos}
            />
            
          </Modal.Body>

        </div>
      </Modal>
    </Fragment>
  )
}
