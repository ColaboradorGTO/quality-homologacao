import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaEmpresasPromocao } from "./actionListaEmpresasPromocao"
import { Fragment } from "react"
export const ActionEmpresasModalPromocao = ({ 
    dadosEmpresasPromocoes, 
    show, 
    handleClose,  
    refetchEmpresasPromocoes,
}) => {
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
                    title={"Lista de Empresas da Promoção"}
                    subTitle={"Lista de Empresas da Promoção"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaEmpresasPromocao
                        dadosEmpresasPromocoes={dadosEmpresasPromocoes}
                        refetchEmpresasPromocoes={refetchEmpresasPromocoes}
                    />
                    <FooterModal
                        ButtonTypeFechar={ButtonTypeModal}
                        onClickButtonFechar={handleClose}
                        textButtonFechar={"Fechar"}
                        corFechar={"secondary"}
                    />
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}