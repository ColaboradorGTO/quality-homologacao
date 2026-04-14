import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosOrigem } from "./actionListaProdutosOrigem"
import { Fragment } from "react"
export const ActionEstruturaProdutoOrigemModal = ({ 
    dadosProdutoSubGrupoOrigem, 
    show, 
    handleClose,
    produtoSelecionadoEstProdOrigem,
    setProdutoSelecionadoEstProdutoOrigem, 
    novoProdutoEstProdOrigem,
    setNovoProdutoEstProdOrigem
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
                        dadosProdutoSubGrupoOrigem={dadosProdutoSubGrupoOrigem} 
                        produtoSelecionadoEstProdOrigem={produtoSelecionadoEstProdOrigem}
                        setProdutoSelecionadoEstProdutoOrigem={setProdutoSelecionadoEstProdutoOrigem}    
                        novoProdutoEstProdOrigem={novoProdutoEstProdOrigem}
                        setNovoProdutoEstProdOrigem={setNovoProdutoEstProdOrigem}
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