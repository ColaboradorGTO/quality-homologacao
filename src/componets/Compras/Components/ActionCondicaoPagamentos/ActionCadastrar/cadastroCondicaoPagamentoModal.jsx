import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastro } from "./formularioCadastro";


export const ActionCadastroCondicaoPagamentoModal = ({ 
  show, 
  handleClose,
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
          subTitle={"Inclusão de Pagamento"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastro 
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