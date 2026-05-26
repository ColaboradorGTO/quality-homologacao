import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import XMLViewer from 'react-xml-viewer';
import Swal from 'sweetalert2';
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ScrollPanel } from 'primereact/scrollpanel';
import axiosInstance from "../../../../api/api";


export const ActionVendasGnreModal = ({ show, handleClose, dadosDetalhesVendas }) => {


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
        <div className="" role="document">
          <HeaderModal
            title={"XML Venda Nº " }
            handleClose={handleClose}
          />

          <Modal.Body>
            
          </Modal.Body>


          <FooterModal
            // ButtonTypeFechar={ButtonTypeModal}
            // textButtonFechar={"Abrir XML em Nova Aba"}
            // onClickButtonFechar={handleOpenNewTab}
            // corFechar={"info"}

            // ButtonTypeCadastrar={ButtonTypeModal}
            // textButtonCadastrar={"Copiar XML"}
            // onClickButtonCadastrar={handleCopyXML}
            // corCadastrar={"primary"}

            // ButtonTypeConfirmar={ButtonTypeModal}
            // textButtonConfirmar={"Download"}
            // onClickButtonConfirmar={handleDownloadXML}
            // corConfirmar={"success"}

            ButtonTypeCancelar={ButtonTypeModal}
            textButtonCancelar={"PDF"}
            onClickButtonCancelar
            corCancelar={"danger"}
          />

        </div>
      </Modal>
    </Fragment>
  );
};
