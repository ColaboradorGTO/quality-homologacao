import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionCadastrarDepositoModal = ({ show, handleClose, optionsModulos, usuarioLogado, handleClick}) => {
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
          title={"Dados do Depósitos da Loja"}
          subTitle={"Cadastrar Depósitos da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioCadastrar
            handleClose={handleClose} 
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClick={handleClick}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}