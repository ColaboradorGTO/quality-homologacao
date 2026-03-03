import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useCadastrarEstilos } from "../Hooks/useCadastrarEstilos"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { situacao } from "../../../../../../parceiro.json" 
import { schema } from "./schemaValidarEstilos";
import FormField from "../../../../Formularios/FormField"
import { AlertError } from "../../../../Inputs/alertError"

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosGrupoEstrutura,
        onSubmit,

    } = useCadastrarEstilos({handleClose, usuarioLogado, optionsModulos, handleClick})

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoEstilo: descricao,
                subGrupoEstilo: subGrupoSelecionado,
                situacaoEstilo: statusSelecionado,
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
                                name="descricaoEstilo"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoEstilo"
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

                            <label htmlFor="">Grupo Estrutura *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="subGrupoEstilo"
                                value={subGrupoSelecionado}
                                options={dadosGrupoEstrutura.map((item) => ({
                                        
                                    value: item.IDGRUPOESTRUTURA,
                                    label: `${item.CODGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`
                                        
                                }))}
                                onChange={(e) => { 
                                    setSubGrupoSelecionado(e)
                                    clearErrors("subGrupoEstilo")
                                }}
                            />
                           
                            {errors.subGrupoEstilo && (
                                <AlertError
                                    error={errors.subGrupoEstilo}
                                    onClose={clearErrors}
                                    fieldName="subGrupoEstilo"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="situacaoEstilo"
                                value={statusSelecionado}
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(selected) => { 
                                    setStatusSelecionado(selected)
                                    clearErrors("situacaoEstilo")
                                }}
                            />
                           
                            {errors.situacaoEstilo && (
                                <AlertError
                                    error={errors.situacaoEstilo}
                                    onClose={clearErrors}
                                    fieldName="situacaoEstilo"
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