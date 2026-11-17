import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { Fragment } from "react"
import { ActionListaProdutos } from "./actionListaProdutos"

export const ActionModalProduto = ({ 
    show, 
    handleClose,  
    produtosOrigemDetalhados,
    handleRemoverProdutoOrigem,
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
                    title={"Lista de Produtos"}
                    // subTitle={"Po"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaProdutos
                        produtosOrigemDetalhados={produtosOrigemDetalhados}
                        handleRemoverProdutoOrigem={handleRemoverProdutoOrigem}
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