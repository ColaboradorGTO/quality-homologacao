import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditar } from "./formularioEditar"

export const ActionVincularFabricanteFornecedorModal = ({ 
  show, 
  handleClose, 
  dadosDetalheFornecedorFabricante,
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
        size="lg"
        centered
      >

        <HeaderModal
          title={"Vínculo Fabricante / Fornecedor"}
          subTitle={"Inclusão e Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalheFornecedorFabricante={dadosDetalheFornecedorFabricante} 
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>
      </Modal>

    </Fragment>
  )
}