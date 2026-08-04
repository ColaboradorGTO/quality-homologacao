import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarMenuFilho = ({ 
  show, 
  handleClose, 
  dadosDetalhesMenuFilho,
  refetchMenuFilho,
  optionsModulos,
  usuarioLogado,
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
          title={"Dados do Menu Filho"}
          subTitle={"Atualizar Informações do Menu Filho"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar 
            handleClose={handleClose} 
            dadosDetalhesMenuFilho={dadosDetalhesMenuFilho} 
            refetchMenuFilho={refetchMenuFilho}
            optionsModulos={optionsModulos} 
            usuarioLogado={usuarioLogado}
            dadosMenuPai={dadosMenuPai}
          />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
