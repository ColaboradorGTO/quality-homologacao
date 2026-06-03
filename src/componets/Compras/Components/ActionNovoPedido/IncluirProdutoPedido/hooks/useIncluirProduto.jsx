import { useState } from "react";
import { get } from "../../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { optionsReposicao, optionsTipoCadastro } from "../../../../../../../parceiro.json"
import { useEffect } from "react";
import Swal from "sweetalert2";

export const useIncluirProduto = ({
    usuarioLogado,
    optionsModulos,
    tipoPedidoSelecionado,
    marcaSelecionada,
    dadosUltimosPedidos,
    dadosDetalhePedido,
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [nomeMarca, setNomeMarca] = useState('')
    const [referenciaProduto, setReferenciaProduto] = useState('')
    const [produtoSelecionado, setProdutoSelecionado] = useState('')
    const [reposicaoSelecionado, setReposicaoSelecionado] = useState('')
    const [tipoCadastroSelecionado, setTipoCadastroSelecionado] = useState('')
    const [descricaoProduto, setDescricaoProduto] = useState('')
    const [vrCusto, setVrCusto] = useState(0)
    const [vrVenda, setVrVenda] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    const [quantidadeCaixa, setQuantidadeCaixa] = useState(0)
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
    const [vrBruto, setVrBruto] = useState(0)
    const [percDescontoI, setPercDescontoI] = useState(0)
    const [percDescontoII, setPercDescontoII] = useState(0)
    const [percDescontoIII, setPercDescontoIII] = useState(0)
    const [vrLiquido, setVrLiquido] = useState(0)
    const [vrSugerido, setVrSugerido] = useState(0)
    const [vrSugerigoFixo, setVrSugerigoFixo] = useState('')
    const [vrTotal, setVrTotal] = useState(0)
    const [observacao, setObservacao] = useState('')
    const [idResumoPedido, setIdResumoPedido] = useState('')
    const [stPedidoPorIntermediario, setStPedidoPorIntermediario] = useState('')
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
    const [quantidadePorTamanho, setQuantidadePorTamanho] = useState({});
    const [errosValidacao, setErrosValidacao] = useState([]);
    const [produtoDadosGrade, setProdutoDadosGrade] = useState([]);
    const [stReposicao, setStReposicao] = useState('False');
    const [stRascunho, setRascunho] = useState('False');
    const [tipoCadastro, setTipoCadastro] = useState('')
    const [tamanhoUnicoId, setTamanhoUnicoId] = useState(null);
    const [stTransformado, setStTransformado] = useState('False');

    useEffect(() => {
        if (dadosUltimosPedidos && dadosUltimosPedidos.length > 0) {
            setFornecedorSelecionado(dadosUltimosPedidos[0]?.MODPEDIDO)
        }
    }, [])

    const { data: dadosCores = [], error: errorCores, isLoading: isLoadingCores, refetch: refetchCores } = useQuery(
        'listaCores',
        async () => { const response = await get(`/listaCores`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosUnidadeMedida = [], error: errorUnidadeMedida, isLoading: isLoadingUnidadeMedida, refetch: refetchUnidadeMedida } = useQuery(
        'unidadeMedida',
        async () => { const response = await get(`/unidadeMedida`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosTipoTecidos = [], error: errorTipoTecidos, isLoading: isLoadingTipoTecidos, refetch: refetchTipoTecidos } = useQuery(
        'tipoTecidos',
        async () => { const response = await get(`/tipoTecidos`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosCategoriaPedidos = [], error: errorCategoriaPedidos, isLoading: isLoadingCategoriaPedidos, refetch: refetchCategoriaPedidos } = useQuery(
        'categoriasProdutos',
        async () => { const response = await get(`/categoriasProdutos?idCategoriaPedido=${tipoPedidoSelecionado?.value}`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    // const { data: dadosCategoriaPedidos  = [], error: errorCategoriaPedidos, isLoading: isLoadingCategoriaPedidos, refetch: refetchCategoriaPedidos } = useQuery(
    //     'categoria-pedido',
    //     async () => { const response = await get(`/categoria-pedido?idCategoriaPedido=${tipoPedidoSelecionado?.value}`); return response.data},
    //     { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    // );

    const { data: dadosCategoriasProdutos = [], error: errorCategoriasProdutos, isLoading: isLoadingCategoriasProdutos, refetch: refetchCategoriasProdutos } = useQuery(
        'categoriasProdutos',
        async () => { const response = await get(`/categoriasProdutos?idTipoPedido=${tipoPedidoSelecionado?.value}`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosSubGrupoProduto = [], error: errorSubGrupoProduto, isLoading: isLoadingSubGrupoProduto, refetch: refetchSubGrupoProduto } = useQuery(
        'subgrupo-produto',
        async () => { const response = await get(`/subgrupo-produto`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosFabricantePedido = [], error: errorFabricantePedido, isLoading: isLoadingFabricantePedido, refetch: refetchFabricantePedido } = useQuery(
        'vincularFabricanteFornecedor',
        async () => {
            const response = await get(`/vincularFabricanteFornecedor?idFornecedorPedido=${fornecedorSelecionado?.value}`);
            return response.data
        },
        { enabled: true, staleTime: 60 * 60 * 1000 }
    );

    const { data: dadosLocalExposicao = [], error: errorLocalExposicao, isLoading: isLoadingLocalExposicao, refetch: refetchLocalExposicao } = useQuery(
        'localExposicao',
        async () => { const response = await get(`/localExposicao`); return response.data },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosGrade = [], error: errorGrade, isLoading: isLoadingGrade, refetch: refetchGrade } = useQuery(
        'vinculo-tamanho-categoria',
        async () => {
            const response = await get(`/vinculo-tamanho-categoria?idCategoriaPedido=${categoriaSelecionada?.value}`);
            return response.data
        },
        { enabled: true, staleTime: 60 * 60 * 1000 }
    );

    const { data: dadosVinculoEstiloGrupo = [], error: errorVinculoEstiloGrupo, isLoading: isLoadingVinculoEstiloGrupo, refetch: refetchVinculoEstiloGrupo } = useQuery(
        'vinculo-estilo-grupo',
        async () => { const response = await get(`/vinculo-estilo-grupo?idVinculoEstilo=${estruturaSelecionada?.value}`); return response.data },
        { enabled: Boolean(estruturaSelecionada?.value) }
    );

    const { data: dadosProdutosPedidos = [], error: errorProdutosPedidos, isLoading: isLoadingProdutosPedidos, refetch: refetchProdutosPedidos } = useQuery(
        'produtos-pedido',
        async () => {
            const response = await get(`/produtos-pedido?referenciaProduto=${referenciaProduto}`);
            return response.data
        },
        { enabled: referenciaProduto.length > 4, staleTime: 60 * 60 * 1000 }
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
        if (dadosDetalhePedido && dadosDetalhePedido.length > 0) {

            console.log(dadosVisualizarPedido[0], 'dataVisualizarPedido[0] - useEffect do Modal')
            setNomeMarca(dadosDetalhePedido[0]?.NOFANTASIA)
            setStReposicaoSelecionado({
                value: dadosDetalhePedido[0]?.STREPOSICAO,
                label: dadosDetalhePedido[0]?.STREPOSICAO == 'True' ? 'SIM' : 'NÃO'
            })
            setCadastroSelecionado({
                value: dadosDetalhePedido[0]?.STREPOSICAO,
                label: dadosDetalhePedido[0]?.STREPOSICAO == 'True' ? 'POR REFERÊNCIA' : 'NORMAL'
            })

            setDescricaoProduto(dadosDetalhePedido[0]?.DSPRODUTO)
            setVrCusto(toFloat(dadosDetalhePedido[0]?.VRCUSTOPRODATUAL))
            setVrVenda(toFloat(dadosDetalhePedido[0]?.VRVENDAPRODATUAL))
            setQuantidade(toFloat(dadosDetalhePedido[0]?.QTDTOTAL))
            setQuantidadeCaixa(toFloat(dadosDetalhePedido[0]?.NUCAIXA))
            setReferencia(dadosDetalhePedido[0]?.NUREF)
            setFabricanteSelecionado({ value: dadosDetalhePedido[0]?.IDFABRICANTE, label: ` ${dadosDetalhePedido[0]?.IDFABRICANTE} - ${dadosDetalhePedido[0]?.DSFABRICANTE}` })
            setUnidadeSelecionada({ value: dadosDetalhePedido[0]?.IDUNIDADEMEDIDA, label: dadosDetalhePedido[0]?.DSSIGLA })
            setCorSelecionada({ value: dadosDetalhePedido[0]?.IDCOR, label: dadosDetalhePedido[0]?.DSCOR })
            setTipoTecidoSelecionado({ value: dadosDetalhePedido[0]?.IDTIPOTECIDO, label: dadosDetalhePedido[0]?.DSTIPOTECIDO })
            setCategoriaGradeSelecionada({
                value: dadosDetalhePedido[0]?.IDCATEGORIAGRADE,
                label: `${dadosDetalhePedido[0]?.TPCATEGORIAPRODPEDIDO} - ${dadosDetalhePedido[0]?.DSCATEGORIAPEDIDO}`
            })
            setEstruturaSelecionada({ value: dadosDetalhePedido[0]?.IDSUBGRUPOESTRUTURA, label: dadosDetalhePedido[0]?.DSSUBGRUPOESTRUTURA })
            setEstiloSelecionado({ value: dadosDetalhePedido[0]?.IDESTILO, label: dadosDetalhePedido[0]?.DSESTILO })
            setCategoriaSelecionada({ value: dadosDetalhePedido[0]?.IDCATEGORIAPEDIDO, label: `${dadosDetalhePedido[0]?.CATEGORIAPROD} ${dadosDetalhePedido[0]?.DSCATEGORIAPROD} - ${dadosDetalhePedido[0]?.TPCATEGORIAPROD}` })
            setLocalExposicaoSelecionado({ value: dadosDetalhePedido[0]?.IDLOCALEXPOSICAO, label: dadosDetalhePedido[0]?.DSLOCALEXPOSICAO })
            setEcommerceSelecionado({ value: dadosDetalhePedido[0]?.STECOMMERCE, label: dadosDetalhePedido[0]?.STECOMMERCE == 'True' ? 'SIM' : 'NÃO' })
            setRedeSocialSelecionada({ value: dadosDetalhePedido[0]?.STREDESOCIAL, label: dadosDetalhePedido[0]?.STREDESOCIAL == 'True' ? 'SIM' : 'NÃO' })
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
            setRascunho(dadosDetalhePedido[0]?.STRASCUNHO)

        }
    }, [dadosDetalhePedido]);

    useEffect(() => {
        if (dadosGrade?.length) {
            const valoresIniciais = {};
            dadosGrade.forEach(item => {
                const stDiversos = item.DSTAMANHO?.toUpperCase() === 'DIVERSOS' ||
                    item.DSTAMANHO?.toUpperCase() === 'U-DIVERSOS';
                valoresIniciais[item.IDTAMANHO] = stDiversos ? 1 : 0;
            });
            setQuantidadePorTamanho(valoresIniciais);
        }
    }, [dadosGrade]);

    // Função para formatar valor (equivalente ao formataValorGrade do jQuery)
    const formataValorGrade = (valor, condicao = 'False') => {
        let vrInput = Number(String(valor ?? '').replace(/[^0-9]/g, '')) || 0;

        if (condicao === 'True') {
            vrInput = Number(vrInput) || 1;
        }

        return vrInput;
    };


    const validarGradeamento = () => {
        const qtdprodpedido = Number(quantidade || 0);
        let totalindice = 0;
        const erros = [];
        let acumuladorInputsError = '';

        const inputsComValor = Object.entries(quantidadePorTamanho)
            .filter(([, valor]) => Number(valor || 0) > 0);

        if (inputsComValor.length) {
            if (stReposicao !== 'False' && inputsComValor.length > 1) {
                erros.push('Este produto é de reposição e por isso não pode ser gradeado com mais de um tamanho.');
            } else {
                for (const [, valor] of inputsComValor) {
                    totalindice += Number(valor);
                }

                if (totalindice <= 0) {
                    erros.push('O Gradeamento de Tamanhos Não Pode Estar Zerado.');
                } else {
                    for (const [id, valor] of inputsComValor) {
                        const item = dadosGrade.find(g => String(g.IDTAMANHO) === String(id));
                        const labelInput = item?.DSTAMANHO || '';
                        const qtdgradetotal = (qtdprodpedido / totalindice) * Number(valor);

                        if (!Number.isInteger(qtdgradetotal)) {
                            acumuladorInputsError += `( Tamanho: ${labelInput} , Quantidade: ${qtdgradetotal.toFixed(2)} ), `;
                        }
                    }

                    if (acumuladorInputsError) {
                        erros.push(`Os valores digitados no Gradeamento de Tamanhos não geram quantidades exatas para cada TAMANHO: ${acumuladorInputsError}`);
                    }
                }
            }
        } else {
            erros.push('O Gradeamento de Tamanhos Não Pode Estar Zerado.');
        }

        setErrosValidacao(erros);
        return erros.length === 0;
    };


    // Função para montar payload da grade (equivalente ao montarPayloadGradeProduto do jQuery)
    const montarPayloadGrade = () => {
        const qtdprodpedido = Number(quantidade || 0);
        const grade = [];

        const inputsComValor = Object.entries(quantidadePorTamanho)
            .filter(([, valor]) => Number(valor || 0) > 0);

        const totalindice = inputsComValor.reduce((acc, [, valor]) => acc + Number(valor), 0);
        if (!inputsComValor.length || totalindice <= 0 || qtdprodpedido <= 0) return [];

        for (const [id, valor] of inputsComValor) {
            const qtdgradetotal = (qtdprodpedido / totalindice) * Number(valor);

            grade.push({
                IDDETALHEPEDIDOGRADE: null, // preencher na edição quando existir
                IDTAMANHO: parseInt(id, 10),
                INDICETAMANHO: parseInt(valor, 10),
                QTD: Number(qtdgradetotal)
            });
        }

        return grade;
    };

    // Handler para mudança de valor nos inputs
    const handleChangeQuantidade = (idTamanho, valor) => {
        const valorFormatado = formataValorGrade(valor);

        setQuantidadePorTamanho(prevState => ({
            ...prevState,
            [idTamanho]: valorFormatado
        }));

        // Limpa erros quando usuário digita
        if (errosValidacao.length > 0) {
            setErrosValidacao([]);
        }
    };

    // Calcula a distribuição de quantidades para exibição
    const calcularDistribuicao = () => {
        const qtdprodpedido = Number(quantidade);
        const inputsComValor = Object.entries(quantidadePorTamanho).filter(([id, valor]) => Number(valor || 0) > 0);

        if (inputsComValor.length === 0 || qtdprodpedido === 0) return {};

        let totalindice = 0;
        for (let [id, valor] of inputsComValor) {
            totalindice += parseFloat(valor);
        }

        const distribuicao = {};
        for (let [id, valor] of inputsComValor) {
            const qtdgradetotal = (qtdprodpedido / totalindice) * parseFloat(valor);
            distribuicao[id] = qtdgradetotal;
        }
        console.log(distribuicao, 'distribuicao');
        return distribuicao;
    };

    useEffect(() => {
        // Simula carregamento dos dados da grade
        setProdutoDadosGrade([
            { IDTAMANHO: 1, DSTAMANHO: 'P' },
            { IDTAMANHO: 2, DSTAMANHO: 'M' },
            { IDTAMANHO: 3, DSTAMANHO: 'G' },
            { IDTAMANHO: 4, DSTAMANHO: 'GG' },
            { IDTAMANHO: 5, DSTAMANHO: 'EG' },
            { IDTAMANHO: 6, DSTAMANHO: 'DIVERSOS' }
        ]);
    }, []);


    // estados/props esperados
    // stTransformado: 'True' | 'False'
    // stReposicaoSelecionado: 'True' | 'False'
    // tamanhoUnicoId: string | null  -> quando produto só pode 1 tamanho (idTamanho do produto)
    // tamanhosAtivosEdicao: Set<string> -> IDs ativos no modo edição (quando vier gradeamento do item)

    const isDiversos = (nome = '') => {
        const t = String(nome).toUpperCase();
        return t === 'DIVERSOS' || t === 'U-DIVERSOS';
    };

    // decide bloqueio igual ao legado
    const getInputStateGrade = ({ item, valorAtual }) => {
        const id = String(item.IDTAMANHO);
        const diversos = isDiversos(item.DSTAMANHO);

        // 1) DIVERSOS sempre bloqueado
        if (diversos) {
            return { disabled: true, readOnly: true };
        }

        // 2) Modo tamanho único (equiv. bloco que zera tudo e libera só 1)
        if (tamanhoUnicoId) {
            const isSelecionado = String(tamanhoUnicoId) === id;
            return { disabled: !isSelecionado, readOnly: !isSelecionado };
        }

        // 3) Reposição na edição: bloqueia tudo, libera só tamanhos ativos
        if (stReposicao === 'True') {
            const ativo = tamanhosAtivosEdicao?.has(id);
            return { disabled: !ativo, readOnly: !ativo };
        }

        // 4) Transformado: desabilita quem está zerado, habilita quem > 0
        if (stTransformado === 'True') {
            const temValor = Number(valorAtual || 0) > 0;
            return { disabled: !temValor, readOnly: !temValor };
        }

        // 5) Padrão
        return { disabled: false, readOnly: false };
    };


    const onSubmit = async () => {
        if(stReposicao == 'False') {
            const responseProdutoExistente = await get(`/produtos-pedido?referenciaProduto=${referenciaProduto}`);
    
            if (responseProdutoExistente.data.length > 0) {
                Swal.fire({
                    title: 'Edite e tente novamente!',
                    text: 'Já existe um produto cadastrado com a mesma descrição digitada!',
                    icon: 'warning',
                })
                return;
            }

        }

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
                GRADE: '',
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
            console.error('Erro ao incluir produto no pedido:', error);
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
        tipoCadastroSelecionado,
        setTipoCadastroSelecionado,
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
        dadosVinculoEstiloGrupo,
        optionsTipoCadastro,
        optionsReposicao,
        atualiza_valor_QtdUnit,
        vrSugerigoFixo,
        setVrSugerigoFixo,
        formatarNumero,
        converterParaNumero,
        validarGradeamento,
        montarPayloadGrade,
        handleChangeQuantidade,
        calcularDistribuicao,
        errosValidacao,
        setErrosValidacao,
        quantidadePorTamanho,
        setQuantidadePorTamanho,
        produtoDadosGrade,
        setProdutoDadosGrade,
        stReposicao,
        setStReposicao,
        isDiversos,
        getInputStateGrade,
        onSubmit,
    }

}