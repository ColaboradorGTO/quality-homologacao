import React, { Fragment } from "react"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { useAtualizaCaixa } from "../hooks/useAtualizaCaixa";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { schema } from "./schemaCreateCaixa";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";

export const FormularioEditar = ({ show, handleClose, dadosListaCaixa, refetchListaCaixa, usuarioLogado }) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });
  const {
    empresa,
    setEmpresa,
    dsCaixa,
    setDSCaixa,
    tipoEmissao,
    setTipoEmissao,
    modeloImpressora,
    setModeloImpressora,
    portaComunicacao,
    setPortaComunicacao,
    numeroSerieProducao,
    setNumeroSerieProducao,
    numeroUltimaNFCeProducao,
    setNumeroUltimaNFCeProducao,
    tef,
    setTef,
    statusSelecionado,
    setStatusSelecionado,
    statusLimpar,
    setStatusLimpar,
    dataAlteracao,
    setDataAlteracao,
    atualizacaoDiario,
    optionsNota,
    optionsImpressoras,
    onSubmit
  } = useAtualizaCaixa({ dadosListaCaixa, handleClose, refetchListaCaixa, usuarioLogado });

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        nomeCaixa: dsCaixa,
        tipoDeEmissao: tipoEmissao,
        modeloDeImpressora: modeloImpressora,
        portaDeComunicacao: portaComunicacao,
        numeroDeSerieProducao: numeroSerieProducao,
        numeroDeUltimaNFCeProducao: numeroUltimaNFCeProducao,
        tefSchema: tef,
        statusAtualizarSchema: statusSelecionado,
        statusLimparSchema: statusLimpar
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

        <div className="form-group">

          <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-6">

              <InputFieldModal
                type="text"
                className="form-control input"
                label="Empresa"
                readOnly={true}
                value={empresa}
                onChangeModal={(e) => setEmpresa(e.target.value)}
              />
            </div>
            <div className="col-sm-6 col-md-6 col-xl-6">

              <Controller
                name="nomeCaixa"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="nomeCaixa"
                    label={"Nº - Descrição do Caixa"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={dsCaixa}
                    onChangeModal={(e) => setDSCaixa(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-12 col-xl-12">
              <div className="alert alert-primary" role="alert"><strong>Controles Fiscais</strong></div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-3">
              <label className="form-label" htmlFor="tipemissao">Tipo de Emissão da Nota</label>

              <Select
                closeMenuOnSelect={false}
                options={optionsNota.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  };
                })}
                value={optionsNota.find(option => option.value === tipoEmissao)}
                onChange={(selectedOption) => setTipoEmissao(selectedOption?.value)}
              />
              {errors.tipoDeEmissao && (
                <AlertError
                  error={errors.tipoDeEmissao?.value || errors.tipoDeEmissao}
                  onClose={clearErrors}
                  fieldName="tipoDeEmissao"
                />
              )}
            </div>
            <div className="col-sm-6 col-md-4 col-xl-4">
              <label className="form-label" htmlFor="modimpressao">Modelos de Impressoras</label>

              <Select
                closeMenuOnSelect={false}
                options={optionsImpressoras.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  };
                })}
                value={optionsImpressoras.find(option => option.value === modeloImpressora)}
                onChange={(selectedOption) => setModeloImpressora(selectedOption?.value)}
              />
              {errors.modeloDeImpressora && (
                <AlertError
                  error={errors.modeloDeImpressora?.value || errors.modeloDeImpressora}
                  onClose={clearErrors}
                  fieldName="modeloDeImpressora"
                />
              )}
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">

              <Controller
                name="portaDeComunicacao"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="portaDeComunicacao"
                    label={"Porta Comunicação"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={portaComunicacao}
                    onChangeModal={(e) => setPortaComunicacao(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-3">

              <Controller
                name="numeroDeSerieProducao"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="numeroDeSerieProducao"
                    label={"Nº Série Produção"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={numeroSerieProducao}
                    onChangeModal={(e) => setNumeroSerieProducao(e.target.value)}
                  />
                )}
              />


            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">

              <Controller
                name="numeroDeUltimaNFCeProducao"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="numeroDeUltimaNFCeProducao"
                    label={"Nº Última NFCe Produção"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={numeroUltimaNFCeProducao}
                    onChangeModal={(e) => setNumeroUltimaNFCeProducao(e.target.value)}
                  />
                )}
              />

            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <label className="form-label" htmlFor="sttef">TEF</label>

              <Select
                closeMenuOnSelect={false}
                options={atualizacaoDiario.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  };
                })}
                value={atualizacaoDiario.find(option => option.value === tef)}
                onChange={(selectedOption) => setTef(selectedOption?.value)}
              />
              {errors.tefSchema && (
                <AlertError
                  error={errors.tefSchema?.value || errors.tefSchema}
                  onClose={clearErrors}
                  fieldName="tefSchema"
                />
              )}
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <label className="form-label" htmlFor="statualiza">Atualizar</label>
              <Select
                closeMenuOnSelect={false}
                options={atualizacaoDiario.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  };
                })}
                value={atualizacaoDiario.find(option => option.value === statusSelecionado)}
                onChange={(selectedOption) => setStatusSelecionado(selectedOption?.value)}
              />
              {errors.statusAtualizarSchema && (
                <AlertError
                  error={errors.statusAtualizarSchema?.value || errors.statusAtualizarSchema}
                  onClose={clearErrors}
                  fieldName="statusAtualizarSchema"
                />
              )}
            </div>
            <div className="col-sm-6 col-md-2 col-xl-2">
              <label className="form-label" htmlFor="stlimpa">Limpar</label>

              <Select
                closeMenuOnSelect={false}
                options={atualizacaoDiario.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  };
                })}
                value={atualizacaoDiario.find(option => option.value === statusLimpar)}
                onChange={(selectedOption) => setStatusLimpar(selectedOption?.value)}
              />
              {errors.statusLimparSchema && (
                <AlertError
                  error={errors.statusLimparSchema?.value || errors.statusLimparSchema}
                  onClose={clearErrors}
                  fieldName="statusLimparSchema"
                />
              )}
            </div>
          </div>
        </div>

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
      </form>
    </Fragment>
  )
}                      