import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from '../../../../Modais/HeaderModal/HeaderModal';
import { Fragment } from 'react';
import { FormularioEditarLinkBi } from './formulario';
import { set } from 'react-hook-form';

export const ActionEditarRelatorioBIModal = ({
  show,
  handleClose,
  dadosLinkRelatorioBI,
  empresaSelecionada,
  handleTabelaVisivel,
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
          subTitle={"Cadastrar / Alterar"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarLinkBi
            dadosLinkRelatorioBI={dadosLinkRelatorioBI}
            empresaSelecionada={empresaSelecionada}
            handleTabelaVisivel={handleTabelaVisivel}
            handleClose={handleClose}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};