import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { FormularioVisualizarDetalhesAlvara } from "./formularioVisualizarDetalhesAlvaraModal";

export const ActionVisualizarDetalhesAlvaraModal = ({
    show,
    dadosAlvaraSelecionado,
    optionsModulos,
    usuarioLogado,
    handleClose
}) => {

    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                id="DetalhesAlvaraEmpresa"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
            >
                <HeaderModal
                    title={"Detalhes do Alvará"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioVisualizarDetalhesAlvara
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        handleClose={handleClose}
                        dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                    />

                </Modal.Body>
            </Modal>
        </Fragment>
    )
}