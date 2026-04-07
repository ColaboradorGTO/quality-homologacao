import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioFinalizarOT } from "./formularioFinalizarOT";

export const ActionFinalizarOTModal = ({
  show,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  dadosFinalizarOT,
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        centered={true}
        onHide={handleClose}
        size="lg"
      >
        <HeaderModal
          title="Controle Ordem de Transferência"
          subtitle="Nome da Loja"
          handleClose={handleClose}
        />
        <Modal.Body >
          <FormularioFinalizarOT
            handleClose={handleClose}
            refetchListaConferencia={refetchListaConferencia}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            dadosFinalizarOT={dadosFinalizarOT}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
