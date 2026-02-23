import { Fragment } from "react"
import { useSalvarOT } from "../hooks/useSalvarOT";
import { Controller, useForm } from "react-hook-form"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FaRegSave } from "react-icons/fa";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Select from 'react-select';
import { ActionListaProdutos } from "./actionListaProdutos";
import FormField from "../../../../Formularios/FormField";
//import { schema } from './schemaValidationIncluirOT';
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { AlertError } from "../../../../Inputs/alertError";
import { useEffect } from "react";
import { on } from "events";

export const FormularioIncuirOT = ({ handleClose, handleClick, usuarioLogado, optionsModulos }) => {
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
  } = useSalvarOT({ handleClick, handleClose, usuarioLogado, optionsModulos });

  useEffect(() => {
    if (usuarioLogado?.IDEMPRESA) {
      setEmpresaOrigem(usuarioLogado.IDEMPRESA);
    }
  }, [usuarioLogado, setEmpresaOrigem]);

 /*  const handleValidatedSubmit = async () => {
    try {

      const dadosParaValidar = {
        produtoIncluir: produto,
      }
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
  }; */

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row" >
          <div className="col-sm-6 col-xl-6">
            <InputFieldModal
              label={"Loja Origem"}
              type="text"
              value={usuarioLogado?.NOFANTASIA}
              onChangeModal={(e) => setEmpresaOrigem(e.target.value)}
              placeholder={"Loja Origem"}
              readOnly={true}
            />
          </div>
          <div className="col-sm-6 col-xl-6" >
            <label className="form-label" htmlFor={""}>Loja Destino</label>
            <Select
              label={"Loja Destino"}
              options={dadosEmpresa.map((item) => ({
                value: item.IDEMPRESA,
                label: item.NOFANTASIA,
                isDisabled: item.IDEMPRESA === empresaOrigem
              }))}

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
              Icon={FaRegSave}
              textButton={"Salvar"}
              cor={"info"}
              className={"mr-4"}
              //onClickButtonType={onSubmit}
              tipoBtnCadastrar={"submit"}

            />
          </div>
          <div className="col-sm-8 col-xl-8 mt-4">
            <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
          </div>
        </div>
      </form>
      <ActionListaProdutos
        dadosProdutosTabela={dadosProdutosTabela}
        setDadosProdutosTabela={setDadosProdutosTabela}
        produtoSalvo={produtoSalvo}
        setProdutoSalvo={setProdutoSalvo}
      />
      <FooterModal
        ButtonTypeFechar={ButtonTypeModal}
        textButtonFechar={"Fechar"}
        onClickButtonFechar={handleClose}
        corFechar={"secondary"}
      />
    </Fragment>
  )
}