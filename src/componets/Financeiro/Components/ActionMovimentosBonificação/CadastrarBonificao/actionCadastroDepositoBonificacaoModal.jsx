import React, { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionCadastroDepositoBonificacaoModal = ({ 
  show, 
  handleClose, 
  usuarioLogado,
  funcionario, 
  setFuncionario, 
  optionsModulos,
  optionsFuncionarios
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
          title={"Dados do Depósito Funcionário"}
          subTitle={"Cadastrar Depósitos Bonificação Funcionário"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioCadastrar 
            handleClose={handleClose} 
            usuarioLogado={usuarioLogado}
            funcionario={funcionario}
            setFuncionario={setFuncionario}  
            optionsModulos={optionsModulos}
            optionsFuncionarios={optionsFuncionarios}
          />

        </Modal.Body>
      </Modal>
    </Fragment>
  )
}