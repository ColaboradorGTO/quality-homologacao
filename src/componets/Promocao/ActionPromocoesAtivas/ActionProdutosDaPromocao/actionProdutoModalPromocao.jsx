import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosPromocao } from "./actionListaProdutosPromocao"
import { Fragment } from "react"
export const ActionProdutoModalPromocao = ({ 
    dadosProdutosPromocaoDaPromocao, 
    show, 
    handleClose,  
    produtoDestinoSelecionado,
    setProdutoDestinoSelecionado, 
    produtoOrigemSelecionado,
    setProdutoOrigemSelecionado, 
    refetchProdutosPromocoes,
    
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
                    subTitle={"Pesquisados para Promoção"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaProdutosPromocao
                        dadosProdutosPromocaoDaPromocao={dadosProdutosPromocaoDaPromocao} 
                        produtoDestinoSelecionado={produtoDestinoSelecionado}
                        setProdutoDestinoSelecionado={setProdutoDestinoSelecionado} 
                        produtoOrigemSelecionado={produtoOrigemSelecionado}
                        setProdutoOrigemSelecionado={setProdutoOrigemSelecionado}
                        refetchProdutosPromocoes={refetchProdutosPromocoes}
                        handleClose={handleClose}
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