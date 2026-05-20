import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioImportar } from "./formularioImportar";


export const ActionImportarNcm = ({ show, handleClose, usuarioLogado, optionsModulos, refetchNcmExcecao }) => {

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
          title={"Importar NCM Exceção"}
          subTitle={"Importar NCM Exceção"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioImportar
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchNcmExcecao={refetchNcmExcecao}
          />

        </Modal.Body>

      </Modal>
    </Fragment>
  )
}