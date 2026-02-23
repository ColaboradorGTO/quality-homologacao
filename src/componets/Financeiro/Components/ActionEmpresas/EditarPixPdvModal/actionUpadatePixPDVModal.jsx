import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';;
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionUpdatePixPDVModal = ({ show, handleClose, dadosPixPDV, optionsModulos, usuarioLogado }) => {

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
      >

        <div style={{ padding: "10px" }}>

          <HeaderModal
            title={`Configuração Pix Loja: ${dadosPixPDV[0]?.NOFANTASIA}`}
            handleClose={handleClose}
          />

          <Modal.Body>
            <FormularioEditar 
              dadosPixPDV={dadosPixPDV} 
              handleClose={handleClose} 
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
            />
          </Modal.Body>

        </div>
      </Modal>
    </Fragment>
  )
}