import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { FormularioEditarVisualizarOT } from "./formularioEditarVisualizarOT";

export const ActionEditarOTModal = ({
  show,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
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
            title="Controle Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioEditarVisualizarOT
              handleClose={handleClose}
              refetchListaConferencia={refetchListaConferencia}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              dadosDetalheTransferencia={dadosDetalheTransferencia}
              setDadosDetalheTransferencia={setDadosDetalheTransferencia}
            />
          </Modal.Body>
          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar={"secondary"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}
