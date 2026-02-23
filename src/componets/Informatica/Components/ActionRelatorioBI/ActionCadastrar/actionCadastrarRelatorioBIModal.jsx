import React, { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastro } from "./formulario";

export const ActionCadastrarRelatorioBIModal = ({ show, handleClose, refetch, optionsModulos, usuarioLogado }) => {

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
          title={"Relatório BI"}
          subTitle={"Cadastrar Relatório BI"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioCadastro
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClose={handleClose}
            refetch={refetch}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
