import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditar } from "./formularioEditar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionEditarUnidadeMedidaModal = ({ 
  show, 
  handleClose, 
  dadosDetalheUnidadeMedida,
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
          title={"Unidades de Medida"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            dadosDetalheUnidadeMedida={dadosDetalheUnidadeMedida} 
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