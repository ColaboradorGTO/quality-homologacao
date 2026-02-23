import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionListaProdutos } from "./actionListaProdutos";
import { ActionRelacaoRecebimentos } from "./actionRelacaoRecebimentos";

export const ActionRelacaoRecebimentosModal = ({ dadosPagamentoModal, show, handleClose }) => {
  

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

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Recebimentos da Venda"}
            handleClose={handleClose}
          />

          <Modal.Body>

            
             
            <ActionListaProdutos dadosPagamentoModal={dadosPagamentoModal} />
            <ActionRelacaoRecebimentos dadosPagamentoModal={dadosPagamentoModal} />
     

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