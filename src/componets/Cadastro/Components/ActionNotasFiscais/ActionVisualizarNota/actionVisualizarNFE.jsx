import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionVisualizarNFE = ({ show, handleClose, dadosVisualizarNFE }) => {
 
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
          title={"Visualização de NF-e de Entrada"}
          subTitle={"Visualização de NF-e de Entrada"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario 
            handleClose={handleClose}
            dadosVisualizarNFE={dadosVisualizarNFE}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}