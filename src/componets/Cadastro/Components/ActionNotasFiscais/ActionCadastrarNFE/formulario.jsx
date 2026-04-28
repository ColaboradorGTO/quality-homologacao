import { Fragment, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { useCadastrarNFEdeEntrada } from "../hooks/useCadastrarNFEdeEntrada";
import { schema } from "./schema/useCadastrarSchema"
import { ActionListaNotasNFE } from "./actionListaProduto";

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });

    const {
                fornecedorSelecionado, 
        setFornecedorSelecionado,
        condicaoPagamento,
        setCondicaoPagamento,
        numeroPedido,
        setNumeroPedido,
        marcaSelecionada,
        setMarcaSelecionada,
        compradorSelecionado,
        setCompradorSelecionado,
        usoPrincipalSelecionado,
        setUsoPrincipalSelecionado,
        tipoFrete,
        setTipoFrete,
        statusSelecionado,
        setStatusSelecionado,
        saldoSelecionado,
        setSaldoSelecionado,
        dataCadastro,
        setDataCadastro,
        dataEmissao,
        setDataEmissao,
        filialSelecionada,
        setFilialSelecionada,
        cnpjFilial,
        setCnpjFilial,
        tipoNFESelecionada,
        setTipoNFESelecionada,
        numeroNFE,
        setNumeroNFE,
        serieNFE,
        setSerieNFE,
        modeloNFE,
        setModeloNFE,
        chaveNFE,
        setChaveNFE,
        observacao,
        setObservacao,
        totalAntesDesconto,
        setTotalAntesDesconto,
        desconto,
        setDesconto,
        adiantamentoTotal,
        setAdiantamentoTotal,
        despesasAdicionais,
        setDespesasAdicionais,
        impostos,
        setImpostos,
        impostoRetido,
        setImpostoRetido,
        totalPagar,
        setTotalPagar,
        valorAplicado,
        setValorAplicado,
        saldo,
        setSaldo,
        dadosCondicoesPagamento,
        dadosTransportadora,
        dadosComprador,
        dadosEmpresas,
        dadosUsoPrincipal,
        dadosFornecedores,
        dadosNfePedido,
        optionsTipoFrete, 
        handleFechar,
        onSubmit,
    } = useCadastrarNFEdeEntrada({ handleClose, usuarioLogado, optionsModulos, handleClick });
   

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                
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
                <div className="panel">
                    <div className="panel-container">
                        <div className="panel-tag">

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-6">
                                        <label className="form-label" htmlFor="notam">Fornecedor</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="fornecedorProduto"
                                            options={[
                                                { value: '', label: 'Selecione...' },
                                                ...dadosFornecedores?.map((item) => {
                                                    return {
                                                        value: item.IDFORNECEDOR,
                                                        label: `${item.NOFANTASIA} // ${item.NUCNPJ} // ${item.NORAZAOSOCIAL}`
                                                    }
                                                })]}
                                            value={fornecedorSelecionado}
                                            onChange={(e) => {
                                                setFornecedorSelecionado(e)
                                                clearErrors('fornecedorProduto')
                                            }}
                                        />
                                        {errors.fornecedorProduto && (
                                            <AlertError
                                                error={errors.fornecedorProduto}
                                                onClose={clearErrors}
                                                fieldName="fornecedorProduto"
                                            />
                                        )}
                                    </div>
                               
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Condições de Pagamento</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="condicaoPagamentoFornecedor"
                                            options={
                                                dadosCondicoesPagamento.map((item) => {
                                                    return {
                                                        value: item.IDCONDICAOPAGAMENTO,
                                                        label: item.DSCONDICAOPAG
                                                    }
                                                })
                                            }
                                            value={condicaoPagamento}
                                            onChange={(e) => {
                                                setCondicaoPagamento(e)
                                                clearErrors("condicaoPagamentoFornecedor")
                                            }}
                                        />
                                        {errors.condicaoPagamentoFornecedor && (
                                            <AlertError
                                                error={errors.condicaoPagamentoFornecedor}
                                                onClose={clearErrors}
                                                fieldName="condicaoPagamentoFornecedor"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="nPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Nº Pedido "}
                                                    name="nPedido"
                                                    type="text"
                                                    value={numeroPedido}
                                                    onChange={(e) => setNumeroPedido(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Marca</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="marcaPedido"
                                            options={
                                                dadosCondicoesPagamento.map((item) => {
                                                    return {
                                                        value: item.IDCONDICAOPAGAMENTO,
                                                        label: item.DSCONDICAOPAG
                                                    }
                                                })
                                            }
                                            value={marcaSelecionada}
                                            onChange={(e) => {
                                                setMarcaSelecionada(e)
                                                clearErrors("marcaPedido")
                                            }}
                                        />
                                        {errors.marcaPedido && (
                                            <AlertError
                                                error={errors.marcaPedido}
                                                onClose={clearErrors}
                                                fieldName="marcaPedido"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Comprador</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="compradorPedido"
                                            options={
                                                dadosCondicoesPagamento.map((item) => {
                                                    return {
                                                        value: item.IDCONDICAOPAGAMENTO,
                                                        label: item.DSCONDICAOPAG
                                                    }
                                                })
                                            }
                                            value={compradorSelecionado}
                                            onChange={(e) => {
                                                setCompradorSelecionado(e)
                                                clearErrors("compradorPedido")
                                            }}
                                        />
                                        {errors.compradorPedido && (
                                            <AlertError
                                                error={errors.compradorPedido}
                                                onClose={clearErrors}
                                                fieldName="compradorPedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Uso Principal</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="usoPrincipalPedido"
                                            options={
                                                dadosCondicoesPagamento.map((item) => {
                                                    return {
                                                        value: item.IDCONDICAOPAGAMENTO,
                                                        label: item.DSCONDICAOPAG
                                                    }
                                                })
                                            }
                                            value={usoPrincipalSelecionado}
                                            onChange={(e) => {
                                                setUsoPrincipalSelecionado(e)
                                                clearErrors("usoPrincipalPedido")
                                            }}
                                        />
                                        {errors.usoPrincipalPedido && (
                                            <AlertError
                                                error={errors.usoPrincipalPedido}
                                                onClose={clearErrors}
                                                fieldName="usoPrincipalPedido"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-6">
                                        <label htmlFor="">Frete</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="tipoFretePedido"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFretePedido")
                                            }}
                                        />
                                        {errors.tipoFretePedido && (
                                            <AlertError
                                                error={errors.tipoFretePedido}
                                                onClose={clearErrors}
                                                fieldName="tipoFretePedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Status</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="statusPedido"
                                            options={
                                                dadosCondicoesPagamento.map((item) => {
                                                    return {
                                                        value: item.IDCONDICAOPAGAMENTO,
                                                        label: item.DSCONDICAOPAG
                                                    }
                                                })
                                            }
                                            value={statusSelecionado}
                                            onChange={(e) => {
                                                setStatusSelecionado(e)
                                                clearErrors("statusPedido")
                                            }}
                                        />
                                        {errors.statusPedido && (
                                            <AlertError
                                                error={errors.statusPedido}
                                                onClose={clearErrors}
                                                fieldName="statusPedido"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-6">
                                        <label htmlFor="">Saldo</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="saldoPedido"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={saldoSelecionado}
                                            onChange={(e) => {
                                                setSaldoSelecionado(e)
                                                clearErrors("saldoPedido")
                                            }}
                                        />
                                        {errors.saldoPedido && (
                                            <AlertError
                                                error={errors.saldoPedido}
                                                onClose={clearErrors}
                                                fieldName="saldoPedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-3 col-xl-3">
                                        <Controller
                                            name="dataCadastroPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Data Cadastro "}
                                                    name="dataCadastroPedido"
                                                    type="date"
                                                    value={dataCadastro}
                                                    onChange={(e) => setDataCadastro(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                    <div className="col-sm-3 col-xl-3">
                                        <Controller
                                            name="dataEmissaoPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Data Emissão "}
                                                    name="dataEmissaoPedido"
                                                    type="date"
                                                    value={dataEmissao}
                                                    onChange={(e) => setDataEmissao(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                </div>
                            </div>
                                            
                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-6">
                                        <label htmlFor="">Filial</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="filialPedido"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={filialSelecionada}
                                            onChange={(e) => {
                                                setFilialSelecionada(e)
                                                clearErrors("filialPedido")
                                            }}
                                        />
                                        {errors.filialPedido && (
                                            <AlertError
                                                error={errors.filialPedido}
                                                onClose={clearErrors}
                                                fieldName="filialPedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="cnpjFilialPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"CNPJ Filial "}
                                                    name="cnpjFilialPedido"
                                                    type="text"
                                                    value={cnpjFilial}
                                                    onChange={(e) => setCnpjFilial(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                         
                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-6">
                                        <label htmlFor="">Tipo NF</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="tipoNFEPedido"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoNFESelecionada}
                                            onChange={(e) => {
                                                setTipoNFESelecionada(e)
                                                clearErrors("tipoNFEPedido")
                                            }}
                                        />
                                        {errors.tipoNFEPedido && (
                                            <AlertError
                                                error={errors.tipoNFEPedido}
                                                onClose={clearErrors}
                                                fieldName="tipoNFEPedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="numeroNFEPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Nº NF "}
                                                    name="numeroNFEPedido"
                                                    type="text"
                                                    value={numeroNFE}
                                                    onChange={(e) => setNumeroNFE(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                                            
                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-4">
                                     

                                        <Controller
                                            name="serieNFEPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Série NF "}
                                                    name="serieNFEPedido"
                                                    type="text"
                                                    value={serieNFE}
                                                    onChange={(e) => setSerieNFE(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-sm-3 col-xl-4">
                                       
                                        <label htmlFor="">Modelo NF</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="modeloNFEPedido"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={modeloNFE}
                                            onChange={(e) => {
                                                setModeloNFE(e)
                                                clearErrors("modeloNFEPedido")
                                            }}
                                        />
                                        {errors.modeloNFEPedido && (
                                            <AlertError
                                                error={errors.modeloNFEPedido}
                                                onClose={clearErrors}
                                                fieldName="modeloNFEPedido"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-3 col-xl-4">
                                        <Controller
                                            name="chaveNFEPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Chave NF "}
                                                    name="chaveNFEPedido"
                                                    type="text"
                                                    value={chaveNFE}
                                                    onChange={(e) => setChaveNFE(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <ActionListaNotasNFE dadosNfePedido={dadosNfePedido} />
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="observacaoPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Observações "}
                                                    name="observacaoPedido"
                                                    type="textarea"
                                                    value={observacao}
                                                    onChange={(e) => setObservacao(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xl-6 d-flex ">
                                     
                                        <div className="col-sm-6 col-xl-6">
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="totalAntesDescontoPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Total Antes do Desconto"}
                                                            name="totalAntesDescontoPedido"
                                                            type="text"
                                                            value={totalAntesDesconto}
                                                            onChange={(e) => setTotalAntesDesconto(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="descontoPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Desconto "}
                                                            name="descontoPedido"
                                                            type="text"
                                                            value={desconto}
                                                            onChange={(e) => setDesconto(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="adiantamentoTotalPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Adiantamento Total "}
                                                            name="adiantamentoTotalPedido"
                                                            type="text"
                                                            value={adiantamentoTotal}
                                                            onChange={(e) => setAdiantamentoTotal(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="despesasAdicionaisPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Despesas Adicionais "}
                                                            name="despesasAdicionaisPedido"
                                                            type="text"
                                                            value={despesasAdicionais}
                                                            onChange={(e) => setDespesasAdicionais(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                        </div>

                                        <div className="col-sm-6 col-xl-6">
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="impostosPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Imposto"}
                                                            name="impostosPedido"
                                                            type="text"
                                                            value={impostos}
                                                            onChange={(e) => setImpostos(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="impostoRetidoPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Valor de Imposto Retido"}
                                                            name="impostoRetidoPedido"
                                                            type="text"
                                                            value={impostoRetido}
                                                            onChange={(e) => setImpostoRetido(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="totalPagarPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Total a Pagar"}
                                                            name="totalPagarPedido"
                                                            type="text"
                                                            value={totalPagar}
                                                            onChange={(e) => setTotalPagar(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="valorAplicadoPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Valor Aplicado"}
                                                            name="valorAplicadoPedido"
                                                            type="text"
                                                            value={valorAplicado}
                                                            onChange={(e) => setValorAplicado(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="saldoPedido"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Saldo"}
                                                            name="saldoPedido"
                                                            type="text"
                                                            value={saldo}
                                                            onChange={(e) => setSaldo(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>     
                           
                        </div>
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleFechar}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                    tipoBtnCadastrar={"submit"}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}