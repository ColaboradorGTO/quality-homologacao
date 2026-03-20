import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioConferirOT } from "./formularioConferirOT";

export const ActionConferirOT = ({
  show,
  handleClose,
  dadosDetalheTransferencia,
  setDadosDetalheTransferencia,
  usuarioLogado,
  optionsModulos,
  refetchListaConferencia

}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <HeaderModal
          title="Controle Ordem de Transferência"
          subtitle="Nome da Loja"
          handleClose={handleClose}
        />
        <Modal.Body >
          <FormularioConferirOT
            handleClose={handleClose}
            dadosDetalheTransferencia={dadosDetalheTransferencia}
            setDadosDetalheTransferencia={setDadosDetalheTransferencia}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchListaConferencia={refetchListaConferencia}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
