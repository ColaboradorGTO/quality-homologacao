import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { ActionCarregaImagem } from "../actionCarregaImagem"
import { FormularioCadastrar } from "./formularioCadastrar"


export const ActionCadastroImagemProdutoModal = ({ show, handleClose }) => {
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
          title={"Imagens"}
          subTitle={"Lista de Produtos Vinculados a Imagem"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}