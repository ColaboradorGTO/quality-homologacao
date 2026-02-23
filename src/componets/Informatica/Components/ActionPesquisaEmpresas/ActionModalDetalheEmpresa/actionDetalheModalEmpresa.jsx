import { Fragment } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioDetalhar } from "./FormularioDetalhe"
import { Modal } from "react-bootstrap"

export const ActionDetalheModalEmpresa = ({ show, handleClose, dadosDetalhesEmpresa, optionsModulos, usuarioLogado }) => {
    return (
        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                className="modal fade"
                tabIndex={-1}
            >
                <HeaderModal
                    title={`Dados da Empresa`}
                    handleClose={handleClose}
                />

                <Modal.Body>
                    <FormularioDetalhar
                        dadosDetalhesEmpresa={dadosDetalhesEmpresa}
                        handleClose={handleClose}
                    />
                </Modal.Body>


            </Modal>
        </Fragment>
    )
}
