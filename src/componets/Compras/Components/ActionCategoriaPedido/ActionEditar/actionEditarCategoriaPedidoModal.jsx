import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditar } from "./formularioEditar"

export const ActionEditarCategoriaPedidoModal = ({ 
  show, 
  handleClose, 
  dadosDetalheCategoriaPedido,
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
          title={"Categoria de Pedidos"}
          subTitle={"Editar Categoria de Pedidos"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalheCategoriaPedido={dadosDetalheCategoriaPedido}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}