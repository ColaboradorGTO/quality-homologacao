import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useCadastrarBonificaoca } from "../hooks/useCadastrarBonificacao"
import Select from 'react-select'
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schemaValidationBonificacao";
import { formatarMoeda } from "../../../../../utils/formatMoeda"
import FormField from "../../../../Formularios/FormField"
import { AlertError } from "../../../../Inputs/alertError"

export const FormularioCadastrar = ({
    handleClose,
    usuarioLogado,
    funcionario,
    setFuncionario,
    optionsModulos
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        valorBonificacao,
        setValorBonificacao,
        tipoSelecionado,
        txtHistorico,
        OptionsStatus,
        setTipoSelecionado,
        setTxtHistorico,
        onSubmit
    } = useCadastrarBonificaoca({ handleClose, usuarioLogado, optionsModulos, funcionario });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                valorBonificacaoFuncionario: valorBonificacao,
                historicoBonificacaoFuncionario: txtHistorico,
                tipoFuncionario: tipoSelecionado,
            };
            await schema.validate(dadosParaValidar, { abortEarly: false });
            await onSubmit(); // Executa o submit
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
                        <div className="col-sm-6 col-xl-12">
                            <Controller
                                name="nomeFuncionario"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="nomeFuncionario"
                                        label={"Nome do Funcionário"}
                                        type="text"
                                        readOnly={true}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={funcionario?.label}
                                        onChangeModal={e => setFuncionario(e.value)}
                                    />
                                )}
                            />

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <label htmlFor="">Tipo</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoFuncionario"
                                options={OptionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={tipoSelecionado}

                                onChange={(e) => {
                                    setTipoSelecionado(e)
                                    clearErrors("tipoFuncionario")
                                }}
                                isClearable={true}
                                isSearchable={true}
                            />
                            {errors.tipoFuncionario && (
                                <AlertError
                                    error={errors.tipoFuncionario}
                                    onClose={clearErrors}
                                    fieldName="tipoFuncionario"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="valorBonificacaoFuncionario"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="valorBonificacaoFuncionario"
                                        label={"Valor (R$)"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={valorBonificacao}
                                        onChangeModal={e => setValorBonificacao(formatarMoeda(e.target.value))}
                                    />
                                )}
                            />
                          
                        </div>
                    </div>
                </div>

                <div className="">
                    <Controller
                        name="historicoBonificacaoFuncionario"
                        control={control}
                        render={({ field }) => (
                            <FormField
                                name="historicoBonificacaoFuncionario"
                                label={"Histórico"}
                                type="text"
                                errors={errors}
                                clearErrors={clearErrors}
                                value={txtHistorico}
                                onChangeModal={e => setTxtHistorico(e.target.value)}
                            />
                        )}
                    />

                </div>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                    textButtonCadastrar={"Cadastrar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}