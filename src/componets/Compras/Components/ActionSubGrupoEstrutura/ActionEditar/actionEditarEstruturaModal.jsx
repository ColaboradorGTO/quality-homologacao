import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditar } from "./formularioEditar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionEditarEstruturaModal = ({ 
  show, 
  handleClose, 
  dadosDetalheSubGrupo,
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
        centered
      >

        <HeaderModal
          title={"Estrutura Mercadológica"}
          subTitle={" Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            dadosDetalheSubGrupo={dadosDetalheSubGrupo} 
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