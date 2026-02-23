import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrar } from "./formularioCadastrar";


export const ActionCadastrarFuncionarioModal = ({ show, handleClose, usuarioLogado, optionsModulos, refetch }) => {

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
          title={"Dados do Funcionário"}
          subTitle={"Cadastrar ou Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioCadastrar 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetch={refetch}  
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}