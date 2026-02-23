import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';

import { FormularioDetalhar } from "./forumularioDetalhar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionDetalharEmpresaModal = ({ show, handleClose, dadosEmpresasDetalhe}) => {
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Dados da Empresa"}
          subTitle={"Detlhes da Empresa"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioDetalhar dadosEmpresasDetalhe={dadosEmpresasDetalhe} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}