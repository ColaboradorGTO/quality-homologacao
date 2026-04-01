import { Fragment } from "react"
import Select from 'react-select';
import { FaRegSave } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { ActionListaConferirOT } from "./actionListaConferirOT";
import { useConferirOT } from "../../../hooks/useConferirOT";

export const FormularioConferirOT = ({
  handleClose,
  dadosDetalheTransferencia,
  usuarioLogado,
  optionsModulos,
  refetchListaConferencia,
}) => {

  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });

  const {
    empresaOrigem,
    setEmpresaOrigem,
    empresaDestino,
    setEmpresaDestino,
    produto,
    setProduto,
    dadosEmpresa,
    dadosProdutosTabela,
    onSubmit,
    handleChangeQtdAjuste,
    handleDiminuirProduto,
    handleExcluirProduto,

  } = useConferirOT({
    handleClose,
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
    dadosDetalheTransferencia
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row" data-select2-id="736">
          <div className="col-sm-6 col-xl-6">
            <label className="form-label" htmlFor={""}>Loja Origem</label>

            <Select
              label={"Loja Origem"}
              options={dadosEmpresa.map((item) => ({
                value: item.IDEMPRESA,
                label: item.NOFANTASIA,
              }))}
              isDisabled
              value={empresaOrigem}
              onChange={(e) => setEmpresaOrigem(e)}
            />

            {errors.empresaDestino && (
              <AlertError
                error={errors.empresaDestino}
                onClose={clearErrors}
                fieldName="empresaDestino"
              />
            )}

          </div>
          <div className="col-sm-6 col-xl-6" data-select2-id="735">
            <label className="form-label" htmlFor={""}>Loja Destino</label>

            <Select
              label={"Loja Destino"}
              options={dadosEmpresa.map((item) => ({
                value: item.IDEMPRESA,
                label: item.NOFANTASIA,
                isDisabled: item.IDEMPRESA === empresaOrigem.value

              }))}
              isDisabled
              value={empresaDestino}
              onChange={(e) => {
                if (e?.value === empresaOrigem) return;
                setEmpresaDestino(e);
              }}
            />

            {errors.empresaDestino && (
              <AlertError
                error={errors.empresaDestino}
                onClose={clearErrors}
                fieldName="empresaDestino"
              />
            )}

          </div>
        </div>
        <div className="row mt-4">
          <div className="col-sm-6 col-xl-3">

            <Controller
              name="ID"
              control={control}
              render={({ field }) => (
                <FormField
                  name="ID"
                  label={"ID"}
                  type="text"
                  value={dadosDetalheTransferencia[0]?.IDRESUMOOT}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={true}
                />
              )}
            />
          </div>

          <div className="col-sm-6 col-xl-3">

            <Controller
              name="NF-e"
              control={control}
              render={({ field }) => (
                <FormField
                  name="NF-e"
                  label={"NF-e"}
                  type="text"
                  value={dadosDetalheTransferencia[0]?.NUMERONFE}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={true}
                />
              )}
            />
          </div>

          <div className="col-sm-6 col-xl-3">

            <Controller
              name="Status"
              control={control}
              render={({ field }) => (
                <FormField
                  name="Status"
                  label={"Status"}
                  type="text"
                  value={dadosDetalheTransferencia[0]?.DESCRICAOOT}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={true}
                />
              )}
            />
          </div>

          <div className="col-sm-6 col-xl-3">

            <Controller
              name="Data"
              control={control}
              render={({ field }) => (
                <FormField
                  name="Data"
                  label={"Data"}
                  type="text"
                  value={dadosDetalheTransferencia[0]?.DATAEXPEDICAOFORMATADA}
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
              name="produtoIncluir"
              control={control}
              render={({ field }) => (
                <FormField
                  name="produtoIncluir"
                  label={"Produto"}
                  type="text"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  errors={errors}
                  clearErrors={clearErrors}
                  readOnly={![3, 5].includes(dadosProdutosTabela[0]?.IDSTATUSOT)}
                />
              )}
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-sm-8 col-xl-8">

            <ButtonTypeModal
              Icon={FaRegSave}
              textButton={"Salvar"}
              cor={"info"}
              className={"mr-4"}
              tipoBtnCadastrar={"submit"}
              loading={false}
              loadingText={"Salvando..."}
              disabled={![3, 5].includes(dadosProdutosTabela[0]?.IDSTATUSOT)}
            />
          </div>
          <div className="col-sm-8 col-xl-8 mt-4">
            <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
          </div>
        </div>
      </form>

      <ActionListaConferirOT
        dadosProdutosTabela={dadosProdutosTabela} 
        handleDiminuirProduto={handleDiminuirProduto}
        handleExcluirProduto={handleExcluirProduto}
      />
    </Fragment>
  )
}
