import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm, Controller } from "react-hook-form"
import Select from 'react-select'
import { useEditarFatura } from "../hooks/useEditarFatura"
import FormField from "../../../../Formularios/FormField"
import { schema } from "./useSchemaFatura"
import { AlertError } from "../../../../Inputs/alertError"
import { formatarMoeda } from "../../../../../utils/formatMoeda"

export const FormularioEditarFatura = ({ dadosDetalheFaturaCaixa, handleClose, optionsModulos, usuarioLogado }) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });

  const {
    valorFatura,
    caixa,
    empresaSelecionada,
    codAutorizacao,
    codPix,
    statusSelecionado,
    stPixSelecionado,
    OptionsStatus,
    OptionsPIX,
    onSubmit,
    setCodAutorizacao,
    setCodPix,
    setStatusSelecionado,
    setStPixSelecionado,
    setValorFatura,
    setEmpresaSelecionada,
    setCaixa
  } = useEditarFatura({ dadosDetalheFaturaCaixa, optionsModulos, handleClose, usuarioLogado });

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        codigoAutorizacao: codAutorizacao,
        codigoPIX: codPix,
        vrFatura: valorFatura
      }
  
      await schema.validate(dadosParaValidar, { abortEarly: false });

      await onSubmit();
      await handleClose();
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
    <form onSubmit={handleSubmit(handleValidatedSubmit)}>

      <div class="form-group">
        <div class="row">
          <div class="col-sm-6 col-xl-6">
            <Controller
              name="empresa"
              control={control}
              render={({ field }) => (
                <FormField
                  label={"Empresa"}
                  name="empresa"
                  type="text"
                  value={empresaSelecionada}
                  onChange={(e) => setEmpresaSelecionada(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={true}  
                />
              )}
            />
          </div>
          <div class="col-sm-6 col-xl-6">

            <Controller
              name="caixaAutorizacao"
              control={control}
              render={({ field }) => (
                <FormField
                  label={"Caixa - Código Autorização da Fatura"}
                  name="caixaAutorizacao"
                  type="text"
                  value={caixa}
                  onChange={(e) => setCaixa(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={true}  
                />
              )}
            />
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="row">

          <div class="col-sm-6 col-xl-3">
            <Controller
              name="codigoAutorizacao"
              control={control}
              render={({ field }) => (
                <FormField
                  label={"Código Autorização"}
                  name="codigoAutorizacao"
                  type="text"
                  value={codAutorizacao}
                  onChange={(e) => setCodAutorizacao(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                    
                />
              )}
            />
          </div>
          <div class="col-sm-6 col-xl-4">

            <Controller
              name="codigoPIX"
              control={control}
              render={({ field }) => (
                <FormField
                  label={"Código PIX"}
                  name="codigoPIX"
                  type="text"
                  value={codPix}
                  onChange={(e) => setCodPix(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                    
                />
              )}
            />
          </div>

          <div class="col-sm-6 col-xl-2">
            <label htmlFor="">PIX</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={stPixSelecionado}
              options={OptionsPIX}
              onChange={(e) => setStPixSelecionado(e.value)}
            />

            {errors.stPixSelecionado && (
              <AlertError
                error={errors.stPixSelecionado}
                onClose={clearErrors}
                fieldName="stPixSelecionado"
              />
            )}
          </div>
          <div class="col-sm-6 col-xl-3">
            <label htmlFor="">Status</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={statusSelecionado}
              options={OptionsStatus}
              onChange={(e) => setStatusSelecionado(e.value)}
            />
             {errors.statusSelecionado && (
              <AlertError
                error={errors.statusSelecionado}
                onClose={clearErrors}
                fieldName="statusSelecionado"
              />
            )}
          </div>
        </div>
      </div>

      <div class="form-group">
        <div className="row">
          <div class="col-sm-6">
            <Controller
              name="vrFatura"
              control={control}
              render={({ field }) => (
                <FormField
                  label={"Valor da Fatura"}
                  name="vrFatura"
                  type="text"
                  value={valorFatura}
                  onChange={(e) => setValorFatura(formatarMoeda(e.target.value))}
                  errors={errors}
                  clearErrors={clearErrors}
                    
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
        onClickButtonCadastrar={handleValidatedSubmit}
        textButtonCadastrar={"Confimar Alteração"}
        corCadastrar={"success"}
        loadingTextCadastrar={"Cadastrando..."}
        autoLoadingCadastrar={true}
      />
    </form>
  )
}