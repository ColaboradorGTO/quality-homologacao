import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { FormularioEditar } from "./formularioEditar"

export const ActionEditarGrupoEstruturaModal = ({ 
  show, 
  handleClose, 
  dadosDetalheGrupo,
  usuarioLogado,
  optionsModulos,
  handleClick 
}) => {

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
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalheGrupo={dadosDetalheGrupo} 
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}  
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}