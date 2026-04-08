import { useEffect, useState } from "react";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { toFloat } from "../../../../../utils/toFloat";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { useEditarAlteracaoPreco } from "../hooks/useEditarAlteracaoPreco";

export const Formulario = ({
    handleClose,
    dadosVisualizarDetalhe,
    optionsModulos,
    usuarioLogado
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        statusSelecionado,
        setStatusSelecionado,
        stAlteracaoImediato,
        setStAlteracaoImediato,
        authEdit,
        dataCriacao,
        setDataCriacao,
        dataAlteracao,
        setDataAlteracao,
        qtdProdutos,
        setQtdProdutos,
        funcionario,
        setFuncionario,
        disabled,
        setDisabled,
        onSubmit
    } = useEditarAlteracaoPreco({
        handleClose,
        dadosVisualizarDetalhe,
        optionsModulos,
        usuarioLogado
    })


    const optionsStatus = [
        { value: 'True', label: 'CANCELADA' },
        { value: 'False', label: 'EM ESPERA' },
        { value: 'FINALIZADA', label: 'FINALIZADA' }
    ]

    return (
        <form action="">
            <div className="form-group">
                <div className="row">
                    <div className="col-sm-3 col-xl-3">
                        <Controller
                            name="dtCreateListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data Criação *"}
                                    name="dtCreateListaPreco"
                                    type="datetime"
                                    value={dataCriacao}
                                    onChange={(e) => setDataCriacao(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-3 col-xl-3">
                        <Controller
                            name="dtAlterListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data Alteração *"}
                                    name="dtAlterListaPreco"
                                    type="datetime-local"
                                    value={dataAlteracao}
                                    onChange={(e) => setDataAlteracao(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                    </div>

                    <div className="col-sm-3 col-xl-3">

                        <label htmlFor="">Status Alteração *</label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="statusAlteracao"
                            value={statusSelecionado}
                            options={optionsStatus}
                            onChange={(selectedOption) => { 
                                setStatusSelecionado(selectedOption)
                                clearErrors("statusAlteracao");
                            }}
                            isDisabled={disabled} 
                        />
                        {errors.statusAlteracao && (
                            <AlertError
                                error={errors.statusAlteracao}
                                onClose={clearErrors}
                                fieldName="statusAlteracao"
                            />
                        )}
                    </div>
                    <div className="col-sm-3 col-xl-2">
                        <Controller
                            name="idListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Alteração *"}
                                    name="idListaPreco"
                                    type="text"
                                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                                    onChange
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-2 col-xl-3">
                        <Controller
                            name="idListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Lista Alvo de Alteração *"}
                                    name="nomeListaPreco"
                                    type="text"
                                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOMELISTA || dadosVisualizarDetalhe[0]?.alteracaoPreco.NOEMPRESA}
                                    onChange
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>

                    <div className="col-sm-3 col-xl-2">
                        <Controller
                            name="qtdListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Qtd. Produtos *"}
                                    name="qtdListaPreco"
                                    type="text"
                                    value={qtdProdutos}
                                    onChange={(e) => setQtdProdutos(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                    style={{textAlign: 'center'}}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">
                        <Controller
                            name="responsavelListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Responsável *"}
                                    name="responsavelListaPreco"
                                    type="text"
                                    value={funcionario}
                                    onChange={(e) => setFuncionario(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />
                            )}
                        />
                    </div>

                </div>

            </div>


            <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                onClickButtonFechar={handleClose}
                textButtonFechar={"Fechar"}
                corFechar={"secondary"}

                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar
                textButtonCadastrar={"Salvar"}
                corCadastrar={"success"}
                loadingTextCadastrar={"Cadastrando..."}
                autoLoadingCadastrar={true}
            />

        </form>
    )
}