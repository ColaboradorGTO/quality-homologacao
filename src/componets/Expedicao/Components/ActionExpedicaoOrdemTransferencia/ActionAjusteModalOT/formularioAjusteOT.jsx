import { Fragment } from "react"
import { useSalvarOT } from "../../../hooks/useSalvarOT";
import { Controller, useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FaRegSave } from "react-icons/fa";
import Select from 'react-select';
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { ActionListaProdutosOrdemTransferencia } from "./ActionListaOrdemTrasferencia";
import { schema } from "./schema/validacaoFormularioEditarOT";
import { useEditarOT } from "../../../hooks/useEditarOT";

export const FormularioAjusteOT = ({
    handleClose,
    optionsModulos,
    usuarioLogado,
    refetchListaConferencia,
    dadosDetalheTransferencia,
    setDadosDetalheTransferencia

}) => {

    const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
        mode: "onChange"
    })
    const {
        empresaOrigem,
        setEmpresaOrigem,
        empresaDestino,
        setEmpresaDestino,
        produto,
        setProduto,
        dataEntrega,
        setDataEntrega,
        quantidade,
        setQuantidade,
        observacao,
        setObservacao,
        linhaSelecionada,
        dadosEmpresa,
        dadosProdutosTabela,
        setDadosProdutosTabela,
        setLinhaSelecionada,
        onSubmit,
        handleExcluirProduto,
        handleChangeQtdAjuste,
    } = useEditarOT({

        handleClose,
        optionsModulos,
        usuarioLogado,
        refetchListaConferencia,
        dadosDetalheTransferencia,
        setDadosDetalheTransferencia
    });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                empresaOrigemSelecionada: empresaOrigem,
                empresaDestinoSelecionada: empresaDestino,
                quantidadeDigitada: quantidade,
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
                <div className="row" data-select2-id="736">
                    <div className="col-sm-6 col-xl-6">
                        <label className="form-label" htmlFor={""}>Loja Origem</label>
                        <Select
                            closeMenuOnSelect={false}
                            options={dadosEmpresa?.map((item) => ({
                                value: item.IDEMPRESA,
                                label: item.NOFANTASIA
                            }
                            ))}
                            value={empresaOrigem}
                            isDisabled
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
                            closeMenuOnSelect={false}
                            isDisabled
                            options={dadosEmpresa?.map((item) => ({
                                value: item.IDEMPRESA,
                                label: item.NOFANTASIA,
                                isDisabled: item.IDEMPRESA === empresaOrigem.value
                            }
                            ))}
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
                                    placeholder={"Digite o codigo de barra do produto"}
                                    readOnly={dadosProdutosTabela[0]?.IDSTATUSOT !== 10}
                                    onChange={(e) => setProduto(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="dataEntregaSelecionada"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    name="dataEntregaSelecionada"
                                    label={"Data Entrega"}
                                    type="date"
                                    readOnly
                                    value={dataEntrega}
                                    onChange={(e) => setDataEntrega(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="quantidadeDigitada"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    name="quantidadeDigitada"
                                    label={"Quantidade"}
                                    placeholder={"Digite a Quantidade"}
                                    type="text"
                                    value={quantidade}
                                    readOnly
                                    onChange={(e) => setQuantidade(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="observaçãoDigitada"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    name="observaçãoDigitada"
                                    label={"Observação"}
                                    placeholder="Digite aqui a Observação"
                                    type="textarea"
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    errors={errors}
                                    readOnly={dadosProdutosTabela[0]?.IDSTATUSOT !== 10}
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
                            disabled={dadosProdutosTabela[0]?.IDSTATUSOT !== 10}
                            tipoBtnCadastrar={"submit"}
                        />

                    </div>
                    <div className="col-sm-8 col-xl-8 mt-4">
                        <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                    </div>
                </div>
            </form>

            <ActionListaProdutosOrdemTransferencia
                dadosProdutosTabela={dadosProdutosTabela}
                setDadosProdutosTabela={setDadosProdutosTabela}
                dadosDetalheTransferencia={dadosDetalheTransferencia}
                setDadosDetalheTransferencia={setDadosDetalheTransferencia}
                handleExcluirProduto={handleExcluirProduto}
                handleChangeQtdAjuste={handleChangeQtdAjuste}
            />

        </Fragment>
    )
}