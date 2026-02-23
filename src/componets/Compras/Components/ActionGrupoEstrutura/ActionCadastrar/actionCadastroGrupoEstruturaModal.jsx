import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { FormularioCadastro } from "./formularioCadastro"

export const ActionCadastroGrupoEstruturaModal = ({ show, handleClose, usuarioLogado, optionsModulos, handleClick }) => {

  return (
    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
      >

        <HeaderModal
          title={"Grupo Estrutura Mercadológica"}
          subTitle={"Inclusão "}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastro 
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