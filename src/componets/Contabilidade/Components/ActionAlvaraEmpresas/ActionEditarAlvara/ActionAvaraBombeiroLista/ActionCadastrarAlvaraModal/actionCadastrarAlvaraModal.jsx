import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrarActionAlvara } from "./formularioCadastrarAlvaraModal";

export const ActionCadastrarAlvaraModal = ({
    show,
    optionsModulos,
    usuarioLogado,
    refetchAlvaraEmpresa,
    handleClose,
    dadosAlvaraSelecionado,
    idAlvaraSelecionado,
    refetchAlvaraSelecionado
}) => {

    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                id="CadAlvaraEmpresa"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
            >
                <HeaderModal
                    title={" Adicionar Novo Alvará"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioCadastrarActionAlvara
                        dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        handleClose={handleClose}
                        idAlvaraSelecionado={idAlvaraSelecionado}
                        refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                    />

                </Modal.Body>
            </Modal>
        </Fragment>
    )
}