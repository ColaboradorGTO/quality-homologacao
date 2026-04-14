import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosDestino } from "./actionListaProdutosDestino"
import { Fragment } from "react"
export const ActionEstruturaProdutoDestinoModal = ({ 
    dadosProdutoSubGrupo, 
    show, 
    handleClose,
    produtoSelecionadoEstProdDestino,
    setProdutoSelecionadoEstProdutoDestino,
    setProdutoDestino
}) => {
    return (
        <Fragment>
            <Modal
                show={show}
                // onHide={handleClose}
                size="xl"
                className="modal fade"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"

            >

                <HeaderModal
                    title={"Lista de Produtos Destino"}
                    subTitle={"Estrutura Mercadológica"}
                    handleClose={() => {handleClose(), setProdutoDestino('')}}
                />

                <Modal.Body>

                    <ActionListaProdutosDestino
                        dadosProdutoSubGrupo={dadosProdutoSubGrupo} 
                        produtoSelecionadoEstProdDestino={produtoSelecionadoEstProdDestino}
                        setProdutoSelecionadoEstProdutoDestino={setProdutoSelecionadoEstProdutoDestino}
                        
                    />
                    <FooterModal
                        ButtonTypeFechar={ButtonTypeModal}
                        onClickButtonFechar={() => {handleClose(); setProdutoDestino('')}}
                        textButtonFechar={"Fechar"}
                        corFechar={"secondary"}
                    />
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}