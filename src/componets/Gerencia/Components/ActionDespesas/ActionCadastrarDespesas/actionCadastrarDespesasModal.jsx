import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionCadastrarDespesasModal = ({ show, handleClose, optionsModulos, usuarioLogado, handleClick}) => {
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
          title={"Dados da Despesa da Loja"}
          subTitle={"Cadastrar Despesas da Loja"}
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