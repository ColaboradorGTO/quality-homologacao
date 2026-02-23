import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarContaBancoModal = ({ 
  show,
  handleClose, 
  dadosDetalheContaBanco, 
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
          subTitle={"Editar Conta"}
          handleClose={handleClose}
        />
       
        <Modal.Body>
       
          <FormularioEditar
            handleClose={handleClose}
            dadosDetalheContaBanco={dadosDetalheContaBanco}
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