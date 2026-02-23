import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { FormularioDetalheMalote } from "./formularioDetalhe";

export const ActionDetalheMaloteModal = ({ dadosDetalhesMalote, dadosPendenciasMalotes, handleClose, show }) => {

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
    
            <div style={{ padding: "10px" }}>
    
              <HeaderModal
                title={"Detalhes do Malote"}
                subTitle={"Detalhes e Atualização de Status"}
                handleClose={handleClose}
              />
    
              <Modal.Body>
    
                <FormularioDetalheMalote 
                  dadosDetalhesMalote={dadosDetalhesMalote} 
                  dadosPendenciasMalotes={dadosPendenciasMalotes}
                  handleClose={handleClose}
                />
              
              </Modal.Body>
            </div>
          </Modal>
        </Fragment>
      )
}