import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";



export const ActionCadastroModalPremiacao = ({ 
  show, 
  handleClose, 
  usuarioLogado, 
  optionsModulos,
  marcaSelecionada 
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
          title={"Regra de Premiações"}
          subTitle={"Inclusão de Bônus"}
          handleClose={handleClose}
        />

        <Modal.Body>

        <Formulario 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          handleClose={handleClose}
          marcaSelecionada={marcaSelecionada}
        />
        
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}