import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useCadastrarEstruturaMercadologica } from "../hooks/useCadastrarEstruturaMercadologica"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField"
import { AlertError } from "../../../../Inputs/alertError"
import { situacao } from "../../../../../../parceiro.json" 

export const FormularioCadastro = ({  handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosGrupoEstrutura,
        onSubmit
    } = useCadastrarEstruturaMercadologica({handleClose, usuarioLogado, optionsModulos, handleClick })
 
    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoSubGrupo: descricao,
                siglaSubGrupo: sigla,
                situacaoSubGrupo: statusSelecionado,
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
                                name="descricaoSubGrupo"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoSubGrupo"
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
                                name="subGrupo"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosGrupoEstrutura.map((item) => {
                                        return {
                                            value: item.IDGRUPOESTRUTURA,
                                            label: `${item.CODGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`
                                        }
                                    })]}
                                value={subGrupoSelecionado}
                                onChange={(e) => {
                                    setSubGrupoSelecionado(e)
                                    clearErrors('subGrupo')
                                }}
                            />
                            {errors.subGrupo && (
                                <AlertError
                                    error={errors.subGrupo}
                                    onClose={clearErrors}
                                    fieldName="subGrupo"
                                />
                            )}

                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="situacaoSubGrupo"
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
                                onChange={(e) => setStatusSelecionado(e)}
                            />
                            {errors.situacaoSubGrupo && (
                                <AlertError
                                    error={errors.situacaoSubGrupo}
                                    onClose={clearErrors}
                                    fieldName="situacaoSubGrupo"
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