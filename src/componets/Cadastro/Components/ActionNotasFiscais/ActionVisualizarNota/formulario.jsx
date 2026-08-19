import { Fragment, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { useCadastrarNFEdeEntrada } from "../hooks/useCadastrarNFEdeEntrada";
import { ActionListaNotasNFE } from "./actionListaProduto";
import { mascaraCNPJ } from "../../../../../utils/mascaraCNPJ";
import Swal from "sweetalert2";
import { useVisualizarNFEdeEntrada } from "../hooks/useVisualizarNFEdeEntrada";

export const Formulario = ({ handleClose, dadosVisualizarNFE }) => {
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
        dadosFabricantes,
        optionsTipoFreteComercial,
        optionsReposicao,
        optionsUsoPrincipal,
        optionsTipoNFE,
        optionsModeloNFE,
    } = useVisualizarNFEdeEntrada({ handleClose, dadosVisualizarNFE });
   

    const preencheDadosComCHNFE = (chaveNFE) => {
        chaveNFE = chaveNFE.replace(/\D/g, ''); 
        setChaveNFE(chaveNFE);

        if(chaveNFE.length === 44) {
            let cnpjFornecedor = fornecedorSelecionado?.cnpj || '';
            let cnpjNota = chaveNFE.substring(6, 20);
        
            if(cnpjNota !== cnpjFornecedor) {
                return Swal.fire({
                    icon: 'warning',
                    title: 'CNPJ inválido',
                    text: 'Está nota não Pertence ao Fornecedor Selecionado, favor verificar a nota fiscal!',
                    customClass: {
                        container:  'custom-swal',
                    }
                })
            }

            setModeloNFE(chaveNFE.substring(20, 22));
            setSerieNFE(chaveNFE.substring(22, 25));
            setNumeroNFE(chaveNFE.substring(25, 34));
        } else if(chaveNFE.length > 1 && chaveNFE.length < 44 || chaveNFE.length > 44) {
            return Swal.fire({
                icon: 'warning',
                title: 'Chave de NFE inválida',
                text: `Chave incompleta ou maior que 44 caracteres, favor verifique a chave da nota fiscal! Nº DE CARACTERES DIGITADOS: ${chaveNFE.length}`,
                customClass: {
                    container:  'custom-swal',
                }
            })
        }
    }
   
    return (
        <Fragment>
            <form >
                <div className="panel">
                    <div className="panel-container">
                        <div className="panel-tag">

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-sm-6 col-xl-8">
                                        <label className="form-label" htmlFor="notam">Fornecedor</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="fornecedorPedido"
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
                                                clearErrors('fornecedorPedido')
                                            }}
                                            isDisabled={true}
                                        />
       
                                    </div>
                               
                                    <div className="col-sm-6 col-xl-4">
                                        <label>Condições de Pagamento</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="condicaoPagamentoPedido"
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
                                                clearErrors("condicaoPagamentoPedido")
                                            }}
                                            isDisabled={true}
                                        />

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
                                                    readOnly={true}
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
                                                dadosFabricantes?.map((item) => {
                                                    return {
                                                        value: item.IDFABRICANTE,
                                                        label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                                                    }
                                                })
                                            }
                                            value={marcaSelecionada}
                                            onChange={(e) => {
                                                setMarcaSelecionada(e)
                                                clearErrors("marcaPedido")
                                            }}
                                            isDisabled={true}
                                        />
 
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
                                                dadosComprador?.map((item) => {
                                                    return {
                                                        value: item.IDFUNCIONARIO,
                                                        label: item.NOFUNCIONARIO
                                                    }
                                                })
                                            }
                                            value={compradorSelecionado}
                                            onChange={(e) => {
                                                setCompradorSelecionado(e)
                                                clearErrors("compradorPedido")
                                            }}
                                            isDisabled={true}
                                        />
                    
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Uso Principal</label>

                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="usoPrincipalPedido"
                                            options={
                                                optionsUsoPrincipal?.map((item) => {
                                                    return {
                                                        value: item.value,
                                                        label: item.label
                                                    }
                                                })
                                            }
                                            value={usoPrincipalSelecionado}
                                            onChange={(e) => {
                                                setUsoPrincipalSelecionado(e)
                                                clearErrors("usoPrincipalPedido")
                                            }}
                                            isDisabled={true}
                                        />
                                        
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
                                            options={optionsTipoFreteComercial?.map((item) => {
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
                                            isDisabled={true}
                                        />
                                        
                                    </div>
                                    <div className="col-sm-6 col-xl-6">                              
                                        <Controller
                                            name="statusPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Status"}
                                                    name="statusPedido"
                                                    type="text"
                                                    placeholder={"Aberta"}
                                                    value={statusSelecionado}
                                                    onChange={(e) => setStatusSelecionado(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    readOnly={true}
                                                />
                                            )}
                                        />
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
                                            options={optionsReposicao?.map((item) => {
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
                                            isDisabled={true}
                                        />
                                        
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
                                                    readOnly={true}
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
                                                    readOnly={true}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                </div>
                            </div>
                                            
                            <div className="form-group">
                                <div className="row">
                                
                                    <div className="col-sm-6 col-xl-7">
                                        <label htmlFor="">Filial</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="filialPedido"
                                            options={dadosEmpresas.map((item) => {
                                                return {
                                                    value: item.IDEMPRESA,
                                                    label: `${item.NOFANTASIA} - ${item.NORAZAOSOCIAL}`,
                                                    cnpj: item.NUCNPJ
                                                }
                                            })}
                                            value={filialSelecionada}
                                            onChange={(e) => {
                                                setFilialSelecionada(e)
                                                setCnpjFilial(e?.cnpj || '')
                                                clearErrors("filialPedido")
                                            }}
                                            isDisabled={true}
                                        />
                                        
                                        
                                    </div>
                                    <div className="col-sm-6 col-xl-5">
                                        <Controller
                                            name="cnpjFilialPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"CNPJ Filial "}
                                                    name="cnpjFilialPedido"
                                                    type="text"
                                                    value={mascaraCNPJ(cnpjFilial)}
                                                    onChange={(e) => setCnpjFilial(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    readOnly={true}
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
                                            options={[
                                                { value: '-2', label: 'Externo' },
                                                ...(optionsTipoNFE?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                })) || [])
                                            ]}
                                            value={tipoNFESelecionada}
                                            onChange={(e) => {
                                                setTipoNFESelecionada(e)
                                                clearErrors("tipoNFEPedido")
                                            }}
                                            // isDisabled={true}
                                        />
                                        
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
                                                    readOnly={true}
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
                                                    readOnly={true}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-sm-3 col-xl-4">
                                       
                                        <Controller
                                            name="serieNFEPedido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Modelo NF "}
                                                    name="modeloNFEPedido"
                                                    type="text"
                                                    value={'NFe(55)'}
                                                    onChange={(e) => setModeloNFE(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    readOnly={true}
                                                />
                                            )}
                                        />
                                                    {/* <label htmlFor="">Modelo NF</label> */}
                                        {/* <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="modeloNFEPedido"
                                            options={optionsModeloNFE?.map((item) => {
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
                                            isDisabled={true}
                                        /> */}
                                        
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
                                                    onChange={(e) => preencheDadosComCHNFE(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    readOnly={true}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <ActionListaNotasNFE dadosVisualizarNFE={dadosVisualizarNFE} />
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
                                                    readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                                                            readOnly={true}
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
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

      
                />
            </form>
        </Fragment>
    )
}