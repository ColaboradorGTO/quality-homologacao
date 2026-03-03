import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useCadastroCores } from "../hooks/useCadastroCores";
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schemaValidarCores"
import FormField from "../../../../Formularios/FormField";


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
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        grupoCorSelecionado,
        setGrupoCorSelecionado,
        dadosGrupoCores,
        cadastrarCores
    } = useCadastroCores({handleClose, usuarioLogado, refetchListaCores, optionsModulos})

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoCores: descricao,
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
                
            <form onSubmit={handleSubmit(cadastrarCores)}>

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
                                defaultValue={grupoCorSelecionado}
                                options={dadosGrupoCores.map((item) => {
                                    return {
                                        value: item.IDGRUPOCOR,
                                        label: item.DSGRUPOCOR
                                    }
                                })}
                                onChange={(e) => setGrupoCorSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select

                                defaultValue={statusSelecionado}
                                options={optionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setStatusSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <h3 className="form-label" style={{ color: 'red' }}>* Campos Obrigatórios *</h3>
                </div>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={cadastrarCores}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}