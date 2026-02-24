import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioActionAlvaraEmpresa } from "./formularioActionAlvaraEmpresa";

export const ActionAlvaraEmpresaModal = ({
    show,
    dadosAlvaraEmpresaSelecionada,
    dadosAlvaraEmpresa,
    optionsModulos,
    usuarioLogado,
    refetchAlvaraEmpresa,
    handleClose,
    refetchAlvaraSelecionado,
 }) => {

    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                id="ModalAlvaraEmpresa"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"
            >
                <HeaderModal
                    title={"Dados da Empresa - Alvarás"}
                    subTitle={"Detalhes da Empresa - Alvarás"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioActionAlvaraEmpresa
                        dadosAlvaraEmpresa={dadosAlvaraEmpresa}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        handleClose={handleClose}
                        dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                        refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                    />

                </Modal.Body>

            </Modal>
        </Fragment>
    )
}