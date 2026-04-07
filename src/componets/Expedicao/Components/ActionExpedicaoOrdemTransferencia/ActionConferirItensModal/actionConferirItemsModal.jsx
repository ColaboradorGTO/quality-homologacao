import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FormularioConferirItems } from "./formularioConferirItems";

export const ActionConferirItemsModal = ({
  show,
  handleClose,
  optionsModulos,
  usuarioLogado,
  refetchListaConferencia,
  dadosDetalheTransferencia,
  setDadosDetalheTransferencia,
  setModalConferirItemsModal

}) => {
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={setModalConferirItemsModal}
        size="xl"
      >
        <div className="modal-content">
          <HeaderModal
            title="Controle Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioConferirItems
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              refetchListaConferencia={refetchListaConferencia}
              dadosDetalheTransferencia={dadosDetalheTransferencia}
              setDadosDetalheTransferencia={setDadosDetalheTransferencia}
              setModalConferirItemsModal={setModalConferirItemsModal}
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
