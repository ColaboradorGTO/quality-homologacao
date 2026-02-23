import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditar } from "./formularioEditar"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"


export const ActionEditarProdutoPedidoModal = ({ show, handleClose }) => {

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
          title={"Produto Pedido"}
          subTitle={"Edição de Produto Pedido"}
          handleClose={handleClose}
        />

          <FormularioEditar />
        <Modal.Body>
          
        </Modal.Body>
      </Modal>

    </Fragment>
  )
}
