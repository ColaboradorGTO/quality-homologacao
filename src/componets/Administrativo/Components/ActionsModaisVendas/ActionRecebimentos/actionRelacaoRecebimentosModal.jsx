import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { ActionListaProdutos } from "./actionListaProdutos";
import { ActionListaPagamentos } from "./actionListaPagamentos";
import { FormularioAlteracaoPagamento } from "./FormularioPagamento/formulario";

export const ActionRelacaoRecebimentosModal = ({ 
  dadosDetalheRecebimentos, 
  dadosAtivasVendas,
  show, 
  handleClose, 
  optionsModulos, 
  usuarioLogado 
}) => {
    
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"

        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Recebimentos da Venda"}
            handleClose={handleClose}
          />

          <Modal.Body>
  
            <ActionListaPagamentos  dadosDetalheRecebimentos={dadosDetalheRecebimentos} />
            <ActionListaProdutos dadosDetalheRecebimentos={dadosDetalheRecebimentos} />
           
            <FormularioAlteracaoPagamento 
              dadosDetalheRecebimentos={dadosDetalheRecebimentos} 
              dadosAtivasVendas={dadosAtivasVendas}
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
            />
          </Modal.Body>

        </div>
      </Modal>
    </Fragment>
  )
}