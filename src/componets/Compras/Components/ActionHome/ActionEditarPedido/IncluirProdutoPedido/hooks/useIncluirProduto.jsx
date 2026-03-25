import { useEffect, useState } from "react";
import { get } from "../../../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { toFloat } from "../../../../../../../utils/toFloat";
import { set } from "date-fns";



export const useIncluirProduto = ({ 
    usuarioLogado, 
    optionsModulos,
    dadosDetalhePedido,
    dadosDetalheGradePedido,
    dadosVisualizarPedido,
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [nomeMarca, setNomeMarca] = useState('')
    const [referenciaProduto, setReferenciaProduto] = useState('')
    const [produtoSelecionado, setProdutoSelecionado] = useState('')
    const [reposicaoSelecionado, setReposicaoSelecionado] = useState('')
    const [descricaoProduto, setDescricaoProduto] = useState('')
    const [vrCusto, setVrCusto] = useState('')
    const [vrVenda, setVrVenda] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [quantidadeCaixa, setQuantidadeCaixa] = useState('')
    const [referencia, setReferencia] = useState('')
    const [fabricanteSelecionado, setFabricanteSelecionado] = useState('')
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('')
    const [corSelecionada, setCorSelecionada] = useState('')
    const [tipoTecidoSelecionado, setTipoTecidoSelecionado] = useState('')
    const [categoriaGradeSelecionada, setCategoriaGradeSelecionada] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
    const [estruturaSelecionada, setEstruturaSelecionada] = useState('')
    const [estiloSelecionado, setEstiloSelecionado] = useState('')
    const [localExposicaoSelecionado, setLocalExposicaoSelecionado] = useState('')
    const [ecommerceSelecionado, setEcommerceSelecionado] = useState('')
    const [redeSocialSelecionada, setRedeSocialSelecionada] = useState('')
    const [vrBruto, setVrBruto] = useState('')
    const [percDescontoI, setPercDescontoI] = useState('')
    const [percDescontoII, setPercDescontoII] = useState('')
    const [percDescontoIII, setPercDescontoIII] = useState('')
    const [vrLiquido, setVrLiquido] = useState('')
    const [vrSugerido, setVrSugerido] = useState('')
    const [vrSugerigoFixo, setVrSugerigoFixo] = useState('')
    const [vrTotal, setVrTotal] = useState('')
    const [observacao, setObservacao] = useState('')
    const [idResumoPedido, setIdResumoPedido] = useState('')
    const [stPedidoPorIntermediario, setStPedidoPorIntermediario] = useState('')
    const [cadastroSelecionado, setCadastroSelecionado] = useState('')
    const [obsFornecedor, setObsFornecedor] = useState('')

    const { data: dadosCores = [], error: errorCores, isLoading: isLoadingCores, refetch: refetchCores } = useQuery(
        'listaCores',
        async () => { const response = await get(`/listaCores`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosUnidadeMedida = [], error: errorUnidadeMedida, isLoading: isLoadingUnidadeMedida, refetch: refetchUnidadeMedida } = useQuery(
        'unidadeMedida',
        async () => { const response = await get(`/unidadeMedida`); return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosTipoTecidos  = [], error: errorTipoTecidos, isLoading: isLoadingTipoTecidos, refetch: refetchTipoTecidos } = useQuery(
        'tipo-tecido',
        async () => { const response = await get(`/tipo-tecido`);  return response.data },  
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosCategoriaPedidos  = [], error: errorCategoriaPedidos, isLoading: isLoadingCategoriaPedidos, refetch: refetchCategoriaPedidos } = useQuery(
        'categoria-pedido',
        async () => { const response = await get(`/categoria-pedido?idCategoriaPedido=${dadosDetalhePedido[0]?.IDCATEGORIAPEDIDO}`); return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    
    const { data: dadosCategoriasProdutos  = [], error: errorCategoriasProdutos, isLoading: isLoadingCategoriasProdutos, refetch: refetchCategoriasProdutos } = useQuery(
        'categoriasProdutos',
        async () => { const response = await get(`/categoriasProdutos?idTipoPedido=${dadosDetalhePedido[0]?.IDTIPOPEDIDO}`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
   
    const { data: dadosSubGrupoProduto  = [], error: errorSubGrupoProduto, isLoading: isLoadingSubGrupoProduto, refetch: refetchSubGrupoProduto } = useQuery(
        'subgrupo-produto',
        async () => { const response = await get(`/subgrupo-produto`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosFabricantePedido  = [], error: errorFabricantePedido, isLoading: isLoadingFabricantePedido, refetch: refetchFabricantePedido } = useQuery(
        'vincularFabricanteFornecedor',
        async () => { const response = await get(`/vincularFabricanteFornecedor?idFornecedorPedido=${dadosDetalhePedido[0]?.IDFORNECEDOR}`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    const { data: dadosLocalExposicao  = [], error: errorLocalExposicao, isLoading: isLoadingLocalExposicao, refetch: refetchLocalExposicao } = useQuery(
        'localExposicao',
        async () => { const response = await get(`/localExposicao`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    const { data: dadosGrade  = [], error: errorGrade, isLoading: isLoadingGrade, refetch: refetchGrade } = useQuery(
        'vinculo-tamanho-categoria',
        async () => { const response = await get(`/vinculo-tamanho-categoria`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosProdutosPedidos  = [], error: errorProdutosPedidos, isLoading: isLoadingProdutosPedidos, refetch: refetchProdutosPedidos } = useQuery(
        'produtos-pedido',
        async () => { const response = await get(`/produtos-pedido?referenciaProduto=${referenciaProduto}&fornecedorPedido=`);  return response.data},
        { enabled: referenciaProduto.length > 4, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipwho.is:", error);
        }

        if (!usuarioIP) {
            try {
                const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
                usuarioIP = ipifyData?.ip;
            } catch (error) {
                console.error("Erro ao buscar IP via ipify.org:", error);
            }
        }
        setIpUsuario(usuarioIP);
        return usuarioIP;
    };

    const optionsCadastro = [
        { value: 'False', label: 'NORMAL'},
        { value: 'True', label: 'POR REFERÊNCIA' },
    ]
    
    const optionsReposicao = [
        { value: 'True', label: 'SIM' },
        { value: 'False', label: 'NÃO' }
    ]

    // Função utilitária para formatar números
    const formatarNumero = (valor, decimais = 2) => {
        if (valor === '' || valor === null || valor === undefined) return '';
        const numero = parseFloat(valor);
        if (isNaN(numero)) return '';
        return numero.toLocaleString('pt-BR', { 
            style: 'decimal', 
            minimumFractionDigits: decimais,
            maximumFractionDigits: decimais
        });
    };

    // Função utilitária para converter string brasileira em número
    const converterParaNumero = (valor) => {
        if (!valor || valor === '') return 0;
        // Remove pontos de milhares e substitui vírgula por ponto
        const valorLimpo = valor.toString().replace(/\./g, '').replace(',', '.');
        const numero = parseFloat(valorLimpo);
        return isNaN(numero) ? 0 : numero;
    };

    const atualiza_valor_QtdUnit = () => {
        // Garantir que todos os campos tenham valores padrão
        const descI = converterParaNumero(percDescontoI) || 0;
        const descII = converterParaNumero(percDescontoII) || 0;
        const descIII = converterParaNumero(percDescontoIII) || 0;
        const vrUnitBruto = converterParaNumero(vrBruto) || 0;
        const qtdProdPedido = converterParaNumero(quantidade) || 0;
        const vrSug = converterParaNumero(vrSugerido) || 0;
        const vrSugFixo = converterParaNumero(vrSugerigoFixo) || 0;

        // Calcular descontos em cascata
        let valorComDesconto = vrUnitBruto;

        // Primeiro desconto
        if (descI > 0) {
            valorComDesconto = valorComDesconto - (valorComDesconto * (descI / 100));
        }

        // Segundo desconto
        if (descII > 0) {
            valorComDesconto = valorComDesconto - (valorComDesconto * (descII / 100));
        }

        // Terceiro desconto
        if (descIII > 0) {
            valorComDesconto = valorComDesconto - (valorComDesconto * (descIII / 100));
        }

        // Atualizar valor líquido (só formatar se não estiver vazio)
        setVrLiquido(valorComDesconto.toFixed(2).replace('.', ','));

        // Calcular valor total (quantidade * valor líquido)
        const valorTotal = valorComDesconto * qtdProdPedido;
        setVrTotal(valorTotal.toFixed(2).replace('.', ','));

        // Calcular valor de venda sugerido
        if (vrSugFixo === 0) {
            // Se não tem valor fixo, calcular 2.5x o valor líquido
            const vrVendaSugerida = valorComDesconto * 2.5;
            setVrSugerido(vrVendaSugerida.toFixed(2).replace('.', ','));
        } else {
            // Se tem valor fixo, usar o valor fixo
            setVrSugerido(vrSugFixo.toFixed(2).replace('.', ','));
        }
    };

      useEffect(() => {
        if(dadosDetalhePedido && dadosDetalhePedido.length > 0) {
          
          console.log(dadosDetalhePedido[0], '')
          setNomeMarca(dadosDetalhePedido[0]?.NOFANTASIA)
          setReposicaoSelecionado({
            value: dadosDetalhePedido[0]?.STREPOSICAO, 
            label:  dadosDetalhePedido[0]?.STREPOSICAO == 'True' ? 'SIM' : 'NÃO'
          })
          setCadastroSelecionado({
            value: dadosDetalhePedido[0]?.STREPOSICAO, 
            label:  dadosDetalhePedido[0]?.STREPOSICAO == 'True' ? 'POR REFERÊNCIA' : 'NORMAL'
          })
          
          setDescricaoProduto(dadosDetalhePedido[0]?.DSPRODUTO)
          setVrCusto(toFloat(dadosDetalhePedido[0]?.VRCUSTOPRODATUAL))
          setVrVenda(toFloat(dadosDetalhePedido[0]?.VRVENDAPRODATUAL))
          setQuantidade(toFloat(dadosDetalhePedido[0]?.QTDTOTAL))
          setQuantidadeCaixa(toFloat(dadosDetalhePedido[0]?.NUCAIXA))
          setReferencia(dadosDetalhePedido[0]?.NUREF)
          setFabricanteSelecionado({value: dadosDetalhePedido[0]?.IDFABRICANTE, label: ` ${dadosDetalhePedido[0]?.IDFABRICANTE} - ${dadosDetalhePedido[0]?.DSFABRICANTE}`})
          setUnidadeSelecionada({value: dadosDetalhePedido[0]?.IDUNIDADEMEDIDA, label: dadosDetalhePedido[0]?.DSSIGLA})
          setCorSelecionada({value: dadosDetalhePedido[0]?.IDCOR, label: dadosDetalhePedido[0]?.DSCOR})
          setTipoTecidoSelecionado({value: dadosDetalhePedido[0]?.IDTIPOTECIDO, label: dadosDetalhePedido[0]?.DSTIPOTECIDO})
            setCategoriaGradeSelecionada({
                value: dadosDetalhePedido[0]?.IDCATEGORIAGRADE, 
                label: `${dadosDetalhePedido[0]?.TPCATEGORIAPRODPEDIDO} - ${dadosDetalhePedido[0]?.DSCATEGORIAPEDIDO}`
            })
            setEstruturaSelecionada({value: dadosDetalhePedido[0]?.IDSUBGRUPOESTRUTURA, label: dadosDetalhePedido[0]?.DSSUBGRUPOESTRUTURA})
            setEstiloSelecionado({value: dadosDetalhePedido[0]?.IDESTILO, label: dadosDetalhePedido[0]?.DSESTILO})
            setCategoriaSelecionada({value: dadosDetalhePedido[0]?.IDCATEGORIAPEDIDO, label: `${dadosDetalhePedido[0]?.CATEGORIAPROD} ${dadosDetalhePedido[0]?.DSCATEGORIAPROD} - ${dadosDetalhePedido[0]?.TPCATEGORIAPROD}`})
            setLocalExposicaoSelecionado({value: dadosDetalhePedido[0]?.IDLOCALEXPOSICAO, label: dadosDetalhePedido[0]?.DSLOCALEXPOSICAO})
            setEcommerceSelecionado({value: dadosDetalhePedido[0]?.STECOMMERCE, label: dadosDetalhePedido[0]?.STECOMMERCE == 'True' ? 'SIM' : 'NÃO'})
            setRedeSocialSelecionada({value: dadosDetalhePedido[0]?.STREDESOCIAL, label: dadosDetalhePedido[0]?.STREDESOCIAL == 'True' ? 'SIM' : 'NÃO'})
            setVrBruto(toFloat(dadosDetalhePedido[0]?.VRUNITBRUTODETALHEPEDIDO))
            setPercDescontoI(toFloat(dadosDetalhePedido[0]?.DESC01))
            setPercDescontoII(toFloat(dadosDetalhePedido[0]?.DESC02))
            setPercDescontoIII(toFloat(dadosDetalhePedido[0]?.DESC03))
            setVrLiquido(toFloat(dadosDetalhePedido[0]?.VRUNITLIQDETALHEPEDIDO))
            setVrSugerido(toFloat(dadosDetalhePedido[0]?.VRVENDADETALHEPEDIDO))
            setVrTotal(toFloat(dadosDetalhePedido[0]?.VRTOTALDETALHEPEDIDO))
            setObservacao(dadosDetalhePedido[0]?.OBSPRODUTO)
            setStPedidoPorIntermediario(dadosDetalhePedido[0]?.STPEDIDOPORINTEMEDIARIO)
            setObsFornecedor(dadosDetalhePedido[0]?.OBSPEDIDO)

        }
      }, [dadosDetalhePedido]);

    const onSubmit = async () => {

        try {
            const data = {
                IDRESUMOPEDIDO: parseInt(idResumoPedido),
                IDCOR: parseInt(corSelecionada?.value),
                IDSUBGRUPOESTRUTURA: parseInt(estruturaSelecionada?.value),
                IDCATEGORIAPEDIDO: parseInt(categoriaSelecionada?.value),
                IDTIPOTECIDO: parseInt(tipoTecidoSelecionado?.value),
                IDESTILO: parseInt(estiloSelecionado?.value),
                IDFABRICANTE: parseInt(fabricanteSelecionado?.value),
                IDLOCALEXPOSICAO: parseInt(localExposicaoSelecionado?.value),
                NUREF: referenciaProduto,
                DSPRODUTO: descricaoProduto,
                QTDTOTAL: parseInt(quantidade),
                NUCAIXA: parseInt(quantidadeCaixa),
                UND: parseInt(unidadeSelecionada?.value),
                VRUNITBRUTO: parseFloat(vrBruto),
                DESC01: parseFloat(percDescontoI),
                DESC02: parseFloat(percDescontoII),
                DESC03: parseFloat(percDescontoIII),
                VRUNITLIQUIDO: parseFloat(vrLiquido),
                VRVENDA: parseFloat(vrVenda),
                VRTOTAL: parseFloat(vrTotal),
                STRECEBIDO: 'False',
                STECOMMERCE: ecommerceSelecionado?.value,
                STREDESOCIAL: redeSocialSelecionada?.value,
                STCANCELADO: 'False',
                GRADE:'',
                VRCUSTOPRODATUAL: parseFloat(vrCusto),
                VRVENDAPRODATUAL: parseFloat(vrVenda),
                OBSPRODUTO: observacao,
                STTRANSFORMADO: 'False',
                IDCATEGORIAS: parseInt(categoriaSelecionada?.value),
                STREPOSICAO: reposicaoSelecionado?.value,
                NUCODBARRAS: referencia,
                IDPRODUTO: produtoSelecionado?.IDPRODUTO,
                IDRESPCADASTRO: parseInt(usuarioLogado?.id),
                STPEDIDOPORINTEMEDIARIO: stPedidoPorIntermediario,
                IDCATEGORIAGRADE: parseInt(categoriaGradeSelecionada?.value),
            }
        } catch (error) {
            console.error('Erro ao incluir produto no pedido:', error);s
        }
    }

    return {
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
    }

}