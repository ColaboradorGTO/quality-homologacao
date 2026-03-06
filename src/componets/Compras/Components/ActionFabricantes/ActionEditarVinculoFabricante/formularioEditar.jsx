import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { useEditarVinculoFornecedorFabricante } from "../hooks/useEditarViculoFornecedorFabricante";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/useEditarSchema";

export const FormularioEditar = ({
  handleClose,
  dadosDetalheFornecedorFabricante,
  dadosFornecedores,
  usuarioLogado,
  optionsModulos,
  handleClick
}) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });
  const {
    setFabricante,
    fabricante,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    situacao,
    statusSelecionado,
    setStatusSelecionado,
    onSubmit
  } = useEditarVinculoFornecedorFabricante({ handleClose, dadosDetalheFornecedorFabricante, dadosFornecedores, usuarioLogado, optionsModulos, handleClick })

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        fabricanteVinculo: fabricante,
        situacaoVinculo: statusSelecionado
      }

      await schema.validate(dadosParaValidar, { abortEarly: false });

      await onSubmit();

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
        <div className="form-group" style={{ marginBottom: '5rem' }}>
          <div className="row">

            <div className="col-sm-6 col-xl-4">
              <Controller
                name="fabricanteVinculo"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Fabricante *"}
                    name="fabricanteVinculo"
                    type="text"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    errors={errors}
                    clearErrors={clearErrors}
                    readOnly={true}
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-4">
              <label htmlFor="fornecedor">Nome Fabricante *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="fabricanteVinculo"
                value={fornecedorSelecionado}
                options={dadosFornecedores.map((item) => {
                  return {
                    value: item.IDFORNECEDOR,
                    label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`
                  }
                })}
                onChange={(e) => {
                  setFornecedorSelecionado(e)
                  clearErrors("fabricanteVinculo")
                }}
              />
              {errors.fabricanteVinculo && (
                <AlertError
                  error={errors.fabricanteVinculo}
                  onClose={clearErrors}
                  fieldName="fabricanteVinculo"
                />
              )}
            </div>
            <div className="col-sm-6 col-xl-4">
              <label htmlFor="situacao">Situação *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="situacaoVinculo"
                options={situacao.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={(e) => {
                  setStatusSelecionado(e)
                  clearErrors("situacaoVinculo")
                }}
              />
              {errors.situacaoVinculo && (
                <AlertError
                  error={errors.situacaoVinculo}
                  onClose={clearErrors}
                  fieldName="situacaoVinculo"
                />
              )}
            </div>
          </div>
        </div>

      </form>

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
    </Fragment>
  )
}