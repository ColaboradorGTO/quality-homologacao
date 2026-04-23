import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./Schema/schemaValidation";
import { useCadastrarProdutoAvulso } from "../hooks/useCadastrarProdutoAvulso"
import { SelectList } from "../../../../Buttons/menuList";

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        quantidade,
        setQuantidade,
        referencia,
        setReferencia,
        codBarras,
        setCodBarras,
        descricao,
        setDescricao,
        fornecedor,
        setFornecedor,
        fabricante,
        setFabricante,
        estrutura,
        setEstrutura,
        estilo,
        setEstilo,
        vrCusto,
        setVrCusto,
        vrVenda,
        setVrVenda,
        categoriaProdutoSelecionado,
        setCategoriaProdutoSelecionado,
        tamanhoSelecionado,
        setTamanhoSelecionado,
        unidadeSelecionada,
        setUnidadeSelecionada,
        corSelecionada,
        setCorSelecionada,
        tipoTecidoSelecionado,
        setTipoTecidoSelecionado,
        categoriaSelecionada,
        setCategoriaSelecionada,
        localExposicaoSelecionado,
        setLocalExposicaoSelecionado,
        ecommerceSelecionado,
        setEcommerceSelecionado,
        redeSocialSelecionado,
        setRedeSocialSelecionado,
        ncmSelecionado,
        setNcmSelecionado,
        tipoProdutoSelecionado,
        setTipoProdutoSelecionado,
        tipoFiscalSelecionado,
        estoque, 
        setEstoque,
        setTipoFiscalSelecionado,
        marcaSelecionada,
        setMarcaSelecionada,
        referenciaProduto,
        setReferenciaProduto,
        produtoPesquisado,
        setProdutoPesquisado,
        dadosUnidadeMedida,
        dadosTamanhos,
        dadosCores,
        dadosTipoTecidos,
        dadosCategoriasProdutos,
        dadosLocalExposicao,
        dadosTipoProdutos,
        dadosTipoFiscalProdutos,
        dadosFornecedores,
        dadosFabricantes,
        dadosSubGrupoProduto,
        dadosNCM,
        dadosVinculoEstiloGrupo,
        dadosMarcas,
        dadosProdutosPedido,
        onSubmit
    } = useCadastrarProdutoAvulso({usuarioLogado, optionsModulos, handleClose})



    const optionsCategoriaProduto = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALÇADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
        { value: 'ACESSORIOS', label: 'ACESSÓRIOS' }
    ]

    const optionsEcommerce = [
        { value: 'True', label: 'SIM' },
        { value: 'False', label: 'NÃO' }
    ]

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoPedido: descricao,
                fornecedorProduto: fornecedor,
                tamanhoProduto: tamanhoSelecionado,
                fabricanteProduto: fabricante,
                unidadeProduto: unidadeSelecionada,
                corProduto: corSelecionada,
                tecidoProduto: tipoTecidoSelecionado,
                estruturaProduto: estrutura,
                estiloProduto: estilo,
                categoriaProduto: categoriaProdutoSelecionado,
                vrCustoProduto: vrCusto,
                vrVendaProduto: vrVenda,
                ncmProduto: ncmSelecionado,
                tipoProduto: tipoProdutoSelecionado,
                tipoFiscalProduto: tipoFiscalSelecionado,
                barraProduto: codBarras

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

    }

     const menuHeaderStyle = {
        padding: "8px 12px",
        background: "#7a59ad",
        color: "#ffffff",
        fontSize: "14px",
    };

    const formatSelectGroup = (data) => {
        const grupos = {};

        data.forEach((item) => {
            if (!grupos[item.DS_GRUPO]) {
            grupos[item.DS_GRUPO] = {
                label: item.DS_GRUPO,
                options: []
            };
            }

            grupos[item.DS_GRUPO].options.push({
            value: item.ID_ESTRUTURA,
            label: item.ESTRUTURA,
            original: item
            });
        });

        return Object.values(grupos);
    };

    const formatSelectCor = (data) => {
        const grupos = {};

        data.forEach((item) => {
            if (!grupos[item.DS_GRUPOCOR]) {
            grupos[item.DS_GRUPOCOR] = {
                label: item.DS_GRUPOCOR,
                options: []
            };
            }

            grupos[item.DS_GRUPOCOR].options.push({
            value: item.ID_COR,
            label: item.DS_COR,
            original: item
            });
        });

        return Object.values(grupos);
    };

    /*
        Voltar daqui amanhã para finalizar esta modal e todos os select relacionada a ela.
    */
    return (
        <Fragment>
            <form>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tppedido">Marca do Grupo</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="marcaGrupoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosMarcas?.map((item) => {
                                        return {
                                            value: item.IDGRUPOEMPRESARIAL,
                                            label: item.DSGRUPOEMPRESARIAL
                                        }
                                    })]}
                                value={marcaSelecionada}
                                onChange={(e) => {
                                    setMarcaSelecionada(e)
                                    clearErrors('marcaGrupoProduto')
                                }}
                            />
                            {errors.marcaGrupoProduto && (
                                <AlertError
                                    error={errors.marcaGrupoProduto}
                                    onClose={clearErrors}
                                    fieldName="marcaGrupoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <Controller
                                name="referenciaProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="referenciaProduto"
                                        label={"Pesquisar Referência/Produto"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={referenciaProduto}
                                        onChangeModal={(e) => setReferenciaProduto(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="tppedido">Lista dos Produtos da Pesquisa</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosProdutosPedido?.map((item) => {
                                        return {
                                            value: item.DSNOME,
                                            label: item.DSNOME
                                        }
                                    })]}
                                value={categoriaProdutoSelecionado}
                                onChange={(e) => {
                                    setCategoriaProdutoSelecionado(e)
                                    clearErrors('categoriaProduto')
                                }}
                            />
                            {errors.categoriaProduto && (
                                <AlertError
                                    error={errors.categoriaProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-group">

                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="qtdProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="qtdProduto"
                                        label={"Quantidade "}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={quantidade}
                                        onChangeModal={(e) => setQuantidade(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="refProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="refProduto"
                                        label={"Referência "}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={referencia}
                                        onChangeModal={(e) => setReferencia(e.target.value)}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="descProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descProduto"
                                        label={"Descrição Produto"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={descricao}
                                        onChangeModal={(e) => setDescricao(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tppedido">Categoria Produto</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={categoriaProdutoSelecionado}
                                onChange={(e) => {
                                    setCategoriaProdutoSelecionado(e)
                                    clearErrors('categoriaProduto')
                                }}
                            />
                            {errors.categoriaProduto && (
                                <AlertError
                                    error={errors.categoriaProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="notam">Tamanho</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tamanhoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosTamanhos?.map((item) => {
                                        return {
                                            value: item.IDTAMANHO,
                                            label: item.DSTAMANHO
                                        }
                                    })]}
                                value={tamanhoSelecionado}
                                onChange={(e) => {
                                    setTamanhoSelecionado(e)
                                    clearErrors('tamanhoProduto')
                                }}
                            />
                            {errors.tamanhoProduto && (
                                <AlertError
                                    error={errors.tamanhoProduto}
                                    onClose={clearErrors}
                                    fieldName="tamanhoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-5">
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
                                value={fornecedor}
                                onChange={(e) => {
                                    setFornecedor(e)
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
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="notam">Fabricante</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="fabricanteProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosFabricantes?.map((item) => {
                                        return {
                                            value: item.IDFABRICANTE,
                                            label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                                        }
                                    })]}
                                value={fabricante}
                                onChange={(e) => {
                                    setFabricante(e)
                                    clearErrors('fabricanteProduto')
                                }}
                            />
                            {errors.fabricanteProduto && (
                                <AlertError
                                    error={errors.fabricanteProduto}
                                    onClose={clearErrors}
                                    fieldName="fabricanteProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="unidadeProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosUnidadeMedida?.map((item) => {
                                        return {
                                            value: item.IDUNIDADEMEDIDA,
                                            label: item.DSSIGLA
                                        }
                                    })]}
                                value={unidadeSelecionada}
                                onChange={(e) => {
                                    setUnidadeSelecionada(e)
                                    clearErrors('unidadeProduto')
                                }}
                            />
                            {errors.unidadeProduto && (
                                <AlertError
                                    error={errors.unidadeProduto}
                                    onClose={clearErrors}
                                    fieldName="unidadeProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <SelectList
                                name={"corProduto"}
                                value={corSelecionada}
                                options={formatSelectCor(dadosCores)}
                                menuHeaderTitle={"Selecione"}
                                menuHeaderStyle={menuHeaderStyle}
                                onChange={(e) => setCorSelecionada(e)}
                                
                            />
                            {errors.corProduto && (
                                <AlertError
                                    error={errors.corProduto}
                                    onClose={clearErrors}
                                    fieldName="corProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tptecidoav">Tipo de Material</label>
                          
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoTecidoProduto"
                                value={tipoTecidoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosTipoTecidos?.map((item) => {
                                        return {
                                            value: item.IDTIPOTECIDO,
                                            label: item.DSTIPOTECIDO
                                        }
                                    })]}
                                onChange={(e) => {
                                    setTipoTecidoSelecionado(e)
                                    clearErrors('tipoTecidoProduto')
                                }}
                            />
                            {errors.tipoTecidoProduto && (
                                <AlertError
                                    error={errors.tipoTecidoProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoTecidoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                             <label className="form-label" htmlFor="tptecidoav">Estrutura</label>
                            <SelectList
                                id={"tipoTecidoProduto"}
                                value={estrutura}
                                options={formatSelectGroup(dadosSubGrupoProduto)}
                                menuHeaderTitle={"Selecione"}
                                menuHeaderStyle={menuHeaderStyle}
                                onChange={(e) => setEstrutura(e)}
                                
                            />
                            {errors.estruturaProduto && (
                                <AlertError
                                    error={errors.estruturaProduto}
                                    onClose={clearErrors}
                                    fieldName="estruturaProduto"
                                />
                            )} 
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpcats">Estilos</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="estiloProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosVinculoEstiloGrupo?.map((item) => {
                                        return {
                                            value: item.IDESTILO,
                                            label: `${item.IDESTILO} - ${item.DSESTILO}`
                                        }
                                    })]}
                                value={estilo}
                                onChange={(e) => {
                                    setEstilo(e)
                                    clearErrors('estiloProduto')
                                }}
                            />
                            {errors.estiloProduto && (
                                <AlertError
                                    error={errors.estiloProduto}
                                    onClose={clearErrors}
                                    fieldName="estiloProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcats">Categorias</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosCategoriasProdutos?.map((item) => {
                                        return {
                                            value: item.IDCATEGORIAS,
                                            label: `${item.IDCATEGORIAS} - ${item.DSCATEGORIAS} - ${item.TPCATEGORIAS}`
                                        }
                                    })]}
                                value={categoriaSelecionada}
                                onChange={(e) => {
                                    setCategoriaSelecionada(e)
                                    clearErrors('categoriaProduto')
                                }}
                            />
                            {errors.categoriaProduto && (
                                <AlertError
                                    error={errors.categoriaProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-4">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="localExposicaoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosLocalExposicao?.map((item) => {
                                        return {
                                            value: item.IDLOCALEXPOSICAO,
                                            label: item.DSLOCALEXPOSICAO
                                        }
                                    })]}
                                value={localExposicaoSelecionado}
                                onChange={(e) => {
                                    setLocalExposicaoSelecionado(e)
                                    clearErrors('localExposicaoProduto')
                                }}
                            />
                            {errors.localExposicaoProduto && (
                                <AlertError
                                    error={errors.localExposicaoProduto}
                                    onClose={clearErrors}
                                    fieldName="localExposicaoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="ecommercest">E-commerce</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="ecommerceProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={ecommerceSelecionado}
                                onChange={(e) => {
                                    setEcommerceSelecionado(e)
                                    clearErrors('ecommerceProduto')
                                }}
                            />
                            {errors.ecommerceProduto && (
                                <AlertError
                                    error={errors.ecommerceProduto}
                                    onClose={clearErrors}
                                    fieldName="ecommerceProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="redesocialst">Rede Social</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="redeSocialProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={redeSocialSelecionado}
                                onChange={(e) => {
                                    setRedeSocialSelecionado(e)
                                    clearErrors('redeSocialProduto')
                                }}
                            />
                            {errors.redeSocialProduto && (
                                <AlertError
                                    error={errors.redeSocialProduto}
                                    onClose={clearErrors}
                                    fieldName="redeSocialProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="vrCustoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="vrCustoProduto"
                                        label={"Vr Custo"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={vrCusto}
                                        onChangeModal={(e) => setVrCusto(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="vrVendaProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="vrVendaProduto"
                                        label={"Vr Venda"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={vrVenda}
                                        onChangeModal={(e) => setVrVenda(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpncm">NCM</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="ncmProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosNCM?.map((item) => {
                                        return {
                                            value: item.NUNCM,
                                            label: item.NUNCM
                                        }
                                    })]}
                                value={ncmSelecionado}
                                onChange={(e) => {
                                    setNcmSelecionado(e)
                                    clearErrors('ncmProduto')
                                }}
                            />
                            {errors.ncmProduto && (
                                <AlertError
                                    error={errors.ncmProduto}
                                    onClose={clearErrors}
                                    fieldName="ncmProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpprod">Tipo Produto</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosTipoProdutos.map((item) => {
                                        return {
                                            value: item.IDTIPOPRODUTO,
                                            label: `${item.CODTIPOPRODUTO} - ${item.DSTIPOPRODUTO}`
                                        }
                                    })]}
                                value={tipoProdutoSelecionado}
                                onChange={(e) => {
                                    setTipoProdutoSelecionado(e)
                                    clearErrors('tipoProduto')
                                }}
                            />
                            {errors.tipoProduto && (
                                <AlertError
                                    error={errors.tipoProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="tpfiscal">Tipo Fiscal</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoFiscalProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosTipoFiscalProdutos?.map((item) => {
                                        return {
                                            value: item.IDTIPOFISCALPRODUTO,
                                            label: `${item.CODTIPOFISCALPRODUTO} - ${item.DSTIPOFISCALPRODUTO}`
                                        }
                                    })]}
                                value={tipoFiscalSelecionado}
                                onChange={(e) => {
                                    setTipoFiscalSelecionado(e)
                                    clearErrors('tipoFiscalProduto')
                                }}
                            />
                            {errors.tipoFiscalProduto && (
                                <AlertError
                                    error={errors.tipoFiscalProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoFiscalProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="row">
                        <p>
                            PRÉVIA DO PRODUTO
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                        >
                            Prévia do Produto Avulso    
                        </button> 
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleValidatedSubmit}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}