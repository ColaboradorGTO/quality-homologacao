import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioStatusDivergencia } from "./formularioStatusDivergencia"

export const ActionCadastrarStatusModal = ({
  show,
  handleClose,
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
          subTitle="Cadastrar informações de Status de Divergência"
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioStatusDivergencia
            handleClose={handleClose}
            refetchStatus={refetchStatus}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
