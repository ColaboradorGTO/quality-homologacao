import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { Formulario } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionCadastrarEstilosModal = ({ show, handleClose, usuarioLogado, optionsModulos }) => {

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >
        <HeaderModal
          title={"Estilos"}
          subTitle={"Cadastrar"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario
            handleClose={handleClose} 
            usuarioLogado={usuarioLogado} 
            optionsModulos={optionsModulos} 
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}