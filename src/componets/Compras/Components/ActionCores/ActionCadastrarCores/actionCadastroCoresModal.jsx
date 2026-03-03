import { Fragment} from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastro } from "./formularioCadastro";

export const ActionCadastroCoresModal = ({ 
  show, 
  handleClose,
  usuarioLogado,
  refetchListaCores,
  optionsModulos 
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
          title={"Cores"}
          subTitle={"Inclusão de uma Nova Cor"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastro
            usuarioLogado={usuarioLogado}
            refetchListaCores={refetchListaCores}
            optionsModulos={optionsModulos}
            handleClose={handleClose}
           
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
