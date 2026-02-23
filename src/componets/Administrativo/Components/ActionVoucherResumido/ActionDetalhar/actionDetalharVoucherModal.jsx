import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionDetalheVoucher } from "./actionListaDetalheVoucher";

export const ActionDetalharVoucherModal = ({ show, handleClose, dadosDetalheVoucher }) => {

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

        <div style={{ padding: "10px" }}>

          <HeaderModal
            title={"Detalhes do Voucher"}
            subTitle={"Relação de Produtos do Voucher"}
            handleClose={handleClose}
          />

          <Modal.Body>

            <ActionDetalheVoucher dadosDetalheVoucher={dadosDetalheVoucher} />
          </Modal.Body>


          <FooterModal

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />
        </div>
      </Modal>
    </Fragment>
  )
}