import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";


export const ActionEditarFuncionario = ({ 
  show, 
  handleClose, 
  dadosAtualizarFuncionarios, 
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
          subTitle={" Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioEditar
            handleClose={handleClose}
            dadosAtualizarFuncionarios={dadosAtualizarFuncionarios}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClick={handleClick}
            refetch={refetch}
          />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
