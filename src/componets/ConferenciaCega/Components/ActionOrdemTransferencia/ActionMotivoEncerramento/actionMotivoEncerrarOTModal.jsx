import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioMotivoEncerrarOT } from "./formularioMotivoEncerrarOT";

export const ActionMotivoEncerrarOTModal = ({
  show,
  handleClose,
  dadosEncerrarOT,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
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
          <FormularioMotivoEncerrarOT
            dadosEncerrarOT={dadosEncerrarOT}
            handleClose={handleClose}
            refetchListaConferencia={refetchListaConferencia}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />

        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
