import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FormularioCadastroProduto } from "./formularioCadastroProduto"


export const ActionCadastrarProodutodPedidoAvulsoModal = ({ show, handleClose }) => {

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
          title={"Produtos Avulso"}
          subTitle={"Inclusão de Produtos Avulso"}
          handleClose={handleClose}
        />

          <FormularioCadastroProduto />
        <Modal.Body>
          
        </Modal.Body>
      </Modal>

    </Fragment>
  )
}
