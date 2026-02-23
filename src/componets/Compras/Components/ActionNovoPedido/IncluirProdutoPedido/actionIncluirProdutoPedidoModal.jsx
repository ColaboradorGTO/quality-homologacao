import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioIncluirProdutoPedido } from "./formularioIncluir";

export const ActionIncluirProdutoPedidoModal = ({
  show, 
  handleClose,
  usuarioLogado,
  optionsModulos,
  fornecedorSelecionado,
  tipoPedidoSelecionado,
  marcaSelecionada,
  idResumoPedido
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
            fornecedorSelecionado={fornecedorSelecionado}
            tipoPedidoSelecionado={tipoPedidoSelecionado}
            marcaSelecionada={marcaSelecionada}
            idResumoPedido={idResumoPedido}
         />
          
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}