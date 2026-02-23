import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioEditar } from "./formularioEditar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionEditarOTModal = ({ 
  show, 
  handleClose, 
  dadosDetalheTransferencia, 
  handleClick,
  optionsModulos,
  usuarioLogado,
  setDadosDetalheTransferencia
}) => {

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
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />

          <Modal.Body >
            <FormularioEditar
              dadosDetalheTransferencia={dadosDetalheTransferencia}
              setDadosDetalheTransferencia={setDadosDetalheTransferencia}
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              handleClick={handleClick}
            />
          </Modal.Body>

        </div>
      </Modal>
    </Fragment>
  )
}