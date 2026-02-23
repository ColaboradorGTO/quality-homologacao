import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { ActionListaProdutosDestino } from "./actionListaProdutosDestino"
import { Fragment } from "react"
export const ActionProdutoDestinoModal = ({ 
    dadosProdutosPesquisa, 
    show, 
    handleClose,
    novoProdutoDestino,
    setNovoProdutoDestino,
    setProdutoDestino
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
                    title={"Lista de Produtos Destino"}
                    subTitle={"Pesquisados para Promoção"}
                    handleClose={() => {handleClose(), setProdutoDestino('')}}
                />

                <Modal.Body>

                    <ActionListaProdutosDestino
                        dadosProdutosPesquisa={dadosProdutosPesquisa} 
                        novoProdutoDestino={novoProdutoDestino}
                        setNovoProdutoDestino={setNovoProdutoDestino}
                        
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