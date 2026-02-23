import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FormularioMotivoEncerrarOT } from "./formularioMotivoEncerrarOT";

export const ActionMotivoEncerrarOTModal = ({ show, handleClose, dadosEncerrarOT }) => {

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
          <FormularioMotivoEncerrarOT dadosEncerrarOT={dadosEncerrarOT}/>

        </Modal.Body>

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}
        />

      </Modal>
    </Fragment>
  )
}
