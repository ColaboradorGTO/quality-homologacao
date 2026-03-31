import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FormularioIncuirOT } from "./formularioIncluirOT";

export const ActionIncluirOTModal = ({
  show,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  empresaSelecionadaOrigem,
  usuarioLogado,
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
            <FormularioIncuirOT
              handleClose={handleClose}
              refetchListaConferencia={refetchListaConferencia}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
              empresaSelecionadaOrigem={empresaSelecionadaOrigem}
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
