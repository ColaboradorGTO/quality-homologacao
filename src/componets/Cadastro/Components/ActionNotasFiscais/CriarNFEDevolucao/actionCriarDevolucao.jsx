import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionCriarDevolucaoNFE = ({ show, handleClose, usuarioLogado, optionsModulos, handleClick }) => {
 
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
          title={"Cadastro de NF-e de Devolução"}
          subTitle={"Cadastro de NF-e de Devolução"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}