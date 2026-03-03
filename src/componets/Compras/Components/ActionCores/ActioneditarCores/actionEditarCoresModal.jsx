import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./actionFormularioEditar";

export const ActionEditarCoresModal = ({ 
  show, 
  handleClose, 
  dadosDetalheCores,
  usuarioLogado,
  refetchListaCores,
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
          title={"Cores"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalheCores={dadosDetalheCores} 
            usuarioLogado={usuarioLogado}
            refetchListaCores={refetchListaCores}
            optionsModulos={optionsModulos}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}