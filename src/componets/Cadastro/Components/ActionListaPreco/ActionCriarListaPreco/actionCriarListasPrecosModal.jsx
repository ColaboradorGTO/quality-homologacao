import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionCriarListasPrecosModal = ({ 
  show, 
  handleClose, 
  optionsModulos,
  usuarioLogado
}) => {


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
          title={"Criação de Lista de Preços"}
          subTitle={`Lista de Lojas - Criar Lista de Preços`}
          handleClose={handleClose}
        />


        <Modal.Body>
          <Formulario 
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}