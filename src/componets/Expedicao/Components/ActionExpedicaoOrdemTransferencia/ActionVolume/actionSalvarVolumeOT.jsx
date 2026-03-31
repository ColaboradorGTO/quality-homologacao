import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioSalvarVolumeOT } from "./formularioSalvarVolumeOT";

export const ActionSalvarVolumeOTModal = ({
  show,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  dadosDetalheTransferencia,
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <HeaderModal
          title="Informar os Volumes da OT"
          subtitle="Preencher com a Quantidade e Descrição dos Volumes"
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioSalvarVolumeOT
            handleClose={handleClose}
            refetchListaConferencia={refetchListaConferencia}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            dadosDetalheTransferencia={dadosDetalheTransferencia}
     
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
