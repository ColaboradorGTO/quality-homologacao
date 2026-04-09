import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { Fragment } from "react"
import { ActionListaProdutosSelecionadoDestino } from "./actionListaProdutosSelecionadoDestino"

export const ActionProdutoModalPromocaoSelecionadoDestino = ({ 
    show, 
    handleClose,  
    produtoDestinoSelecionado,
    setProdutoDestinoSelecionado, 
    novoProdutoDestino,
    setNovoProdutoDestino,
    fileProdutoDestino,
    setFileProdutoDestino
    
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
                    title={"Lista de Produtos Destino Selecioado"}
                    // subTitle={"Po"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaProdutosSelecionadoDestino 
                        produtoDestinoSelecionado={produtoDestinoSelecionado} 
                        setProdutoDestinoSelecionado={setProdutoDestinoSelecionado}
                        novoProdutoDestino={novoProdutoDestino}
                        setNovoProdutoDestino={setNovoProdutoDestino}
                        fileProdutoDestino={fileProdutoDestino}
                        setFileProdutoDestino={setFileProdutoDestino}
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