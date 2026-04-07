import { Fragment } from "react"
import { Controller, useForm } from "react-hook-form";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/schemaFinalizarOT";
import { useFinalizarOT } from "../../../hooks/useFinalizarOT";

export const FormularioFinalizarOT = ({
  dadosSalvarVolume,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  dadosFinalizarOT,
}) => {

  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });

  const {
    descricao,
    setDescricao,
    qtdVolume,
    setQtdVolume,
    conferirItens,
    setConferirItens,
    onSubmit,

  } = useFinalizarOT({
    dadosSalvarVolume,
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
    handleClose,
    dadosFinalizarOT
  })

  const handleRadioChange = (event) => {
    const { id } = event.target;
    if (id === 'Sim') {
      setConferirItens('True');
    } else if (id === 'Nao') {
      setConferirItens('False');
    }
  };

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        quantidade: qtdVolume,
        descricaoDigitada: descricao,
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
        <div className="row">
          <div className="col-sm-2 col-xl-2">
            <label className="form-label">Confere Itens</label>
            <div className="form-check">
              <label className="form-check-label" htmlFor="sim">

                <input
                  id="Sim"
                  type="radio"
                  className="form-check-input"
                  name="Sim"
                  onChange={handleRadioChange}
                /> Sim
              </label>

              <label className="form-check-label" htmlFor="nao">

                <input
                  id="Nao"
                  type="radio"
                  className="form-check-input"
                  name="nao"
                  onChange={handleRadioChange}
                /> Não
              </label>

            </div>
          </div>

          <div className="col-sm-2 col-xl-2">
            <Controller
              name="quantidade"
              control={control}
              render={({ field }) => (
                <FormField
                  name="quantidade"
                  label={"Quantidade"}
                  type="number"
                  value={qtdVolume}
                  onChange={(e) => setQtdVolume(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                />
              )}
            />
          </div>

          <div className="col-sm-8 col-xl-8">
            <Controller
              name="descricaoDigitada"
              control={control}
              render={({ field }) => (
                <FormField
                  name="descricaoDigitada"
                  label={"Descrição"}
                  type="textarea"
                  value={descricao}
                  placeholder={'Digite aqui a descrição do volume'}
                  onChange={(e) => setDescricao(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                />
              )}
            />
          </div>
        </div>
        <div className="row mt-4">
        </div>

        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Salvar"}
          onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
          corCadastrar={"success"}
          autoLoadingCadastrar={true}
          loadingTextCadastrar={"Cadastrando..."}
        />
      </form>
    </Fragment>
  )
}