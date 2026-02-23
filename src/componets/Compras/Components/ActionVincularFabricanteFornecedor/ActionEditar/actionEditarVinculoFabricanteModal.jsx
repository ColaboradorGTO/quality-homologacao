import { Fragment } from "react"
import { FormularioEditar } from "./formularioEditar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Modal } from "react-bootstrap"

export const ActionEditarVinculoFabricanteModal = ({ 
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
        size="xl"
        centered
      >

        <HeaderModal
          title={"Vínculo Fabricante / Fornecedor"}
          subTitle={"Alteração"}
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