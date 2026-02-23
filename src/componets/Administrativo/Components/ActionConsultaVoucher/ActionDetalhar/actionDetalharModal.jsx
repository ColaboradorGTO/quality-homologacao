import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionListaVendaOrigem } from "./actionListaVendaOrigem";
import { ActionListaVendaDestino } from "./actionListaVendaDestino";


export const ActionDetalharModal = ({ show, handleClose, dadosDetalheVoucher }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >


        <HeaderModal
          title={"Produtos Vendas"}
          subTitle={"Produtos Vendas de Origem e Destino"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <ActionListaVendaOrigem dadosDetalheVoucher={dadosDetalheVoucher} />
          <ActionListaVendaDestino dadosDetalheVoucher={dadosDetalheVoucher} />
        </Modal.Body>


        <FooterModal

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />

      </Modal>
    </Fragment>
  )
}