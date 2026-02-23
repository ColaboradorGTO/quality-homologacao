import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrarFaturas } from "./formularioCadastroFaturas";

export const ActionCadastrarFaturaModal = ({ show, handleClose, dadosDetelheFatura, usuarioLogado, optionsModulos, refetchCaixaMovimento }) => {
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
          title={"Dados da Fatura da Loja"}
          subTitle={"Recebimento de Faturas da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioCadastrarFaturas
            show={show}
            handleClose={handleClose}
            dadosDetelheFatura={dadosDetelheFatura}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchCaixaMovimento={refetchCaixaMovimento}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}