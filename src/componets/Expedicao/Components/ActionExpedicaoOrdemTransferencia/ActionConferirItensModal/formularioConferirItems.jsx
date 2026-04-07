import { Fragment } from "react"
import { Controller, useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FaCheck, FaRegSave } from "react-icons/fa";
import Select from 'react-select';
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { ActionListaProdutosOrdemTransferencia } from "./ActionListaOrdemTrasferencia";
import { useConferirItemsOT } from "../../../hooks/useConferirItemsOT";
import { ActionSalvarVolumeOTModal } from "../ActionVolume/actionSalvarVolumeOT";

export const FormularioConferirItems = ({
    handleClose,
    optionsModulos,
    usuarioLogado,
    refetchListaConferencia,
    dadosDetalheTransferencia,
    setDadosDetalheTransferencia,
    setModalConferirItemsModal,

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
        observacao,
        setObservacao,
        dadosEmpresa,
        dadosProdutosTabela,
        setDadosProdutosTabela,
        handleExcluirProduto,
        handleChangeQtdAjuste,
        handleConferirItems,
        salvarConferirItems,
        visualizarModalVolume,
        setVisualizarModalVolume,
    } = useConferirItemsOT({

        handleClose,
        optionsModulos,
        usuarioLogado,
        refetchListaConferencia,
        dadosDetalheTransferencia,
        setDadosDetalheTransferencia,
        setModalConferirItemsModal
    });

    return (
        <Fragment>
            <form onSubmit={handleSubmit(salvarConferirItems)}>
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
                                    onChange={(e) => setProduto(e.target.value)}
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
                                    readOnly={dadosProdutosTabela[0]?.IDSTATUSOT !== 1}
                                    clearErrors={clearErrors}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="row mt-1 col-sm-4 col-xl-4" >

                    <ButtonTypeModal
                        Icon={FaRegSave}
                        textButton={"Salvar"}
                        cor={"info"}
                        className={"mt-2 "}
                        tipoBtnCadastrar={handleSubmit(salvarConferirItems)}
                    />
                </div>
            </form>
            <ButtonTypeModal
                Icon={FaCheck}
                textButton={"Finalizar Confêrencia"}
                cor={"success"}
                className={"mt-2 "}
                onClickButtonType={() => handleConferirItems()}
            />

            <div className="col-sm-8 col-xl-8 mt-4">
                <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
            </div>

            <ActionListaProdutosOrdemTransferencia
                dadosProdutosTabela={dadosProdutosTabela}
                setDadosProdutosTabela={setDadosProdutosTabela}
                dadosDetalheTransferencia={dadosDetalheTransferencia}
                setDadosDetalheTransferencia={setDadosDetalheTransferencia}
                handleExcluirProduto={handleExcluirProduto}
                handleChangeQtdAjuste={handleChangeQtdAjuste}
            />

            <ActionSalvarVolumeOTModal
                show={visualizarModalVolume}
                handleClose={() => setVisualizarModalVolume(false)}
                refetchListaConferencia={refetchListaConferencia}
                dadosDetalheTransferencia={dadosDetalheTransferencia}
                optionsModulos={optionsModulos}
                usuarioLogado={usuarioLogado}
            />

        </Fragment>
    )
}