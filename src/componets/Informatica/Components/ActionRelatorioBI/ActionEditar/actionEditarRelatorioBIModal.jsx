import React, { Fragment  } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarRelatorioBI } from "./formulario";

export const ActionEditarRelatorioBIModal = ({ show, handleClose, dadosRelatorio, refetch, dadosRelatorios, optionModulos, usuarioLogado }) => {

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
          subTitle={"Alterar Relatório BI"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarRelatorioBI
            handleClose={handleClose}
            refetch={refetch}
            dadosRelatorio={dadosRelatorio}
            dadosRelatorios={dadosRelatorios}
            optionModulos={optionModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
