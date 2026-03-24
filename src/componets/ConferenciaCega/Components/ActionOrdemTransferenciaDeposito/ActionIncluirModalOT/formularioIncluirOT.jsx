import { Fragment, useEffect } from "react"
import { useSalvarOT } from "../../../hooks/useSalvarOT";
import { Controller, useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FaRegSave } from "react-icons/fa";
import Select from 'react-select';
import { ActionListaProdutos } from "./actionListaProdutos";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/schemaValidacaoCadastroOT";

export const FormularioIncuirOT = ({
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  empresaSelecionadaOrigem

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
    setDadosProdutosTabela,
    produtoSalvo,
    setProdutoSalvo,
    onSubmit,

  } = useSalvarOT({
    handleClose,
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
  });

  useEffect(() => {
    if (empresaSelecionadaOrigem) {
      setEmpresaOrigem(empresaSelecionadaOrigem);
    }
  }, [empresaSelecionadaOrigem]);

  const handleValidatedSubmit = async () => {
    try {

      const dadosParaValidar = {
        empresaOrigemSelecionada: empresaOrigem,
        empresaDestinoSelecionada: empresaDestino,
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
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleValidatedSubmit)}>
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
              onChange={(opt) => {
                setEmpresaOrigem(opt ?? null);
                clearErrors("empresaOrigemSelecionada");
              }}
            />

            {errors.empresaOrigemSelecionada && (
              <AlertError
                error={errors.empresaOrigemSelecionada}
                onClose={clearErrors}
                fieldName="empresaOrigemSelecionada"
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

              value={empresaDestino}
              onChange={(opt) => {
                setEmpresaDestino(opt ?? null);
                clearErrors("empresaDestinoSelecionada");
              }}
            />

            {errors.empresaDestinoSelecionada && (
              <AlertError
                error={errors.empresaDestinoSelecionada}
                onClose={clearErrors}
                fieldName="empresaDestinoSelecionada"
              />
            )}
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
                />
              )}
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-sm-8 col-xl-8">

            <ButtonTypeModal
              onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
              tipoBtnCadastrar={"submit"}
              cor={"info"}
              textButton={"Salvar"}
              Icon={FaRegSave}
              autoLoadingCadastrar={true}
              loadingTextCadastrar={"Cadastrando..."}
            />

          </div>
          <div className="col-sm-8 col-xl-8 mt-4">
            <label
              className="form-label" style={{ color: "red" }}>
              Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!
            </label>
          </div>
        </div>
      </form>

      <ActionListaProdutos
        dadosProdutosTabela={dadosProdutosTabela}
        setDadosProdutosTabela={setDadosProdutosTabela}
        produtoSalvo={produtoSalvo}
        setProdutoSalvo={setProdutoSalvo}
      />
    </Fragment>
  )
}