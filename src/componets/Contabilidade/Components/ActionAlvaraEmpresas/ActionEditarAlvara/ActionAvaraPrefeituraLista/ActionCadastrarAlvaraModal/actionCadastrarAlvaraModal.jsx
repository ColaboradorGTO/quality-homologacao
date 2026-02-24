import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import { GrCertificate } from "react-icons/gr";
import { BsFileEarmarkText } from "react-icons/bs";
import { FormularioCadastrarActionAlvara } from "./formularioCadastrarAlvaraModal";

export const ActionCadastrarAlvaraModal = ({show, dadosAlvaraEmpresa, optionsModulos, usuarioLogado, refetchAlvaraEmpresa, handleClose, dadosAlvaraSelecionado, idAlvaraSelecionado, refetchAlvaraSelecionado  }) => {
    const { register, handleSubmit, errors } = useForm();
    //console.log(dadosAlvaraEmpresaSelecionada, "dadosAlvaraEmpresaSelecionada modal cadastro")
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
                       dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                       idAlvaraSelecionado={idAlvaraSelecionado} 
                       refetchAlvaraSelecionado={refetchAlvaraSelecionado} 
                    />
                   
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}