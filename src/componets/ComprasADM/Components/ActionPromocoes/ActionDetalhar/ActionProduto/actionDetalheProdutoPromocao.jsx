import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../../Buttons/ButtonTypeModal";
import { ActionListaProdutosDestino } from "./actionListaProdutosDestino";
import { ActionListaProdutosOrigem } from "./actionListaProdutosOrigem";


export const ActionDetalheProdutoPromocao = ({ show, handleClose, dadosProdutoOrigem, dadosProdutoDestino, dadosListaPromocao }) => {

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

        <HeaderModal
          title={`Detalhe da Promoção:   ${dadosListaPromocao[0]?.DSPROMOCAOMARKETING} - Nº ${dadosListaPromocao[0]?.IDRESUMOPROMOCAOMARKETING}`}
          subTitle={"Lista dos Produtos da Promoção"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <div className="row">

            <ActionListaProdutosOrigem dadosProdutoOrigem={dadosProdutoOrigem} />
            <ActionListaProdutosDestino dadosProdutoDestino={dadosProdutoDestino} />
          </div>
        </Modal.Body>

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onButtonClickFechar={handleClose}
          corFechar={"secondary"}
        />
      </Modal>
    </Fragment>
  )
}