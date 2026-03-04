import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarGrupoEstruturaMercadologica } from "../hooks/useCadastrarGrupoEstruturaMercadologico"
import { AlertError } from "../../../../Inputs/alertError"
import FormField from "../../../../Formularios/FormField"
import { situacao } from "../../../../../../parceiro.json" 
import { schema } from "./schemaValidarGrupo";

export const FormularioCadastro = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });
  const {
    statusSelecionado,
    setStatusSelecionado,
    descricao,
    setDescricao,
    onSubmit

  } = useCadastrarGrupoEstruturaMercadologica({ handleClose, usuarioLogado, optionsModulos, handleClick });

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        descricaoGrupo: descricao,
        situacaoGrupo: statusSelecionado,
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
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-xl-6 ">
              <Controller
                name="descricaoGrupo"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="descricaoGrupo"
                    label={"Descrição *"}
                    type="text"
                    errors={errors}
                    clearErrors={clearErrors}
                    value={descricao}
                    onChangeModal={(e) => setDescricao(e.target.value)}
                  />
                )}
              />
            </div>

            <div className="col-sm-6 col-xl-3">

              <label htmlFor="">Situação *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="situacaoGrupo"
                options={situacao.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={(e) => {
                  setStatusSelecionado(e)
                  clearErrors('situacaoGrupo')
                }}
              />
              {errors.situacaoGrupo && (
                <AlertError
                  error={errors.situacaoGrupo}
                  onClose={clearErrors}
                  fieldName="situacaoGrupo"
                />
              )}
            </div>
          </div>
        </div>
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

      </form>
    </Fragment>
  )
}