import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarCondicaoPagamentoModal = ({ 
  show, 
  handleClose, 
  dadosDetalheCondPagamento,
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
          title={"Condições de Pagamento"}
          subTitle={"Editar Pagamento"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalheCondPagamento={dadosDetalheCondPagamento} 
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}