import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";


export const ActionEditarFuncionario = ({ 
  show, 
  handleClose, 
  dadosAtualizarFuncionarios,
  handleClick,
  optionsModulos,
  usuarioLogado 
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
          subTitle={" Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosAtualizarFuncionarios={dadosAtualizarFuncionarios} 
            handleClick={handleClick}
            optionsModulos={optionsModulos} 
            usuarioLogado={usuarioLogado}
          />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
