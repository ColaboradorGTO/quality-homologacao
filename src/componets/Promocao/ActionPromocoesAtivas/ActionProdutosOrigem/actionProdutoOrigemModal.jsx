import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosOrigem } from "./actionListaProdutosOrigem"
import { Fragment } from "react"
export const ActionProdutoOrigemModal = ({ 
    dadosProdutosPesquisa, 
    show, 
    handleClose,
    novoProdutoOrigem,
    setNovoProdutoOrigem, 
    setProdutoOrigem
}) => {
    return (
        <Fragment>
            <Modal
                show={show}
                // onHide={handleClose}
                size="lg"
                className="modal fade"
                tabIndex={-1}
                role="dialog"
                aria-hidden="true"

            >

                <HeaderModal
                    title={"Lista de Produtos Origem"}
                    subTitle={"Pesquisados para Promoção"}
                    handleClose={() => {handleClose(), setProdutoOrigem('')}}
                />

                <Modal.Body>

                    <ActionListaProdutosOrigem
                        dadosProdutosPesquisa={dadosProdutosPesquisa} 
                        novoProdutoOrigem={novoProdutoOrigem}
                        setNovoProdutoOrigem={setNovoProdutoOrigem}    
                
                    />
                    <FooterModal
                        ButtonTypeFechar={ButtonTypeModal}
                        onClickButtonFechar={() => {handleClose(); setProdutoOrigem('')}}
                        textButtonFechar={"Fechar"}
                        corFechar={"secondary"}
                    />
                </Modal.Body>

            </Modal>
        </Fragment>
    )
}