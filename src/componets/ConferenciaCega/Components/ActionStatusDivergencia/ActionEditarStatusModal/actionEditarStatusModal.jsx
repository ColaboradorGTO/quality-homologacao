import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditarStatusDivergencia } from "./formularioEditarStatusModal"

export const ActionEditarStatusModal = ({
  show,
  handleClose,
  dadosEncontrados,
  refetchStatus,
  optionsModulos,
  usuarioLogado
}) => {

  return (

    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <HeaderModal
          title="Status de Divergência"
          subTitle="Atualizar informações de Status de Divergência"
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioEditarStatusDivergencia
            handleClose={handleClose}
            dadosEncontrados={dadosEncontrados}
            refetchStatus={refetchStatus}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
