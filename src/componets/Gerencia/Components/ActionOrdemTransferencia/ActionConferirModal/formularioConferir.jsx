import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FaRegSave } from "react-icons/fa"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm } from "react-hook-form"
import { ActionListaProdutos } from "./actionListaProdutos"
import { useEditarOT } from "../hooks/useEditarOT"
export const FormularioConferirOT = ({ 
    handleClose, 
    dadosDetalheTransferencia, 
    handleClick,
    optionsModulos,
    usuarioLogado 
}) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        empresaOrigem,
        setEmpresaOrigem,
        empresaDestino,
        setEmpresaDestino,
        produto,
        setProduto,
        dadosProdutos,
        dadosEmpresa,
        onSubmit,
    } = useEditarOT({ handleClick, handleClose, dadosDetalheTransferencia, optionsModulos, usuarioLogado });

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row" >
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"Loja Origem"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                            onChangeModal={(e) => setEmpresaOrigem(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                      
                        <InputFieldModal
                            label={"Loja Destino"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                            onChangeModal={(e) => setEmpresaDestino(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row" data-select2-id="736">
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"ID"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.IDRESUMOOT}
                            onChangeModal={(e) => setEmpresaOrigem(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                      
                        <InputFieldModal
                            label={"NF-e"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.NUMERONFE}
                            onChangeModal={(e) => setEmpresaDestino(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                      
                        <InputFieldModal
                            label={"Status"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.DESCRICAOOT}
                            onChangeModal={(e) => setEmpresaDestino(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                      
                        <InputFieldModal
                            label={"Data"}
                            type="text"
                            readOnly={true}
                            value={dadosDetalheTransferencia[0]?.DATAEXPEDICAOFORMATADA}
                            onChangeModal={(e) => setEmpresaDestino(e.target.value)}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"Produto"}
                            type="text"
                            value={produto}
                            onChangeModal={(e) => setProduto(e.target.value)}
                            readOnly={[1, 2, 4, 6, 7].indexOf(dadosDetalheTransferencia[0]?.IDSTATUSOT) >= 0}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-8 col-xl-8">

                        <ButtonTypeModal
                            Icon={FaRegSave}
                            textButton={"Salvar"}
                            cor={"info"}
                            className={"mr-4"}
                            type="submit"
                            buttonDisabled={[1, 2, 4, 6, 7].indexOf(dadosDetalheTransferencia[0]?.IDSTATUSOT) >= 0}
                        />
                    </div>
                    <div className="col-sm-8 col-xl-8 mt-4">
                        <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                    </div>
                </div>

                <ActionListaProdutos dadosDetalheTransferencia={dadosDetalheTransferencia} />
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar={"secondary"}
                />
            </form>
        </Fragment>
    )
}