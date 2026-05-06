import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarMenuFilhoModal = ({ 
  show, 
  handleClose, 
  dadosAtualizarMenu, 
  optionsModulos, 
  usuarioLogado, 
  refetchMenuFilho,
  dadosMenuPai

}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Editar Menu Filho"}
          subTitle={"Atualizar Informações do Menu Filho"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioEditar
            dadosAtualizarMenu={dadosAtualizarMenu}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClose={handleClose}
            refetchMenuFilho={refetchMenuFilho}
            dadosMenuPai={dadosMenuPai}
          />

        </Modal.Body>
      </Modal>
    </Fragment>
    
  )
}