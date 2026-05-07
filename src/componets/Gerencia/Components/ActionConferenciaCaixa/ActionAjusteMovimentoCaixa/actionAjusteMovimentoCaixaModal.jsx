import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";

export const ActionAjusteMovimentoCaixaModal = ({ show, handleClose, dadosDetalheFechamento, usuarioLogado, optionsModulos, refetchCaixaMovimento }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Movimento de Caixa da Loja"}
          subTitle={"Ajustar Movimento de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <Formulario
            dadosDetalheFechamento={dadosDetalheFechamento}
            usuarioLogado={usuarioLogado}
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            refetchCaixaMovimento={refetchCaixaMovimento}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}