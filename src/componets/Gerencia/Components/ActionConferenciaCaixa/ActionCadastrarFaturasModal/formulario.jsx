import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import { useCadastroFaturas } from "../hook/useCadastrarFaturas";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schemaCadastroFatura";
import { formatarMoeda } from "../../../../../utils/formatMoeda";

export const Formulario = ({ show, handleClose, dadosDetelheFatura, usuarioLogado, optionsModulos, refetchCaixaMovimento }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        empresa,
        setEmpresa,
        codAutorizacao,
        setCodAutorizacao,
        valorFatura,
        setValorFatura,
        numeroMovimento,
        setNumeroMovimento,
        horaAtual,
        setHoraAtual
    } = useCadastroFaturas({ show, handleClose, dadosDetelheFatura, usuarioLogado, optionsModulos, refetchCaixaMovimento });

    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                empresaSelecionada: usuarioLogado?.NOFANTASIA,
                numeroMovimentoCaixa: dadosDetelheFatura?.[0]?.ID,
                codigoAutorizacaoDigitado: codAutorizacao,
                valorFaturaDigitado: valorFatura
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
            //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} >

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="empresaSelecionada"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Empresa"}
                                        name="empresaSelecionada"
                                        type="text"
                                        readOnly={true}
                                        value={usuarioLogado?.NOFANTASIA}
                                        onChange={(e) => setEmpresa(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="numeroMovimentoCaixa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Nº Movimento do Caixa"}
                                        name="numeroMovimentoCaixa"
                                        type="text"
                                        readOnly={true}
                                        value={dadosDetelheFatura[0]?.ID}
                                        onChange={(e) => setNumeroMovimento(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="codigoAutorizacaoDigitado"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Código Autorização"}
                                        name="codigoAutorizacaoDigitado"
                                        type="text"
                                        readOnly={false}
                                        value={codAutorizacao}
                                        onChange={(e) => setCodAutorizacao(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="valorFaturaDigitado"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Valor Fatura"}
                                        name="valorFaturaDigitado"
                                        type="text"
                                        readOnly={false}
                                        value={valorFatura}
                                        onChange={(e) => setValorFatura(formatarMoeda(e.target.value))}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <FooterModal
                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                    textButtonCadastrar={"Receber Fatura"}
                    corCadastrar="success"
                    autoLoadingCadastrar={true}
                    loadingTextCadastrar={"Cadastrando..."}

                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar="secondary"
                />
            </form>
        </Fragment>
    )
}

