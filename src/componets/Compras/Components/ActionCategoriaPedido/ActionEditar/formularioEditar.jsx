import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { useEditarCategoriaPedido } from "../hooks/useEditarCategoriaPedido"
import FormField from "../../../../Formularios/FormField"
import { AlertError } from "../../../../Inputs/alertError"
import { schema } from "./schemaValidarPedido";
import { Controller, useForm } from "react-hook-form";

export const FormularioEditar = ({
    handleClose, 
    dadosDetalheCategoriaPedido,
    usuarioLogado,
    optionsModulos,
    handleClick 
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        situacao,
        optionsTipoCategoria,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        tipoCategoriaSelecionado,
        setTipoCategoriaSelecionado,
        onSubmit
    } = useEditarCategoriaPedido({dadosDetalheCategoriaPedido, handleClose, usuarioLogado, optionsModulos, handleClick});
    
    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoPedido: descricao,
                tipoCategoria: tipoCategoriaSelecionado,
                situacaoPedido: statusSelecionado,
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

                        <div className="col-sm-6 col-lg-6">
                            <Controller
                                name="descricaoPedido"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descricaoPedido"
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
                        <div className="col-sm-6 col-lg-6">

                            <label htmlFor="">Tipo Categoria *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoCategoria"
                                options={optionsTipoCategoria.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={tipoCategoriaSelecionado}
                                onChange={(e) => { 
                                    setTipoCategoriaSelecionado(e)
                                    clearErrors('tipoCategoria')
                                }}
                            />
                            
                            {errors.tipoCategoria && (
                                <AlertError
                                    error={errors.tipoCategoria}
                                    onClose={clearErrors}
                                    fieldName="tipoCategoria"
                                />
                            )}
                        </div>

                    </div>
                </div>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">

                            <label htmlFor="">Situação *</label>
                            <Select
                               className="basic-single"
                                classNamePrefix="select"
                                name="situacaoPedido"
                                options={situacao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
                                onChange={(e) => {
                                    setStatusSelecionado(e)
                                    clearErrors('situacaoPedido')
                                }}
                            />
                            {errors.situacaoPedido && (
                                <AlertError
                                    error={errors.situacaoPedido}
                                    onClose={clearErrors}
                                    fieldName="situacaoPedido"
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