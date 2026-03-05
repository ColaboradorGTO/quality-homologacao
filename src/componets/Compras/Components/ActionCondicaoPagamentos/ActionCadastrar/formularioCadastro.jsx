import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarCondicaoPagamento } from "../hooks/useCadastrarCondicaoPagamento";
import { schema } from "./schemaValidarPagamento";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { onlyNumbers } from "../../../../../utils/onlyNumbers";

export const FormularioCadastro = ({ 
    handleClose,
    usuarioLogado,
    optionsModulos,
    handleClick 
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        parceladoSelecionado,
        setParceladoSelecionado,
        numeroParcelas,
        setNumeroParcelas,
        dias1Pagamento,
        setDias1Pagamento,
        qtdDiasPagamento,
        setQtdDiasPagamento,
        tipoDocumentoSelecionado,
        setTipoDocumentoSelecionado,
        situacao,
        optionsParcelado,
        dadosTipoDocumentos,
        onSubmit
    } = useCadastrarCondicaoPagamento({handleClose, usuarioLogado, optionsModulos, handleClick});
      
    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoPagamento: descricao,
                parcelaPagamento: parceladoSelecionado,
                numeroParcelasPagamento: numeroParcelas,
                dia1Pagamento: dias1Pagamento,
                qtdDiaPagamento: qtdDiasPagamento,
                tipoDocumento: tipoDocumentoSelecionado,
                situacaoPagamento: statusSelecionado,
            };

            await schema.validate(dadosParaValidar, { abortEarly: false });
            await onSubmit();
        } catch (validationError) {
            console.error('❌ Erro de validação:', validationError);

            clearErrors();

            if (validationError.inner && validationError.inner.length > 0) {
                validationError.inner.forEach(error => {
                if (error.path) {
                    setError(error.path, {
                    type: 'manual',
                    message: error.message
                    });
                }
                });
            }

            const errorMessages = validationError.errors || [validationError.message];
            console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    
    }
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-lg-6">
                            <Controller
                                name="descricaoPagamento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoPagamento"
                                        label={"Descrição *"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={descricao}
                                        onChangeModal={(e) => setDescricao(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <label htmlFor="">Parcelado *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="parcelaPagamento"
                                options={optionsParcelado.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={parceladoSelecionado}
                                onChange={(e) => { 
                                    setParceladoSelecionado(e)
                                    clearErrors("parcelaPagamento")
                                }}
                            />
                             {errors.parcelaPagamento && (
                                <AlertError
                                    error={errors.parcelaPagamento}
                                    onClose={clearErrors}
                                    fieldName="parcelaPagamento"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <Controller
                                name="numeroParcelasPagamento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="numeroParcelasPagamento"
                                        label={"Número Parcelas *"}
                                        type="number"
                                        min={0}
                                        max={99}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={numeroParcelas}
                                        onChangeModal={(e) => {
                                            
                                            setNumeroParcelas(e.target.valu)
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <Controller
                                name="dia1Pagamento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="dia1Pagamento"
                                        label={"Dias 1 Pagamento "}
                                        type="number"
                                        min={0}
                                        max={999}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={dias1Pagamento}
                                        onChangeModal={(e) => setDias1Pagamento(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <Controller
                                name="qtdDiaPagamento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="qtdDiaPagamento"
                                        label={"QTD Dias Pagamento "}
                                        type="number"
                                        min={0}
                                        max={999}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={qtdDiasPagamento}
                                        onChangeModal={(e) => setQtdDiasPagamento(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-6">

                            <label htmlFor="">Tipo Documentos</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoDocumento"
                                options={dadosTipoDocumentos.map((item) => {
                                    return {
                                        value: item.IDTPDOCUMENTO,
                                        label: `${item.IDTPDOCUMENTO} - ${item.DSTPDOCUMENTO}`
                                    }
                                })}
                                value={tipoDocumentoSelecionado}
                                onChange={(e) => { 
                                    setTipoDocumentoSelecionado(e)
                                    clearErrors("tipoDocumento")
                                }}
                            />
                            {errors.tipoDocumento && (
                                <AlertError
                                    error={errors.tipoDocumento}
                                    onClose={clearErrors}
                                    fieldName="tipoDocumento"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="situacaoPagamento"
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
                                onChange={(e) => {
                                    setStatusSelecionado(e)
                                    clearErrors("situacaoPagamento")
                                }}
                            />
                            {errors.situacaoPagamento && (
                                <AlertError
                                    error={errors.situacaoPagamento}
                                    onClose={clearErrors}
                                    fieldName="situacaoPagamento"
                                />
                            )}
                        </div>
                    </div>
                </div>


                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}   