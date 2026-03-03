import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { useCadastroCores } from "../hooks/useCadastroCores";
import { Controller, useForm } from "react-hook-form";
import { situacao } from "../../../../../../parceiro.json" 
import { schema } from "./schemaValidarCores"
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";


export const FormularioCadastro = ({
    handleClose,
    usuarioLogado,
    refetchListaCores,
    optionsModulos
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        grupoCorSelecionado,
        setGrupoCorSelecionado,
        dadosGrupoCores,
        onSubmit
    } = useCadastroCores({handleClose, usuarioLogado, refetchListaCores, optionsModulos})
    
    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoCores: descricao,
                grupoCores: grupoCorSelecionado,
                situacaoCores: statusSelecionado,
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
                                name="descricaoCores"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoCores"
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

                            <label htmlFor="">Grupo Cor *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="grupoCores"
                                options={dadosGrupoCores.map((item) => {
                                    return {
                                        value: item.IDGRUPOCOR,
                                        label: item.DSGRUPOCOR
                                    }
                                })}
                                value={grupoCorSelecionado}
                                onChange={(e) =>  { 
                                    setGrupoCorSelecionado(e)
                                    clearErrors('grupoCores')
                                }}
                            />
                            {errors.grupoCores && (
                                <AlertError
                                    error={errors.grupoCores}
                                    onClose={clearErrors}
                                    fieldName="grupoCores"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="situacaoCores"
                                defaultValue={statusSelecionado}
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => {
                                    setStatusSelecionado(e)
                                    clearErrors('situacaoCores')
                                }}
                            />
                            {errors.situacaoCores && (
                                <AlertError
                                    error={errors.situacaoCores}
                                    onClose={clearErrors}
                                    fieldName="situacaoCores"
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