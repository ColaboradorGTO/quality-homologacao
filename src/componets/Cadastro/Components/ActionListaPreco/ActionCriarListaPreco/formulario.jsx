import React, { Fragment } from "react";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schema/schemaValidation";
import { ActionCriarListasPrecos } from "./actionCriarListasPreco"
import { useCriarListaPrecos } from "../hooks/useCriarListaPrecos";

export const Formulario = ({handleClose, optionsModulos, usuarioLogado}) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });
  const {
    statusSelecionado,
    setStatusSelecionado,
    empresaSelecionada,
    setEmpresaSelecionada,
    nomeListaPreco,
    setNomeListaPreco,
    dataCriacao,
    setDataCriacao,
    situacao,
    onSubmit,
  } = useCriarListaPrecos({ optionsModulos, usuarioLogado, handleClose })


  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        situacao: statusSelecionado,
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
            <div className="col-sm-6 col-xl-3">
              <Controller
                name="dtCreateListaPreco"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="dtCreateListaPreco"
                    label={"Data Criação *"}
                    type="date"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={dataCriacao}
                    onChangeModal={(e) => setDataCriacao(e.target.value)}
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-6 col-xl-3">
              <Controller
                name="idListaPreco"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="idListaPreco"
                    label={"Nº *"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={''}
                    readOnly={true}
                  
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <Controller
                name="nomeListaPreco"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="nomeListaPreco"
                    label={"Nome Lista Preço *"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={nomeListaPreco}
                    onChangeModal={(e) => setNomeListaPreco(e.target.value)}
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-3">

              <label htmlFor="">Situação *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="situacao"
                options={situacao?.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={(e) => {
                  setStatusSelecionado(e)
                  clearErrors('situacao')
                }}
              />
              {errors.situacao && (
                <AlertError
                  error={errors.situacao}
                  onClose={clearErrors}
                  fieldName="situacao"
                />
              )}
            </div>
          </div>

        </div>
        <ActionCriarListasPrecos
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          onClickButtonFechar={handleClose}
          textButtonFechar={"Fechar"}
          corFechar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
          textButtonCadastrar={"Criar Lista"}
          corCadastrar={"success"}
          loadingTextCadastrar={"Cadastrando..."}
          autoLoadingCadastrar={true}
        />

      </form>
    </Fragment>
  )
}