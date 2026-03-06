import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { useEditarVinculoFornecedorFabricante } from "../hooks/useEditarViculoFornecedorFabricante";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schema/useEditarSchema";

export const FormularioEditar = ({
  handleClose,
  dadosDetalheFornecedorFabricante,
  usuarioLogado,
  optionsModulos,
  handleClick
}) => {
  const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
    mode: "onChange"
  });
  const {
    statusSelecionado,
    fabricante,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    situacao,
    setStatusSelecionado,
    setFabricante,
    dadosFabricantes,
    onSubmit
  } = useEditarVinculoFornecedorFabricante({ handleClose, dadosDetalheFornecedorFabricante, usuarioLogado, optionsModulos, handleClick })

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        nomeFornecedor: fabricante,
        fornecedor: fornecedorSelecionado,
        situacaoFornecedor: statusSelecionado
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
        <div className="form-group">
          <div className="row">

            <div className="col-sm-6 col-xl-4">
              <Controller
                name="nomeFornecedor"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={"Fornecedor *"}
                    name="nomeFornecedor"
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
            <div className="col-sm-6 col-xl-6">
              <label htmlFor="fornecedor">Nome Fabricante *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="fornecedor"
                options={dadosFabricantes.map((item) => {
                  return {
                    value: item.IDFORNECEDOR,
                    label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                  }
                })}
                value={fornecedorSelecionado}
                onChange={(e) => { 
                  setFornecedorSelecionado(e)
                  clearErrors("fornecedor")
                }}
              />
              {errors.fornecedor && (
                <AlertError
                  error={errors.fornecedor}
                  onClose={clearErrors}
                  fieldName="fornecedor"
                />
              )}
            </div>
            <div className="col-sm-6 col-xl-2">
              <label htmlFor="situacao">Situação *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="situacaoFornecedor"
                options={situacao.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={(e) => {
                  setStatusSelecionado(e)
                  clearErrors("situacaoFornecedor")
                }}
              />
              {errors.situacaoFornecedor && (
                <AlertError
                  error={errors.situacaoFornecedor}
                  onClose={clearErrors}
                  fieldName="situacaoFornecedor"
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