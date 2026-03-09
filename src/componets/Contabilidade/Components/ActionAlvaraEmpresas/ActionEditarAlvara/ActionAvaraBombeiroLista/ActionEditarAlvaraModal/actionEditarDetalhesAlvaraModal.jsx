import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarDetalhesAlvara } from "./formularioEditarDetalhesAlvaraModal";

export const ActionEditarDetalhesAlvaraModal = ({
    show,
    dadosAlvaraSelecionado,
    dadosAlvaraEmpresa,
    optionsModulos,
    usuarioLogado,
    refetchAlvaraEmpresa,
    handleClose,
    refetchAlvaraSelecionado,
    refetchVinculoAlvara,
    

}) => {

    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                id="EditarAlvaraEmpresa"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
            >
                <HeaderModal
                    title={"Detalhes do Alvará"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioEditarDetalhesAlvara
                        dadosAlvaraEmpresa={dadosAlvaraEmpresa}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        handleClose={handleClose}
                        dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        refetchVinculoAlvara={refetchVinculoAlvara}
                    />
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}