import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FaRegSave } from "react-icons/fa"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { Controller, useForm } from "react-hook-form"
import { ActionListaProdutos } from "./actionListaProdutos"
import { useEditarOT } from "../hooks/useEditarOT"
import FormField from "../../../../Formularios/FormField"
export const FormularioConferirOT = ({
    handleClose,
    dadosDetalheTransferencia,
    handleClick,
    optionsModulos,
    usuarioLogado
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
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
                        <Controller
                            name="lojaOrigem"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Loja Origem"}
                                    name="lojaOrigem"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                                    onChange={(e) => setEmpresaOrigem(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />

                    </div>
                    <div className="col-sm-6 col-xl-6" >

                        <Controller
                            name="lojaDestino"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Loja Destino"}
                                    name="lojaDestino"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                                    onChange={(e) => setEmpresaDestino(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                    </div>
                </div>
                <div className="row" data-select2-id="736">
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="id"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"ID"}
                                    name="id"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.IDRESUMOOT}
                                    onChange={(e) => setEmpresaOrigem(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >

                        <Controller
                            name="NFe"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"NF-e"}
                                    name="NFe"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.NUMERONFE}
                                    onChange={(e) => setEmpresaDestino(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                        <Controller
                            name="Status"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Status"}
                                    name="Status"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.DESCRICAOOT}
                                    onChange={(e) => setEmpresaDestino(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6" >
                        <Controller
                            name="Data"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data"}
                                    name="Data"
                                    type="text"
                                    readOnly={true}
                                    value={dadosDetalheTransferencia[0]?.DATAEXPEDICAOFORMATADA}
                                    onChange={(e) => setEmpresaDestino(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="Produto"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data"}
                                    name="Produto"
                                    type="text"
                                    value={produto}
                                    readOnly={[1, 2, 4, 6, 7].indexOf(dadosDetalheTransferencia[0]?.IDSTATUSOT) >= 0}
                                    onChange={(e) => setProduto(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
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

                <ActionListaProdutos
                    dadosDetalheTransferencia={dadosDetalheTransferencia}
                />

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