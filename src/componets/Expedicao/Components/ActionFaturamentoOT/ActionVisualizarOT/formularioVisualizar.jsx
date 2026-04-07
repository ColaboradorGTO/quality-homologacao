import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionListaVisualizar } from "./actionListaProdutos";
import FormField from "../../../../Formularios/FormField";
import { Controller, useForm } from "react-hook-form";

export const FormularioVisualizar = ({ handleClose, dadosDetalheTransferencia }) => {

  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });
  return (
    <Fragment>

      <div>
        <form onSubmit={''}>
          <div className="row" data-select2-id="736">
            <div className="col-sm-6 col-xl-6">

              <Controller
                name="lojaOrigemSelecionada"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="lojaOrigemSelecionada"
                    label={"Loja Origem"}
                    type="text"
                    value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                    errors={errors}
                    clearErrors={clearErrors}
                    readOnly={true}
                  />
                )}
              />
            </div>
            <div className="col-sm-6 col-xl-6" data-select2-id="735">

              <Controller
                name="lojaDestinoSelecionada"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="lojaDestinoSelecionada"
                    label={"Loja Destino"}
                    type="text"
                    value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                    errors={errors}
                    clearErrors={clearErrors}
                    readOnly={true}
                  />
                )}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-sm-6 col-xl-6">
              <Controller
                name="ObeservacaoDigitada"
                control={control}
                render={({ field }) => (
                  <FormField
                    name="ObeservacaoDigitada"
                    label={"Loja Origem"}
                    type="textarea"
                    value={dadosDetalheTransferencia[0]?.DSOBSERVACAO}
                    errors={errors}
                    clearErrors={clearErrors}
                    readOnly={true}
                  />
                )}
              />
            </div>
          </div>
        </form>

        <ActionListaVisualizar
          dadosDetalheTransferencia={dadosDetalheTransferencia}
        />
      </div>

      <FooterModal
        ButtonTypeFechar={ButtonTypeModal}
        textButtonFechar={"Fechar"}
        onClickButtonFechar={handleClose}
        corFechar={"secondary"}
      />

    </Fragment>
  )
}