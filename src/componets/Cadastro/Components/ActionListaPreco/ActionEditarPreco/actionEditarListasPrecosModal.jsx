import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionEditarListasPrecosModal = ({ 
  show, 
  handleClose, 
  dadosListaLoja,
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
          title={"Edição de Lista de Preços"}
          // subTitle={`Lista de Lojas: ${dadosListaLoja[0]?.listaPreco.NOMELISTA}`}
          handleClose={handleClose}
        />


        <Modal.Body>
          <Formulario 
            dadosListaLoja={dadosListaLoja}
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}