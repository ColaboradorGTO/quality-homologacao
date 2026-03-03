import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { useEditarUnidadeMedida } from "../hooks/useEditarUnidadeMedida"
import { AlertError } from "../../../../Inputs/alertError"
import FormField from "../../../../Formularios/FormField"
import { situacao } from "../../../../../../parceiro.json" 
import { schema } from "./schemaValidarUnidadeMedida";

export const FormularioEditar = ({
    dadosDetalheUnidadeMedida, 
    handleClose,  
    usuarioLogado,
    optionsModulos,
    handleClick  
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        descricao,
        setDescricao,
        sigla,
        setSigla,
        statusSelecionado,
        setStatusSelecionado,
        onSubmit
        
    } = useEditarUnidadeMedida({dadosDetalheUnidadeMedida, handleClose, usuarioLogado, optionsModulos, handleClick});
    
        const handleValidatedSubmit = async () => {
            try {
                const dadosParaValidar = {
                    descricaoUnidadeMedida: descricao,
                    siglaUnidadeMedida: sigla,
                    situacaoUnidadeMedida: statusSelecionado,
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
                                name="descricaoUnidadeMedida"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoUnidadeMedida"
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
                        <div className="col-sm-6 col-xl-3">
                            <Controller
                                name="siglaUnidadeMedida"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="siglaUnidadeMedida"
                                        label={"Sigla *"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={sigla}
                                        onChangeModal={(e) => setSigla(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="situacaoUnidadeMedida"
                                value={statusSelecionado}
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => {
                                    setStatusSelecionado(e)
                                    clearErrors("situacaoUnidadeMedida")
                                }}
                            />
                            {errors.situacaoUnidadeMedida && (
                                <AlertError
                                    error={errors.situacaoUnidadeMedida}
                                    onClose={clearErrors}
                                    fieldName="situacaoUnidadeMedida"
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
                    loadingTextCadastrar={"Atualizando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}