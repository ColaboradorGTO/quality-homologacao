import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { Fragment } from "react"
import { ActionListaProdutosSelecionadoOrigem } from "./actionListaProdutosSelecionadoOrigem"

export const ActionProdutoModalPromocaoSelecionado = ({ 
    show, 
    handleClose,  
    produtoOrigemSelecionado,
    setProdutoOrigemSelecionado, 
    novoProdutoOrigem,
  setNovoProdutoOrigem,
  fileProdutoOrigem,
  setFileProdutoOrigem
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
                    title={"Lista de Produtos Origem Selecioado"}
                    // subTitle={"Po"}
                    handleClose={handleClose}
                />

                <Modal.Body>

                    <ActionListaProdutosSelecionadoOrigem 
                        produtoOrigemSelecionado={produtoOrigemSelecionado}
                        setProdutoOrigemSelecionado={setProdutoOrigemSelecionado}    
                        novoProdutoOrigem={novoProdutoOrigem}
                        setNovoProdutoOrigem={setNovoProdutoOrigem}
                        fileProdutoOrigem={fileProdutoOrigem}
                        setFileProdutoOrigem={setFileProdutoOrigem}
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