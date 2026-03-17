import { Fragment } from "react"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schema/schemaMotivoEncerrar";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { useEncerrarOT } from "../../../hooks/useEncerrarOT";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";


export const FormularioMotivoEncerrarOT = ({
  dadosEncerrarOT,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado

}) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });

  const {
    statusDivergencia,
    setStatusDivergencia,
    observacao,
    setObservacao,
    onSubmit,
    dadosStatus

  } = useEncerrarOT({
    dadosEncerrarOT,
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
    handleClose,
  });

  const handleValidatedSubmit = async () => {
    try {

      const dadosParaValidar = {
        observacaoDigitada: observacao,
        statusDivergenciaSelecionada: statusDivergencia,
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
      //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleValidatedSubmit)}>
        <div className="row " data-select2-id="736" >
          <div className="col-sm-6 col-xl-12 mb-3" >
            <label className="form-label" htmlFor={""}>Motivo Divergência</label>

            <Select
              label={"Motivo Divergência"}
              options={dadosStatus.map((item) => ({
                value: item.IDSTATUSDIVERGENCIA,
                label: item.DESCRICAODIVERGENCIA,
              }))}
              value={statusDivergencia}
              onChange={(opt) => {
                setStatusDivergencia(opt ?? null);
                clearErrors("statusDivergenciaSelecionada");
              }}
            />

            {errors.statusDivergenciaSelecionada && (
              <AlertError
                error={errors.statusDivergenciaSelecionada}
                onClose={clearErrors}
                fieldName="statusDivergenciaSelecionada"
              />
            )}

            <div className="mt-3">
              <Controller
                name="observacaoDigitada"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="Observação"
                    placeholder="Digite aqui a Observação"
                    name="observacaoDigitada"
                    type="textarea"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    errors={errors}
                    width="100%"
                    height="120px"
                    clearErrors={clearErrors}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div>
          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
            tipoBtnCadastrar={"submit"}
            textButtonCadastrar={"Encerrar OT"}
            corCadastrar="success"
            autoLoadingCadastrar={true}
            loadingTextCadastrar={"Cadastrando..."}

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />

        </div>
      </form>
    </Fragment>
  )
}