import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionCriarListasPrecosModal = ({
  show,
  handleClose,
  optionsModulos,
  usuarioLogado,
  dadosListaPreco,
  refetchListaPreco
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
            dadosListaPreco={dadosListaPreco}
            refetchListaPreco={refetchListaPreco}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}