import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosOrigem } from "./actionListaProdutosOrigem"
import { Fragment } from "react"
export const ActionEstruturaProdutoOrigemModal = ({ 
    dadosProdutoSubGrupo, 
    show, 
    handleClose,
    produtoSelecionadoEstProdOrigem,
    setProdutoSelecionadoEstProdutoOrigem, 
    setProdutoOrigem
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
                    title={"Lista de Produtos Origem"}
                    subTitle={"Estrutura Mercadológica"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaProdutosOrigem
                        dadosProdutoSubGrupo={dadosProdutoSubGrupo} 
                        produtoSelecionadoEstProdOrigem={produtoSelecionadoEstProdOrigem}
                        setProdutoSelecionadoEstProdutoOrigem={setProdutoSelecionadoEstProdutoOrigem}    
                
                    />
                    <FooterModal
                        ButtonTypeFechar={ButtonTypeModal}
                        // onClickButtonFechar={() => {handleClose(); setProdutoOrigem('')}}
                        onClickButtonFechar={handleClose}
                        textButtonFechar={"Fechar"}
                        corFechar={"secondary"}
                    />
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}