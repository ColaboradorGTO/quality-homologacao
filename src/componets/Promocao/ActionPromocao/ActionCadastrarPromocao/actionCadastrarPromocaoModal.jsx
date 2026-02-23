import { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FormularioCadatrarPromocao } from './formularioCadastrar';
import { HeaderModal } from '../../../Modais/HeaderModal/HeaderModal';

export const ActionCadastrarPromocaoModal = ({ show, handleClose }) => {

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
          title={"Cadastrar Promoção"}
          subTitle={"Cadastrar Produto Promoção"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadatrarPromocao handleClose={handleClose} />
        </Modal.Body>
        
      </Modal>
    </Fragment>
  );
};