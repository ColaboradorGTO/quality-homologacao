import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditar } from "./formularioEditar"

export const ActionEditarTrasnportadorModal = ({ 
  show, 
  handleClose, 
  dadosDetalheTranspotador,
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
        size="lg"
        centered
      >
        <HeaderModal
          title={"Transportador"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioEditar
            handleClose={handleClose}
            dadosDetalheTranspotador={dadosDetalheTranspotador}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}               