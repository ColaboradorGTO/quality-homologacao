import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../../Modais/HeaderModal/HeaderModal";
import { FormularioIncluirProdutoPedido } from "./formularioIncluir";

export const ActionIncluirProdutoPedidoModal = ({
  show, 
  handleClose,
  usuarioLogado,
  optionsModulos,
  dadosDetalheGradePedido,
  dadosDetalhePedido,
  dadosPedidosDetalhe,
  dadosVisualizarPedido
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
          title={`Pedido para Produtos de  VESTUARIO Nº ${dadosVisualizarPedido[0]?.IDPEDIDO}`}
          subTitle={"Edição de Itens do Pedido"}
          handleClose={handleClose}
        />
        {console.log(dadosVisualizarPedido[0], 'dadosVisualizarPedido')}

        {console.log(dadosDetalhePedido[0], 'dadosDetalhePedido')}


        <header
          className="p-1"
        >
            <h5 
              className="modal-title" 
              
            >
              Pedido {dadosVisualizarPedido[0]?.STREPOSICAO == 'True' ? `de <label class="text-danger">REPOSIÇÃO</label>` : dadosVisualizarPedido[0]?.STREPOSICAO == 'False' ? `de Produtos <label class="text-info">NOVOS</label>` : ''} 
              para tipoPedido Nº <b> {dadosVisualizarPedido[0]?.IDPEDIDO}</b>
            <small class="m-0 text-muted"> Inclusão de Itens do Pedido </small>
            </h5>
        </header>
        <Modal.Body>  

          <FormularioIncluirProdutoPedido 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            dadosDetalheGradePedido={dadosDetalheGradePedido}
            dadosDetalhePedido={dadosDetalhePedido}
            dadosPedidosDetalhe={dadosPedidosDetalhe}
            dadosVisualizarPedido={dadosVisualizarPedido}
         />
          
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}