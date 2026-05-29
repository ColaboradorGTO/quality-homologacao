import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { Controller, useForm } from 'react-hook-form';
import { AlertError } from "../../../../Inputs/alertError"
import { mascaraCPF } from "../../../../../utils/formatCPF"
import FormField from "../../../../Formularios/FormField"
import { GrFormView, GrFormViewHide } from "react-icons/gr"
import { optionsIcms } from "../../../../../../parceiro.json";
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { useGerarGnre } from "../hooks/useGerarGnre"
import { schema } from "./schema"

export const Formulario = ({
  dadosDetalhesVendas,
  handleClose,
  usuarioLogado,
  optionsModulos
}) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });

  const {
    cnpjEmitente,
    nomeEmitente,
    municipioEmitente,
    numeroMunicipioEmitente,
    estadoEmitente,
    cepEmitente,
    cnpjDestinatario,
    nomeDestinatario,
    municipioDestinatario,
    numeroMunicipioDestinatario,
    estadoDestinatario,
    valorProduto,
    produto,
    valorTotal,
    icms,
    setIcms,
    onSubmit,
  } = useGerarGnre({ dadosDetalhesVendas, usuarioLogado, optionsModulos })

  console.log('dadosDetalhesVendas', dadosDetalhesVendas);

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        icmsSelecionado: icms,
      }
      await schema.validate(dadosParaValidar, { abortEarly: false });
      onSubmit();
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
      <form className="modal-form" onSubmit={handleSubmit(handleValidatedSubmit)}>
        
        <div className="flex-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', alignContent: 'center' }}>Dados Emitente</h2>
        </div>
        <hr style={{border: '1px solid', color: '#cccccc3b' }} />

        <div className="form-group">


          <div className="row">

            <div className="col-sm-6 col-md-4 col-xl-4">
              <InputFieldModal
                type="text"
                className="form-control input"
                readOnly={true}
                label="CNPJ/CPF"
                value={cnpjEmitente}
                onChangeModal

              />
            </div>
            <div className="col-sm-6 col-md-4 col-xl-4">

              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="nome"
                    label={"Nome Emitente"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={nomeEmitente}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="salarioFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="salarioFuncionario"
                    label={"Município"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={municipioEmitente}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>
          </div>
        </div>


        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="salarioFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="salarioFuncionario"
                    label={"Município Emitente"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={numeroMunicipioEmitente}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="valorDescontoFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="valorDescontoFuncionario"
                    label={"Estado"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={estadoEmitente}
                    readOnly={true}
                    onChangeModal
                  />
                )}
              />
            </div>
            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="valorDescontoFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="valorDescontoFuncionario"
                    label={"CEP"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={cepEmitente}
                    readOnly={true}
                    onChangeModal
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', alignContent: 'center' }}>Dados Destinatário</h2>
        </div>
        <hr style={{border: '1px solid', color: '#cccccc3b' }} />
        <div className="form-group">


          <div className="row">

            <div className="col-sm-6 col-md-4 col-xl-4">
              <InputFieldModal
                type="text"
                className="form-control input"
                readOnly={true}
                label="CNPJ/CPF"
                value={cnpjDestinatario}
                onChangeModal

              />
            </div>
            <div className="col-sm-6 col-md-4 col-xl-4">

              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="nome"
                    label={"Nome Destinatário"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={nomeDestinatario}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="salarioFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="salarioFuncionario"
                    label={"Município"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={municipioDestinatario}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="salarioFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="salarioFuncionario"
                    label={"Município Destinatário"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={numeroMunicipioDestinatario}
                    onChangeModal
                    readOnly={true}
                  />
                )}
              />
            </div>

            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="valorDescontoFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="valorDescontoFuncionario"
                    label={"Estado"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={estadoDestinatario}
                    readOnly={true}
                    onChangeModal
                  />
                )}
              />
            </div>
            <div className="col-sm-3 col-md-4 col-xl-4">
              <Controller
                name="valorDescontoFuncionario"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="valorDescontoFuncionario"
                    label={"Vr. Produto"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={formatMoeda(valorProduto)}
                    readOnly={true}
                    onChangeModal
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="row">

          <div className="col-sm-6 col-md-4 col-xl-4">
            <label className="form-label" htmlFor="empresaFuncionario">Selecione ICMS </label>

            <Select
              closeMenuOnSelect={false}
              options={optionsIcms?.map((item) => ({
                value: item.value,
                label: item.label
              }))}
              value={icms}
              onChange={(e) => setIcms(e)}
            />
            {errors.empresaFuncionario && (
              <AlertError
                error={errors.empresaFuncionario}
                onClose={clearErrors}
                fieldName="empresaFuncionario"
              />
            )}
          </div>
          <div className="col-sm-3 col-md-4 col-xl-4">
            <Controller
              name="valorDescontoFuncionario"
              control={control}
              render={({ field }) => (
                <FormField
                  name="valorDescontoFuncionario"
                  label={"Vr. Total"}
                  type="text"
                  errors={errors}
                  clearErrors={clearErrors}
                  value={formatMoeda(valorTotal)}
                  readOnly={true}
                  onChangeModal
                />
              )}
            />
          </div>
          <div className="col-sm-3 col-md-4 col-xl-4">
            <Controller
              name="valorDescontoFuncionario"
              control={control}
              render={({ field }) => (
                <FormField
                  name="valorDescontoFuncionario"
                  label={"Produto"}
                  type="text"
                  errors={errors}
                  clearErrors={clearErrors}
                  value={produto}
                  readOnly={true}
                  onChangeModal
                />
              )}
            />
          </div>
        </div>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Atualizar"}
          onClickButtonConfirmar={handleValidatedSubmit}
          corConfirmar="success"

        />
      </form>
    </Fragment>
  )
}