import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FormularioEditarOT } from "./formularioEditarOT";

export const ActionEditarOTModal = ({
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
            title="Controle Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioEditarOT
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              refetchListaConferencia={refetchListaConferencia}
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
