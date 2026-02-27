import { Fragment } from "react"
import Select from 'react-select';
import { useIncluirProduto } from "./hooks/useIncluirProduto";
import { FooterModal } from "../../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../../Buttons/ButtonTypeModal";
import { useForm, Controller } from "react-hook-form";
import { schema } from "./schema/useProdutoSchema";
import FormField from "../../../../../Formularios/FormField";


export const FormularioIncluirProdutoPedido = ({
    usuarioLogado,
    optionsModulos,
    handleClose,
    dadosDetalhePedido,
    dadosDetalheGradePedido,
    dadosVisualizarPedido
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        nomeMarca,
        setNomeMarca,
        referenciaProduto,
        setReferenciaProduto,
        produtoSelecionado,
        setProdutoSelecionado,
        reposicaoSelecionado,
        setReposicaoSelecionado,
        descricaoProduto,
        setDescricaoProduto,
        vrCusto,
        setVrCusto,
        vrVenda,
        setVrVenda,
        quantidade,
        setQuantidade,
        quantidadeCaixa,
        setQuantidadeCaixa,
        referencia,
        setReferencia,
        fabricanteSelecionado,
        setFabricanteSelecionado,
        unidadeSelecionada,
        setUnidadeSelecionada,
        corSelecionada,
        setCorSelecionada,
        tipoTecidoSelecionado,
        setTipoTecidoSelecionado,
        categoriaGradeSelecionada,
        setCategoriaGradeSelecionada,
        categoriaSelecionada,
        setCategoriaSelecionada,
        estruturaSelecionada,
        setEstruturaSelecionada,
        estiloSelecionado,
        setEstiloSelecionado,
        localExposicaoSelecionado,
        setLocalExposicaoSelecionado,
        ecommerceSelecionado,
        setEcommerceSelecionado,
        redeSocialSelecionada,
        setRedeSocialSelecionada,
        vrBruto,
        setVrBruto,
        percDescontoI,
        setPercDescontoI,
        percDescontoII,
        setPercDescontoII,
        percDescontoIII,
        setPercDescontoIII,
        vrLiquido,
        setVrLiquido,
        vrSugerido,
        setVrSugerido,
        vrTotal,
        setVrTotal,
        observacao,
        setObservacao,
        dadosCores,
        dadosUnidadeMedida,
        dadosTipoTecidos,
        dadosCategoriaPedidos,
        dadosCategoriasProdutos,
        dadosSubGrupoProduto,
        dadosFabricantePedido,
        dadosLocalExposicao,
        dadosGrade,
        dadosProdutosPedidos,
        optionsCadastro,
        optionsReposicao,
        atualiza_valor_QtdUnit,
        vrSugerigoFixo,
        setVrSugerigoFixo,
        formatarNumero,
        converterParaNumero,
        onSubmit,
    } = useIncluirProduto({ usuarioLogado, optionsModulos, dadosDetalhePedido, dadosDetalheGradePedido, dadosVisualizarPedido });


    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                nomeMarcaPedido: nomeMarca,
                referenciaProdutoPedido: referenciaProduto,
                descricaoProdutoPedido: descricaoProduto,
                vrHojeCusto: vrCusto,
                vrVendaHoje: vrVenda,
                qtd: quantidade,
                qtdCaixa: quantidadeCaixa,
                referenciaProduto: referencia,
                estrututraProduto: estruturaSelecionada,
                estiloProduto: estiloSelecionado,
                vrBrutoProduto: vrBruto,
                descProdI: percDescontoI,
                descProdII: percDescontoII,
                descProdIII: percDescontoIII,
                vrUnitLiquidoProduto: vrLiquido,
                vrUnitSugeridoProduto: vrSugerido,
                vrTotalProduto: vrTotal,
                observacaoProduto: observacao,
            }

            await schema.validate(dadosParaValidar, { abortEarly: false });

            onSubmit();

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
                <div className="form-group">

                    <div className="row">
                        <div className="col-sm-12 col-xl-12">
                            <Controller
                                name="nomeMarcaPedido"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Pedido para a Marca"}
                                        name="nomeMarcaPedido"
                                        type="text"
                                        value={nomeMarca}
                                        onChange={(e) => setNomeMarca(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        readOnly
                                    />

                                )}
                            />
                       
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="strep">Reposição</label>
                            <Select
                                id={"stReposicao"}
                                value={reposicaoSelecionado}
                                options={optionsReposicao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setReposicaoSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="strep">Tipo de Cadastro</label>
                            <Select
                                id={"stReposicao"}
                                value={reposicaoSelecionado}
                                options={optionsCadastro.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setReposicaoSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="referenciaProdutoPedido"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Pesquisar Referencia/Produto"}
                                        name="referenciaProdutoPedido"
                                        type="text"
                                        value={referenciaProduto}
                                        onChange={(e) => setReferenciaProduto(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="tpunid">Produtos Cadastrados / Cod Barras - Nome</label>
                            <Select
                                id={"listprodpesqped"}
                                value={produtoSelecionado}
                                options={dadosProdutosPedidos.map((item) => {
                                    return {
                                        value: item.IDPRODUTO,
                                        label: `${item.NUCODBARRAS} - ${item.DSNOME}`
                                    }
                                })}
                                onChange={(e) => setProdutoSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="descricaoProdutoPedido"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Descrição Produto"}
                                        name="descricaoProdutoPedido"
                                        type="text"
                                        value={descricaoProduto}
                                        onChange={(e) => setDescricaoProduto(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />

                        </div>
                        <div className="col-sm-3 col-xl-2">
                            <Controller 
                                name="vrHojeCusto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Custo"}
                                        name="vrHojeCusto"
                                        type="text"
                                        value={vrCusto}
                                        onChange={(e) => setVrCusto(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-2">
                            <Controller 
                                name="vrVendaHoje"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Venda"}
                                        name="vrVendaHoje"
                                        type="text"
                                        value={vrVenda}
                                        onChange={(e) => setVrVenda(e.target.value)}
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
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="qtd"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Quantidade"}
                                        name="qtd"
                                        type="text"
                                        value={quantidade}
                                        onChange={(e) => {
                                            setQuantidade(e.target.value);
                                            atualiza_valor_QtdUnit();
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="qtdCaixa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"QTD Caixas"}
                                        name="qtdCaixa"
                                        type="text"
                                        value={quantidadeCaixa}
                                        onChange={(e) => setQuantidadeCaixa(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="referenciaProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Referência"}
                                        name="referenciaProduto"
                                        type="text"
                                        value={referencia}
                                        onChange={(e) => setReferencia(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="nofab">Fabricante</label>

                            <Select
                                id={"fabricanteProduto"}
                                value={fabricanteSelecionado}
                                options={dadosFabricantePedido.map((item) => {
                                    return {
                                        value: item.IDFABRICANTE,
                                        label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                                    }
                                })}
                                onChange={(e) => setFabricanteSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-4">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                id={"unidadeProduto"}
                                value={unidadeSelecionada}
                                options={dadosUnidadeMedida.map((item) => {
                                    return {
                                        value: item.IDUNIDADEMEDIDA,
                                        label: item.DSSIGLA
                                    }
                                })}
                                onChange={(e) => setUnidadeSelecionada(e)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <Select
                                id={"corProduto"}
                                value={corSelecionada}
                                options={dadosCores.map((item) => {
                                    return {
                                        value: item.ID_COR,
                                        label: item.DS_COR
                                    }
                                })}
                                onChange={(e) => setCorSelecionada(e)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <label className="form-label" htmlFor="tptecido">Tipo de Tecido</label>
                            <Select
                                id={"tpTecidoProduto"}
                                value={tipoTecidoSelecionado}
                                options={optionsReposicao.map((item) => {
                                    return {
                                        value: item.IDTPTECIDO,
                                        label: item.DSTIPOTECIDO
                                    }
                                })}
                                onChange={(e) => setTipoTecidoSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-4 col-xl-4">
                            <label className="form-label" htmlFor="tpcat">Categoria Grade</label>
                            <Select
                                id={"categoriaProduto"}
                                value={categoriaGradeSelecionada}
                                options={optionsReposicao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setCategoriaGradeSelecionada(e)}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <Controller 
                                name="estrututraProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Estrutura"}
                                        name="estrututraProduto"
                                        type="text"
                                        value={estruturaSelecionada}
                                        onChange={(e) => setEstruturaSelecionada(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-4 col-xl-4">
                            <Controller 
                                name="estiloProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Estilos"}
                                        name="estiloProduto"
                                        type="text"
                                        value={estiloSelecionado}
                                        onChange={(e) => setEstiloSelecionado(e.target.value)}
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
                        <div className="col-sm-3 col-xl-3">
                            <label className="form-label" htmlFor="tpcatprod">Categorias</label>
                            <Select
                                id={"CategoriaProduto"}
                                value={categoriaSelecionada}
                                options={dadosCategoriaPedidos.map((item) => {
                                    return {
                                        value: item.IDCATEGORIAS,
                                        label: `${item.IDCATEGORIAS} - ${item.DSCATEGORIAS} - ${item.TPCATEGORIAS}`
                                    }
                                })}
                                onChange={(e) => setCategoriaSelecionada(e)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>

                            <Select
                                id={"localExposicao"}
                                value={localExposicaoSelecionado}
                                options={dadosLocalExposicao.map((item) => {
                                    return {
                                        value: item.IDLOCALEXPOSICAO,
                                        label: item.DSLOCALEXPOSICAO
                                    }
                                })}
                                onChange={(e) => setLocalExposicaoSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <label className="form-label" htmlFor="ecommercest">E-commerce</label>

                            <Select
                                id={"localExposicao"}
                                value={ecommerceSelecionado}
                                options={optionsReposicao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setEcommerceSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-3 col-xl-3">
                            <label className="form-label" htmlFor="redesocialst">Rede Social</label>

                            <Select
                                id={"localExposicao"}
                                value={redeSocialSelecionada}
                                options={optionsReposicao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setRedeSocialSelecionada(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="vrBrutoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Bruto"}
                                        name="vrBrutoProduto"
                                        type="text"
                                        value={vrBruto}
                                        onChange={(e) => {
                                            setVrBruto(e.target.value);
                                            // Chama o cálculo após um pequeno delay para evitar conflitos
                                            setTimeout(() => atualiza_valor_QtdUnit(), 100);
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="descProdI"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Desconto I (%)"}
                                        name="descProdI"
                                        type="text"
                                        value={percDescontoI}
                                        onChange={(e) => {
                                            setPercDescontoI(e.target.value);
                                            // Chama o cálculo após um pequeno delay para evitar conflitos
                                            setTimeout(() => atualiza_valor_QtdUnit(), 100);
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="descProdII"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Desconto II (%)"}
                                        name="descProdII"
                                        type="text"
                                        value={percDescontoII}
                                        onChange={(e) => {
                                            setPercDescontoII(e.target.value);
                                            // Chama o cálculo após um pequeno delay para evitar conflitos
                                            setTimeout(() => atualiza_valor_QtdUnit(), 100);
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="descProdIII"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Desconto III (%)"}
                                        name="descProdIII"
                                        type="text"
                                        value={percDescontoIII}
                                        onChange={(e) => {
                                            setPercDescontoIII(e.target.value);
                                            // Chama o cálculo após um pequeno delay para evitar conflitos
                                            setTimeout(() => atualiza_valor_QtdUnit(), 100);
                                        }}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="vrUnitLiquidoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Líquido"}
                                        name="vrUnitLiquidoProduto"
                                        type="text"
                                        value={vrLiquido}
                                        onChange={(e) => setVrLiquido(e.target.value)}
                                        
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
     
                        </div>
                        <div className="col-sm-2 col-xl-2">
                            <Controller 
                                name="vrUnitSugeridoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Sugerido"}
                                        name="vrUnitSugeridoProduto"
                                        type="text"
                                        value={vrSugerido}
                                        onChange={(e) => {
                                            setVrSugerido(e.target.value);
                                            setVrSugerigoFixo(e.target.value); // Define como valor fixo quando editado manualmente
                                        }}
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
                        <div className="col-sm-4 col-xl-4">
                            <Controller 
                                name="vrTotalProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"VR Total"}
                                        name="vrTotalProduto"
                                        type="text"
                                        value={vrTotal}
                                        onChange={(e) => setVrTotal(e.target.value)}
                                        readOnly
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-8 col-xl-8">
                            <Controller 
                                name="observacaoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Observação"}
                                        name="observacaoProduto"
                                        type="text"
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value)}
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
                        <div className="col-sm-12 col-xl-12">
                            <label className="form-label" htmlFor="vrtotalunit">QTD/TAMANHOS</label>
                        </div>
                    </div>
                    <div className="row" id="resultadoqtdtamanhos">
                        <div class="col-sm-1 col-xl-1">
                            <label  className="form-label" for="">DSTAMANHO</label>
                            <div class="input-group">
                                <input 
                                    type="text" 
                                    id="" 
                                    name="" 
                                    value="" 
                                    title="" 
                                    className="form-control class_grade" 
                                    disabled 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-12 col-xl-12">
                            <div id="tudo"></div>
                        </div>
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}