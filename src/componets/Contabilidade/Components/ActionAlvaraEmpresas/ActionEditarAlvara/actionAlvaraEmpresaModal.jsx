import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import { FormularioActionAlvaraEmpresa } from "./formularioActionAlvaraEmpresa";
import { GrCertificate } from "react-icons/gr";
import { BsFileEarmarkText } from "react-icons/bs";

export const ActionAlvaraEmpresaModal = ({show, dadosAlvaraEmpresaSelecionada,dadosAlvaraEmpresa, optionsModulos, usuarioLogado, refetchAlvaraEmpresa, handleClose }) => {
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
                    />
                   
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}