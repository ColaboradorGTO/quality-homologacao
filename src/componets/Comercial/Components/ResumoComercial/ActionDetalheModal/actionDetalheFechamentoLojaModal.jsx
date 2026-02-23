import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { ActionListaDetalhe } from "./actionListaDetallhe";


export const ActionDetalheFechamentoLojaModal = ({ show, handleClose, dadosDetalheFechamento }) => {

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >

        <div style={{ padding: "10px" }}>

          <HeaderModal
            title={"Detalhe de Fechamento"}
            subTitle={"Relação de Recibimentos do Fechamento da Loja"}
            handleClose={handleClose}
          />

          <Modal.Body>
            <Fragment>
              <ActionListaDetalhe dadosDetalheFechamento={dadosDetalheFechamento} />
            </Fragment>

          </Modal.Body>

          <FooterModal

            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar={"secondary"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}