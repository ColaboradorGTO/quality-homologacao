import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioSalvarVolumeOT } from "./formularioSalvarVolumeOT";

export const ActionSalvarVolumeOTModal = ({
  show,
  handleClose,
  dadosSalvarVolume,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <HeaderModal
          title="Controle Ordem de Transferência"
          subtitle="Nome da Loja"
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioSalvarVolumeOT
            dadosSalvarVolume={dadosSalvarVolume}
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
