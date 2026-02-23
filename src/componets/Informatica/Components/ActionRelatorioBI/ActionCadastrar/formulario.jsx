import React, { Fragment, useEffect, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schamaValidarRelatorioBI";
import { useCadastrarRelatorioBi } from "../hooks/useCadastrarRelatorioBi";


export const FormularioCadastro = ({ handleClose, refetch, optionsModulos, usuarioLogado }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
        mode: "onChange"
    });
    const {
        statusSelecionado,
        descricao,

        setStatusSelecionado,
        setDescricao,
        setUsuarioLogado,
        optionsStatus,
        onSubmit
    } = useCadastrarRelatorioBi({ handleClose, refetch, optionsModulos, usuarioLogado });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoRelatorio: descricao,
                statusRelatorio: statusSelecionado,
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
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="row">
                    <div className="col-sm-6 ">
                        <Controller
                            name="descricaoRelatorio"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    name="descricaoRelatorio"
                                    label={"Descrição"}
                                    type="text"
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-6 ">
                        <label className="form-label" htmlFor={""}>Status</label>
                        <Select
                            closeMenuOnSelect={false}
                            options={optionsStatus.map((item) => ({
                                value: item.value,
                                label: item.label
                            }))}
                            value={optionsStatus.find((obj) => obj.value === statusSelecionado)}
                            onChange={(selectedOption) => setStatusSelecionado(selectedOption.value)}
                        />
                        {errors.statusRelatorio && (
                            <AlertError
                                error={errors.statusRelatorio?.value || errors.statusRelatorio}
                                onClose={clearErrors}
                                fieldName="tipoFuncionario"
                            />
                        )}
                    </div>
                </div>
            </form>

            <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"

                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Confirmar"}
                onClickButtonConfirmar={handleValidatedSubmit}
                corConfirmar="success"
            />

        </Fragment>
    );
}