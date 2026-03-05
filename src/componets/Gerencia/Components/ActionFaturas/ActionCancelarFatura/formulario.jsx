import { Fragment, } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useCancelarFatura } from "../hooks/useCancelarFatura";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/useCancelarSchema";

export const Formulario = ({
    handleClick,
    handleClose,
    dadosCancelarFatura,
    usuarioLogado,
    optionsModulos,
    refetchListaFaturas
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        motivo,
        setMotivo,
        onSubmit

    } = useCancelarFatura({
        handleClick,
        handleClose,
        dadosCancelarFatura,
        usuarioLogado,
        optionsModulos,
        refetchListaFaturas
    })

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                motivoCancelamento: motivo,
            }

            await schema.validate(dadosParaValidar, { abortEarly: false });
            //console.log(dadosParaValidar, 'dadosParaValidar no submit com validação');
            await onSubmit();

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
                                name="codAutorizacao"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Caixa - Cód. Autorização da Fatura"}
                                        name="codAutorizacao"
                                        type="text"
                                        readOnly={true}
                                        value={`${dadosCancelarFatura[0]?.IDDETALHEFATURA} - ${dadosCancelarFatura[0]?.DSCAIXA} - ${dadosCancelarFatura[0]?.NUCODAUTORIZACAO}`}
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
                                name="motivoCancelamento"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Motivo do Cancelamento"}
                                        name="motivoCancelamento"
                                        type="text"
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
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
                    textButtonCadastrar={"Confirmar Cancelamento"}
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