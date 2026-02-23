import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";


export const ActionEditarDescontoFuncionarioModal = ({ 
  show, 
  handleClose, 
  dadosDescontoFuncionarios, 
  optionsModulos, 
  usuarioLogado, 
  handleClick,
  refetch 
}) => {

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

          <FormularioEditar
            dadosDescontoFuncionarios={dadosDescontoFuncionarios}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClick={handleClick}
            handleClose={handleClose}
            refetch={refetch}
          />

        </Modal.Body>
      </Modal>
    </Fragment>
    
  )
}