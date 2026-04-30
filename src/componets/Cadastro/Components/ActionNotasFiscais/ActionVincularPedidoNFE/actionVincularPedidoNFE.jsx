import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionVincularPedidoNFE = ({ 
  show, 
  handleClose,  
  handleClick,
  dadosListaPedidosSemVinculoNFE, 
  usuarioLogado, 
  optionsModulos 
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
          title={"Vincular Pedido à NF-e"}
          subTitle={"Vincular Pedido à NF-e"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <Formulario
            dadosListaPedidosSemVinculoNFE={dadosListaPedidosSemVinculoNFE}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClose={handleClose}
            handleClick={handleClick}
          />
          
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}