import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditarEstilos } from "./formularioEditarEstilos";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionEditarEstilosModal = ({ show, handleClose, handleClick, dadosDetalheEstilos, usuarioLogado, optionsModulos }) => {

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
          title={"Estilos"}
          subTitle={" Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarEstilos 
            dadosDetalheEstilos={dadosDetalheEstilos} 
            handleClose={handleClose} 
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}