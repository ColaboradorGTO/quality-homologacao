import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarNcm = ({
  show,
  handleClose,
  usuarioLogado,
  optionsModulos,
  refetchNcmExcecao,
  dadosAtualizarNcm
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
          title={"Atualizar NCM Exceção"}
          subTitle={"Atualizar NCM Exceção"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioEditar
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchNcmExcecao={refetchNcmExcecao}
            dadosAtualizarNcm={dadosAtualizarNcm}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}