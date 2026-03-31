import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioConferirVolume } from "./formularioConfeririVolume";

export const ActionConferirVolumeModal = ({
  show,
  handleClose,
  optionsModulos,
  usuarioLogado,
  refetchListaConferencia,
  dadosDetalheTransferencia,
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
            title="Conferir os Volumes da OT"
            subtitle="Efetuar a Leitura dos Códigos de Barras"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioConferirVolume
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              refetchListaConferencia={refetchListaConferencia}
              dadosDetalheTransferencia={dadosDetalheTransferencia}
              setDadosDetalheTransferencia={setDadosDetalheTransferencia}
            />
          </Modal.Body>

        </div>
      </Modal>
    </Fragment>
  )
}
