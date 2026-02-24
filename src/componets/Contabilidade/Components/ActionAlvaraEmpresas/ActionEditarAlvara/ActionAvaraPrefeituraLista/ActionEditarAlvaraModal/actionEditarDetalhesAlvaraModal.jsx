import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import { GrCertificate } from "react-icons/gr";
import { BsFileEarmarkText } from "react-icons/bs";
import { FormularioEditarDetalhesAlvara } from "./formularioEditarDetalhesAlvaraModal";

export const ActionEditarDetalhesAlvaraModal = ({show, dadosAlvaraSelecionado ,dadosAlvaraEmpresa, optionsModulos, usuarioLogado, refetchAlvaraEmpresa, handleClose, refetchAlvaraSelecionado, refetchVinculoAlvara }) => {
    const { register, handleSubmit, errors } = useForm();

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
                    title={"Detalhes do Alvará"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioEditarDetalhesAlvara
                        dadosAlvaraEmpresa={dadosAlvaraEmpresa}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        handleClose={handleClose}
                        dadosAlvaraSelecionado={dadosAlvaraSelecionado}  
                        refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                        refetchVinculoAlvara={refetchVinculoAlvara}
                    />
                   
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}