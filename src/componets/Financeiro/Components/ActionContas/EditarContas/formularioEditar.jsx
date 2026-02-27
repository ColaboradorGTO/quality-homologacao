import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select'
import { useEditarConta } from "../hooks/useEditarBanco"
import FormField from "../../../../Formularios/FormField";
import { Fragment } from "react";
import { schema } from "./schema/useEditarSchema";

export const FormularioEditar = ({
  dadosDetalheContaBanco,
  handleClose,
  optionsModulos,
  usuarioLogado,
  dadosBanco,
  handleClick
}) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });
  const {
    bancoSelecionado,
    setBancoSelecionado,
    tipoPessoaSelecionada,
    setTipoPessoaSelecionada,
    tipoContaSelecionada,
    setTipoContaSelecionada,
    numeroAgencia,
    setNumeroAgencia,
    digitoAgencia,
    setDigitoAgencia,
    numeroConta,
    setNumeroConta,
    digitoConta,
    setDigitoConta,
    numeroContaSap,
    setNumeroContaSap,
    descricaoConta,
    setDescricaoConta,
    statusSelecionado,
    setStatusSelecionado,
    OptionsStatus,
    OptionsTipoPessoa,
    OptionsTipoConta,
    onSubmit
  } = useEditarConta({ dadosDetalheContaBanco, optionsModulos, usuarioLogado, handleClick, handleClose });

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        nAgencia: numeroAgencia,
        dAgencia: digitoAgencia,
        nConta: numeroConta,
        dConta: digitoConta,
        nContaSap: numeroContaSap,
        dsConta: descricaoConta
      }

      await schema.validate(dadosParaValidar, { abortEarly: false });

      onSubmit();

    } catch (validationError) {
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
            <div className="col-sm-6 col-xl-5">
              <label className="form-label" htmlFor="">Bancos</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={bancoSelecionado}
                options={dadosBanco.map((item) => ({
                  value: item.IDBANCO,
                  label: item.DSBANCO,
                }))}
                onChange={(e) => setBancoSelecionado(e)}
              />

            </div>
            <div className="col-sm-6 col-xl-3">
              <label className="form-label" htmlFor="">Tipo Pessoa</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={tipoPessoaSelecionada}
                options={OptionsTipoPessoa}
                onChange={(e) => setTipoPessoaSelecionada(e)}
              />

            </div>
            <div className="col-sm-6 col-xl-4">
              <label className="form-label" htmlFor="">Tipo Conta</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={tipoContaSelecionada}
                options={OptionsTipoConta}
                onChange={(e) => setTipoContaSelecionada(e)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">

          <div class="row">
            <div class="col-sm-6 col-xl-3">
              <Controller
                name="nAgencia"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Nº Agência *"}
                    name="nAgencia"
                    type="text"
                    value={numeroAgencia}
                    onChange={(e) => setNumeroAgencia(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />

                )}
              />
            </div>
            <div class="col-sm-6 col-xl-3">
              <Controller
                name="dAgencia"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Nº Digito Agência *"}
                    name="dAgencia"
                    type="text"
                    value={digitoAgencia}
                    onChange={(e) => setDigitoAgencia(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
            <div class="col-sm-6 col-xl-3">
              <Controller
                name="nConta"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Nº Conta *"}
                    name="nConta"
                    type="text"
                    value={numeroConta}
                    onChange={(e) => setNumeroConta(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
            <div class="col-sm-6 col-xl-3">
              <Controller
                name="dConta"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Nº Digito Conta *"}
                    name="dConta"
                    type="text"
                    value={digitoConta}
                    onChange={(e) => setDigitoConta(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="form-group">

          <div className="row">
            <div className="col-sm-6 col-xl-3">
              <Controller
                name="nContaSap"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Nº Conta SAP *"}
                    name="nContaSap"
                    type="text"
                    value={numeroContaSap}
                    onChange={(e) => setNumeroContaSap(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-6">
              <Controller
                name="dsConta"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Descrição da Conta *"}
                    name="dsConta"
                    type="text"
                    value={descricaoConta}
                    onChange={(e) => setDescricaoConta(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <label className="form-label" htmlFor="">Status Conta</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={statusSelecionado}
                options={OptionsStatus}
                onChange={(e) => setStatusSelecionado(e)}
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
          // onClickButtonCadastrar={onSubmit}
          tipoBtnCadastrar={"submit"}
          textButtonCadastrar={"Editar"}
          corCadastrar={"success"}
          loadingTextCadastrar={"Cadastrando..."}
          autoLoadingCadastrar={true}
        />
      </form>
    </Fragment>
  )
}