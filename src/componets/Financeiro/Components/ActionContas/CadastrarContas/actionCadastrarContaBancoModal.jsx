import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrar } from "./formularioCadastrar";

export const ActionCadastrarContaBancoModal = ({ 
  show,
  handleClose, 
  optionsModulos,
  usuarioLogado,
  dadosBanco,
  handleClick
}) => {
  
  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Dados da Conta"}
          subTitle={"Cadastrar Conta"}
          handleClose={handleClose}
        />
       
        <Modal.Body>
       
          <FormularioCadastrar
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            dadosBanco={dadosBanco}
            handleClick={handleClick}
          />
       
        </Modal.Body>
        
      </Modal>
    </Fragment>
  )
}