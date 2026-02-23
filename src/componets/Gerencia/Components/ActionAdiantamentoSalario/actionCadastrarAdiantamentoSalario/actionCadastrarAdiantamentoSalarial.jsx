import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrar } from "./formualarioCadastrar";

export const ActionCadastrarAdiantamentoSalarial = ({ show, handleClose, optionsModulos, usuarioLogado}) => {

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
          title={"Adiantamento de Salário"}
          subTitle={"Lançar Adiantamento de Salário"}
          handleClose={handleClose}
        />
      
        <Modal.Body>
          <FormularioCadastrar 
            handleClose={handleClose} 
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}