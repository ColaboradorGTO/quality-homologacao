import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarTecido } from "./formularioEditarTecido";

export const ActionEditarTipoTecidosModal = ({ 
  show, 
  handleClose, 
  dadosDetalheTipoTecido, 
  usuarioLogado, 
  optionsModulos 
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
          title={"Tipo de Tecidos"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarTecido 
            dadosDetalheTipoTecido={dadosDetalheTipoTecido}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos} 
            handleClose={handleClose} 
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}