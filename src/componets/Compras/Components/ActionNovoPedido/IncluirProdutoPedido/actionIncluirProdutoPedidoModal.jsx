import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioIncluirProdutoPedido } from "./formularioIncluir";

export const ActionIncluirProdutoPedidoModal = ({
  show, 
  handleClose,
  usuarioLogado,
  optionsModulos,
  tipoPedidoSelecionado,
  marcaSelecionada,
  idResumoPedido,
  dadosUltimosPedidos
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
          title={`Pedido para VESTUARIO Nº ${idResumoPedido}`}
          subTitle={"Inclusão de Itens do Pedido"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioIncluirProdutoPedido 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            tipoPedidoSelecionado={tipoPedidoSelecionado}
            marcaSelecionada={marcaSelecionada}
            idResumoPedido={idResumoPedido}
            dadosUltimosPedidos={dadosUltimosPedidos}
         />
          
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}