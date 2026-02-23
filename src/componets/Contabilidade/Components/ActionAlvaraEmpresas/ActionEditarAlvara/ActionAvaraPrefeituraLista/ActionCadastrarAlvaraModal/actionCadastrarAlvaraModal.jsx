import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import { GrCertificate } from "react-icons/gr";
import { BsFileEarmarkText } from "react-icons/bs";
import { FormularioCadastrarActionAlvara } from "./formularioCadastrarAlvaraModal";

export const ActionCadastrarAlvaraModal = ({show, dadosAlvaraEmpresaSelecionada,dadosAlvaraEmpresa, optionsModulos, usuarioLogado, refetchAlvaraEmpresa, handleClose }) => {
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
                    title={" Adicionar Novo Alvará"}
                    handleClose={handleClose}
                />
                <Modal.Body>
                    <FormularioCadastrarActionAlvara
                        dadosAlvaraEmpresa={dadosAlvaraEmpresa}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        handleClose={handleClose}
                        dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}  
                    />
                   
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}