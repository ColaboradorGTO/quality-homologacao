import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ActionCarregaImagem } from "../actionCarregaImagem"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useCadastrarImagemProduto } from "../hooks/useCadastrarImagemProduto"
import { ActionListaProdutoImagem } from "./actionListaProdutoImagem"
import { useForm } from "react-hook-form"

export const FormularioCadastrar = ({handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        referencia,
        setReferencia,
        numeroPedido,
        setNumeroPedido,
        dadosDetalheProdutos,
        novoProduto,
        setNovoProduto,
        selectedImage,
        setSelectedImage,
        codImgProd,
        setCodImgProd,
        currentFile,
        setCurrentFile,
        onSubmit
    } = useCadastrarImagemProduto({usuarioLogado, optionsModulos, handleClick})
    return (
        <Fragment>
            <form>
                <div className="row">
                    <div className="col-sm-6 col-xl-3">
                        <InputFieldModal
                            label={"Referência *"}
                            type={"text"}
                            id={"refimagemprod"}
                            value={referencia}
                            onChangeModal={(e) => setReferencia(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <InputFieldModal
                            label={"Nº Pedido *"}
                            type={"text"}
                            id={"numpedimagemprod"}
                            value={numeroPedido}
                            onChangeModal={(e) => setNumeroPedido(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '5rem' }} >
                    <ActionCarregaImagem 
                        selectedImage={selectedImage}   
                        setSelectedImage={setSelectedImage}
                        codImgProd={codImgProd}
                        setCodImgProd={setCodImgProd}
                        currentFile={currentFile}
                        setCurrentFile={setCurrentFile}
                    />

                </div>
                <div>
                    <ActionListaProdutoImagem 
                        dadosDetalheProdutos={dadosDetalheProdutos} 
                        novoProduto={novoProduto} 
                        setNovoProduto={setNovoProduto}    
                    />
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                        ButtonTypeCadastrar={ButtonTypeModal}
                        onClickButtonCadastrar={handleSubmit(onSubmit)}
                        textButtonCadastrar={"Salvar"}
                        corCadastrar={"success"}
                />
            </form>
        </Fragment>
    )
}