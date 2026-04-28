import { Fragment, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { useCadastrarAlterarFornecedor } from "../hooks/useCadastrarAlterarFornecedor";
import { schema } from "./schema/useCadastrarSchema"

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });

    const {
        fornecedorSelecionado, 
        setFornecedorSelecionado,

        cnpj,
        setCnpj,
        inscricaoEstadual,
        setInscricaoEstadual,
        inscricaoMunicipal,
        setInscricaoMunicipal,
        razaoSocial,
        setRazaoSocial,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        numero,
        setNumero,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUf,
        numeroIBGE,
        setNumeroIBGE,
        nomeRepresentante,
        setNomeRepresentante,
        email,
        setEmail,
        telefone1,
        setTelefone1,
        telefone2,
        setTelefone2,
        telefone3,
        setTelefone3,
        situacaoSelecionada,
        setSituacaoSelecionada,
        fiscal,
        setFiscal,
        enviar,
        setEnviar,
        condicaoPagamento,
        setCondicaoPagamento,
        tipoPedido,
        setTipoPedido,
        vendedor,
        setVendedor,
        emailVendedor,
        setEmailVendedor,
        transportadora,
        setTransportadora,
        tipoFrete,
        setTipoFrete,
        situacao,
        optionsTipoFrete,
        optionsTipoCategoria,
        optionsEnviar,
        optionsFiscal,
        dadosTransportadora,
        dadosCondicoesPagamento,
        handleFechar,
        dadosFornecedores,
        dadosNfePedido,
        onSubmit,
    } = useCadastrarAlterarFornecedor({ handleClose, usuarioLogado, optionsModulos, handleClick });
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [compradorSelecionado, setCompradorSelecionado] = useState('');
    const [usoPrincipalSelecionado, setUsoPrincipalSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [saldoSelecionado, setSaldoSelecionado] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [filialSelecionada, setFilialSelecionada] = useState('');
    const [cnpjFilial, setCnpjFilial] = useState('');
    const [tipoNFESelecionada, setTipoNFESelecionada] = useState('');
    const [numeroNFE, setNumeroNFE] = useState('');
    const [serieNFE, setSerieNFE] = useState('');
    const [modeloNFE, setModeloNFE] = useState('');
    const [chaveNFE, setChaveNFE] = useState('');

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                cnpjFornecedor: cnpj,
                inscricaoEstadualFornecedor: inscricaoEstadual,
                inscricaoMunicipalFornecedor: inscricaoMunicipal,
                razaoSocialFornecedor: razaoSocial,
                nomeFantasiaFornecedor: nomeFantasia,
                cepFornecedor: cep,
                enderecoFornecedor: endereco,
                numeroFornecedor: numero,
                complementoFornecedor: complemento,
                bairroFornecedor: bairro,
                cidadeFornecedor: cidade,
                ufFornecedor: uf,
                numeroIBGEFornecedor: numeroIBGE,
                nomeRepresentanteFornecedor: nomeRepresentante,
                emailFornecedor: email,
                telefone1Fornecedor: telefone1,
                telefone2Fornecedor: telefone2,
                telefone3Fornecedor: telefone3,
                vendedorFornecedor: vendedor,
                emailVendedorFornecedor: emailVendedor,
                situacaoFornecedor: situacaoSelecionada,
                fiscalFornecedor: fiscal,
                enviarFornecedor: enviar,
                condicaoPagamentoFornecedor: condicaoPagamento,
                tipoPedidoFornecedor: tipoPedido,
                transportadoraFornecedor: transportadora,
                tipoFreteFornecedor: tipoFrete,

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
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Nº Pedido "}
                                                    name="razaoSocialFornecedor"
                                                    type="text"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                        <label>Comprador</label>

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
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Uso Principal</label>

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
                                        <label htmlFor="">Frete</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="tipoFreteFornecedor"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFreteFornecedor")
                                            }}
                                        />
                                        {errors.tipoFreteFornecedor && (
                                            <AlertError
                                                error={errors.tipoFreteFornecedor}
                                                onClose={clearErrors}
                                                fieldName="tipoFreteFornecedor"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <label>Status</label>

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
                                        <label htmlFor="">Saldo</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="tipoFreteFornecedor"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFreteFornecedor")
                                            }}
                                        />
                                        {errors.tipoFreteFornecedor && (
                                            <AlertError
                                                error={errors.tipoFreteFornecedor}
                                                onClose={clearErrors}
                                                fieldName="tipoFreteFornecedor"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-3 col-xl-3">
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Data Cadastro "}
                                                    name="razaoSocialFornecedor"
                                                    type="date"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                />
                                            )}
                                        />
                       
                                    </div>
                                    <div className="col-sm-3 col-xl-3">
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Data Emissão "}
                                                    name="razaoSocialFornecedor"
                                                    type="date"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                            name="tipoFreteFornecedor"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFreteFornecedor")
                                            }}
                                        />
                                        {errors.tipoFreteFornecedor && (
                                            <AlertError
                                                error={errors.tipoFreteFornecedor}
                                                onClose={clearErrors}
                                                fieldName="tipoFreteFornecedor"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"CNPJ Filial "}
                                                    name="razaoSocialFornecedor"
                                                    type="text"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                            name="tipoFreteFornecedor"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFreteFornecedor")
                                            }}
                                        />
                                        {errors.tipoFreteFornecedor && (
                                            <AlertError
                                                error={errors.tipoFreteFornecedor}
                                                onClose={clearErrors}
                                                fieldName="tipoFreteFornecedor"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-6 col-xl-6">
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Nº NF "}
                                                    name="razaoSocialFornecedor"
                                                    type="text"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Série NF "}
                                                    name="razaoSocialFornecedor"
                                                    type="text"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                            name="tipoFreteFornecedor"
                                            options={optionsTipoFrete.map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label
                                                }
                                            })}
                                            value={tipoFrete}
                                            onChange={(e) => {
                                                setTipoFrete(e)
                                                clearErrors("tipoFreteFornecedor")
                                            }}
                                        />
                                        {errors.tipoFreteFornecedor && (
                                            <AlertError
                                                error={errors.tipoFreteFornecedor}
                                                onClose={clearErrors}
                                                fieldName="tipoFreteFornecedor"
                                            />
                                        )}
                                    </div>
                                    <div className="col-sm-3 col-xl-4">
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Chave NF "}
                                                    name="razaoSocialFornecedor"
                                                    type="text"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                        <Controller
                                            name="razaoSocialFornecedor"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    label={"Observações "}
                                                    name="razaoSocialFornecedor"
                                                    type="textarea"
                                                    value={razaoSocial}
                                                    onChange={(e) => setRazaoSocial(e.target.value)}
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
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Total Antes do Desconto"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Desconto "}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Adiantamento Total "}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Despesas Adicionais "}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
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
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Imposto"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Valor de Imposto Retido"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Total a Pagar"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Valor Aplicado"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
                                                            errors={errors}
                                                            clearErrors={clearErrors}
                                                        />
                                                    )}
                                                />

                                            </div>

                                            <div className="col-sm-12 col-xl-12">
                                                <Controller
                                                    name="razaoSocialFornecedor"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormField
                                                            label={"Saldo"}
                                                            name="razaoSocialFornecedor"
                                                            type="text"
                                                            value={razaoSocial}
                                                            onChange={(e) => setRazaoSocial(e.target.value)}
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