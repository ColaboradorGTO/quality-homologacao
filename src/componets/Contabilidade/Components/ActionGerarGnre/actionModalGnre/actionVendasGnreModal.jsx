import { Fragment, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import XMLViewer from 'react-xml-viewer';
import Swal from 'sweetalert2';
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ScrollPanel } from 'primereact/scrollpanel';
import { AlertError } from "../../../../Inputs/alertError";
import Select from 'react-select'

import { Formulario } from "./formulario";

export const ActionVendasGnreModal = ({ 
  show, 
  handleClose, 
  dadosDetalhesVendas,
  optionsModulos,
  usuarioLogado
}) => {


  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

          <HeaderModal
            title={`DocEntry Nº ${dadosDetalhesVendas[0]?.DocEntry || ''}`}
            handleClose={handleClose}
          />

          <Modal.Body>
            <Formulario 
              dadosDetalhesVendas={dadosDetalhesVendas}
              handleClose={handleClose}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
            />
          </Modal.Body>

      </Modal>
    </Fragment>
  );
};
