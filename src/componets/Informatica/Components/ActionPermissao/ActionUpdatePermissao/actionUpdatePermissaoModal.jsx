import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditar } from "./fomurlarioEditar";

export const ActionUpdatePermissaoModal = ({show, handleClose, handleClick, dadosEditarPermissao, usuarioLogado}) => {
   
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
                title={"Dados de Permissão"}
                subTitle={" Atualizar Permissão"}
                handleClose={handleClose}
                />


                <Modal.Body>
                    
                <FormularioEditar 
                    dadosEditarPermissao={dadosEditarPermissao} 
                    handleClose={handleClose} 
                    handleClick={handleClick}
                    
                />

                </Modal.Body>

            </Modal>
        </Fragment>
    )
}