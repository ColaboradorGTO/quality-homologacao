import { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from '../../../../Modais/HeaderModal/HeaderModal';
import { FormularioCadastroLinkBi } from './formulario';
export const ActionCadastrarRelatorioBIModal = ({
  show,
  handleClose,
  refetchListaRelatorio,
  optionsModulos,
  usuarioLogado
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Link Relatório BI"}
          subTitle={"Cadastrar "}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioCadastroLinkBi
            handleClose={handleClose}
            refetchListaRelatorio={refetchListaRelatorio}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}

          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}