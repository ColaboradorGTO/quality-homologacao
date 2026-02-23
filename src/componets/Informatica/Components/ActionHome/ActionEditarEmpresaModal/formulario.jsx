import React, { Fragment, useEffect, useState, useRef } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import Select from 'react-select';
import { useForm } from "react-hook-form";
import 'jspdf-autotable';
import { useEditarEmpresa } from "../hooks/useEditarEmpresa";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schema"

const Formulario = ({

    handleClose,
    dadosListaCaixa,
    globalFilterValue,
    setGlobalFilterValue,
    caixaListaAtualiza,
    setCaixaListaAtualiza,
    caixaListaLimpar,
    setCaixaListaLimpar,
    status,
    atualizacaoDiario,
    dadosAtualizaEmpresa,
    usuarioLogado,
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        selectedCaixa,
        setSelectedCaixa,
        selectedCaixaLimpar,
        setSelectedCaixaLimpar,
        statusAtualizado,
        setStatusAtualizado,
        atualizacao,
        setAtualizacao,
        horaAtualizado,
        setHoraAtualizado,
        empresa,
        setEmpresa,
        ipUsuario,
        setIpUsuario,

    } = useEditarEmpresa({
        dadosListaCaixa,
        globalFilterValue,
        setGlobalFilterValue,
        caixaListaAtualiza,
        setCaixaListaAtualiza,
        caixaListaLimpar,
        setCaixaListaLimpar,
        dadosAtualizaEmpresa,
        usuarioLogado,
        handleClose,
    });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                atualizarLoja: statusAtualizado,
                atualizarPDVs: atualizacao,
                horarioAtualizacao: horaAtualizado
            };

            await schema.validate(dadosParaValidar, { abortEarly: false });
            onSubmit(dadosParaValidar);
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
        <>
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                value={empresa}
                                onChangeModal={(e) => setEmpresa(e.target.value)}
                                label="Empresa"
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="statualizadiario">Atualizar Status Loja</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                options={status.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}

                                value={status.find(item => item.value === statusAtualizado)}
                                onChange={(e) => setStatusAtualizado(e.value)}
                            />
                            {errors.atualizarLoja && (
                                <AlertError
                                    error={errors.atualizarLoja?.value || errors.atualizarLoja}
                                    onClose={clearErrors}
                                    fieldName="atualizarLoja"
                                />
                            )}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="statualizadiario">Atualizar PDVs Diário</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                option={atualizacaoDiario.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={atualizacaoDiario.find(item => item.value === atualizacao)}
                                onChange={(e) => setAtualizacao(e.value)}
                            />
                            {errors.atualizarPDVs && (
                                <AlertError
                                    error={errors.atualizarPDVs?.value || errors.atualizarPDVs}
                                    onClose={clearErrors}
                                    fieldName="atualizarPDVs"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <InputFieldModal
                                type="time"
                                className="form-control input"
                                readOnly={false}
                                value={horaAtualizado}
                                onChangeModal={(e) => setHoraAtualizado(e.target.value)}
                                label="Horário"
                            />
                            {errors.horarioAtualizacao && (
                                <AlertError
                                    error={errors.horarioAtualizacao?.value || errors.horarioAtualizacao}
                                    onClose={clearErrors}
                                    fieldName="horarioAtualizacao"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                textButtonCadastrar={"Atualizar"}
                onClickButtonCadastrar={handleValidatedSubmit}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"

            />

        </>
    );
}

export default Formulario;