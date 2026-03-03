import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { useCriarTipoTecido } from "../hooks/useCriarTipoTecidos"
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schemaValidarTecido";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { situacao } from "../../../../../../parceiro.json" 

export const FormularioCriarTecido = ({ show, handleClose, usuarioLogado, optionsModulos }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        onSubmit,
    } = useCriarTipoTecido({ handleClose, usuarioLogado, optionsModulos });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoTecido: descricao,
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
                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="descricaoTecido"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoTecido"
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

                        <div className="col-sm-6 col-xl-6">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="situacaoTecido"
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
                                onChange={(e) => {
                                    setStatusSelecionado(e)
                                    clearErrors("situacaoTecido")
                                }}
                            />
                            {errors.situacaoTecido && (
                                <AlertError
                                    error={errors.situacaoTecido}
                                    onClose={clearErrors}
                                    fieldName="situacaoTecido"
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