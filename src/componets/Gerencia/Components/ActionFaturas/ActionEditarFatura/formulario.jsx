import { Fragment, } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { useForm, Controller } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useEditarFatura } from "../hooks/useEditarFatura";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/useEditarSchema";

export const Formulario = ({ handleClose, dadosDetalheFatura, usuarioLogado, optionsModulos, handleClick, refetchListaFaturas }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        empresa,
        setEmpresa,
        codAutorizacao,
        setCodAutorizacao,
        valorFatura,
        setValorFatura,
        valorFaturaAntigo,
        setValorFaturaAntigo,
        numeroMovimento,
        setNumeroMovimento,
        onSubmit
    } = useEditarFatura({ dadosDetalheFatura, usuarioLogado, optionsModulos, handleClose, handleClick, refetchListaFaturas });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                codigoAutorizacao: codAutorizacao,
                valorAtual: valorFatura,
            }

            await schema.validate(dadosParaValidar, { abortEarly: false });
            
            onSubmit();
        } catch (validationError) {
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

            <form onSubmit={handleSubmit(handleValidatedSubmit)} >

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="empresaFatura"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Empresa "}
                                        name="empresaFatura"
                                        type="text"
                                        value={usuarioLogado?.NOFANTASIA}
                                        readOnly={true}
                                        onChange={(e) => setEmpresa(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="numero"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Caixa - Cód. Autorização da Fatura"}
                                        name="numero"
                                        type="text"
                                        value={numeroMovimento}
                                        readOnly={true}
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


                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="codigoAutorizacao"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Código Autorização"}
                                        name="codigoAutorizacao"
                                        type="text"
                                        value={codAutorizacao}
                                        onChange={(e) => setCodAutorizacao(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="valorAntigo"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Valor Antigo da Fatura"}
                                        name="valorAntigo"
                                        type="text"
                                        value={valorFaturaAntigo}
                                        onChange={(e) => setValorFaturaAntigo(e.target.value)}
                                        readOnly={true}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <Controller
                                name="valorAtual"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Valor Atual da Fatura"}
                                        name="valorAtual"
                                        type="text"
                                        value={valorFatura}
                                        onChange={(e) => {
                                            const formattedValue = e.target.value
                                                .replace(/\D/g, '')
                                                .replace(/(\d)(\d{2})$/, '$1,$2')
                                                .replace(/(?=(\d{3})+(\D))\B/g, '.');
                                            e.target.value = formattedValue;
                                            setValorFatura(e.target.value)
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>


            </form>
            <FooterModal
                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Confirmar Alteração"}
                onClickButtonConfirmar={handleSubmit(handleValidatedSubmit)}
                corConfirmar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}