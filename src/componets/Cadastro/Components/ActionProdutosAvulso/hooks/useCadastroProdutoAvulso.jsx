import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../../../../../utils/dataAtual";
import { get, post, put } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../../../../../utils/toFloat";
import { useFetchData } from "../../../../../hooks/useFetchData";
import { optionsTipoPedido, optionsReposicao } from "../../../../../../parceiro.json"
import axios from "axios"
import { useQuery } from "react-query";

export const useCadastroProdutoAvulso = ({ usuarioLogado, optionsModulos, handleClose}) => {
    const [quantidade, setQuantidade] = useState('')
    const [referencia, setReferencia] = useState('')
    const [codBarras, setCodBarras] = useState('')
    const [descricao, setDescricao] = useState('')
    const [fornecedor, setFornecedor] = useState('')
    const [fabricante, setFabricante] = useState('')
    const [estrutura, setEstrutura] = useState('')
    const [estilo, setEstilo] = useState('')
    const [vrCusto, setVrCusto] = useState('')
    const [vrVenda, setVrVenda] = useState('')
    const [categoriaProdutoSelecionado, setCategoriaProdutoSelecionado] = useState('')
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState('')
    const [unidadeSelecionada, setUnidadeSelecionada] = useState('')
    const [corSelecionada, setCorSelecionada] = useState('')
    const [tipoTecidoSelecionado, setTipoTecidoSelecionado] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
    const [localExposicaoSelecionado, setLocalExposicaoSelecionado] = useState('')
    const [ecommerceSelecionado, setEcommerceSelecionado] = useState('')
    const [redeSocialSelecionado, setRedeSocialSelecionado] = useState('')
    const [ncmSelecionado, setNcmSelecionado] = useState('')
    const [tipoProdutoSelecionado, setTipoProdutoSelecionado] = useState('')
    const [tipoFiscalSelecionado, setTipoFiscalSelecionado] = useState('')
    const [estoque, setEstoque] = useState('')
    const [observacao, setObservacao] = useState('')
    const [compradorSelecionado, setCompradorSelecionado] = useState(null);
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [referenciaProduto, setReferenciaProduto] = useState('');
    const [produtoPesquisado, setProdutoPesquisado] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');
    
    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ifconfig.me:", error);
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
   
    const { data: dadosUnidadeMedida  = [], error: errorUnidadeMedida, isLoading: isLoadingUnidadeMedida, refetch: refetchUnidadeMedida } = useQuery(
        'unidadeMedida',
        async () => { const response = await get(`/unidadeMedida`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
   
    const { data: dadosTamanhos  = [], error: errorTamanhos, isLoading: isLoadingTamanhos, refetch: refetchTamanhos } = useQuery(
        'tamanhos',
        async () => { const response = await get(`/tamanhos`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
  
    const { data: dadosCores  = [], error: errorCores, isLoading: isLoadingCores, refetch: refetchCores } = useQuery(
        'listaCores',
        async () => { const response = await get(`/listaCores`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosTipoTecidos  = [], error: errorTipoTecidos, isLoading: isLoadingTipoTecidos, refetch: refetchTipoTecidos } = useQuery(
        'tipoTecidos',
        async () => { const response = await get(`/tipoTecidos`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosCategoriasProdutos  = [], error: errorCategoriasProdutos, isLoading: isLoadingCategoriasProdutos, refetch: refetchCategoriasProdutos } = useQuery(
        'categoriasProdutos',
        async () => { const response = await get(`/categoriasProdutos?idTipoPedido=`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    
    const { data: dadosLocalExposicao  = [], error: errorLocalExposicao, isLoading: isLoadingLocalExposicao, refetch: refetchLocalExposicao } = useQuery(
        'localExposicao',
        async () => { const response = await get(`/localExposicao`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosTipoProdutos  = [], error: errorTipoProdutos, isLoading: isLoadingTipoProdutos, refetch: refetchTipoProdutos } = useQuery(
        'tipoProduto',
        async () => { const response = await get(`/tipoProduto`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
  
    const { data: dadosTipoFiscalProdutos  = [], error: errorTipoFiscalProdutos, isLoading: isLoadingTipoFiscalProdutos, refetch: refetchTipoFiscalProdutos } = useQuery(
        'tipoFiscalProduto',
        async () => { const response = await get(`/tipoFiscalProduto`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosProdutos  = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchProdutos } = useQuery(
        'consultaProdutos',
        async () => { const response = await get(`/consultaProdutos`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    
    const { data: dadosFornecedores  = [], error: errorFornecedores, isLoading: isLoadingFornecedores, refetch: refetchFornecedores } = useQuery(
        'fornecedor-produto',
        async () => { const response = await get(`/fornecedor-produto`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosFabricantes  = [], error: errorFabricantes, isLoading: isLoadingFabricantes, refetch: refetchFabricantes } = useQuery(
        'vincularFabricanteFornecedor',
        async () => { const response = await get(`/vincularFabricanteFornecedor`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosSubGrupoProduto  = [], error: errorSubGrupoProduto, isLoading: isLoadingSubGrupoProduto, refetch: refetchSubGrupoProduto } = useQuery(
        'subgrupo-produto',
        async () => { const response = await get(`/subgrupo-produto`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
  
    const { data: dadosNCM  = [], error: errorNCM, isLoading: isLoadingNCM, refetch: refetchNCM } = useQuery(
        'ncm',
        async () => { const response = await get(`/ncm`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosVinculoEstiloGrupo  = [], error: errorVinculoEstiloGrupo, isLoading: isLoadingVinculoEstiloGrupo, refetch: refetchVinculoEstiloGrupo } = useQuery(
        'vinculo-estilo-grupo',
        async () => { const response = await get(`/vinculo-estilo-grupo`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    const { data: dadosMarcas  = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
        'marcasLista',
        async () => { const response = await get(`/marcasLista`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    const { data: dadosProdutosPedido  = [], error: errorProdutosPedido, isLoading: isLoadingProdutosPedido, refetch: refetchProdutosPedido } = useQuery(
        'produtos-pedido',
        async () => { const response = await get(`/produtos-pedido?referenciaProduto=${referenciaProduto}`);  return response.data},
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );
    
    
    const onSubmit = async () => {
        
        Swal.fire({
            icon: 'question',
            title: 'Certeza que Deseja Finalizar o Cadastro?',
            text: 'Você não poderá reverter esta ação!',
            showCancelButton: true,
            confirmButtonText: 'Sim, cadastrar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if(result.isConfirmed) {
                try {
                    // const response = await get(`/consultaProdutos?descricaoProduto=${referenciaProduto}`);
                    // const vrTotalCusto = toFloat(vrCusto) * parseFloat(quantidade);
                    const dataAtual = getDataAtual();
                    const data = {
                        IDGRUPOEMPRESARIAL: parseInt(marcaSelecionada?.value),
                        IDSUBGRUPOESTRUTURA: parseInt(estrutura?.value),
                        IDCOR: parseInt(corSelecionada?.value),
                        IDTIPOTECIDO: parseInt(tipoTecidoSelecionado?.value),
                        IDESTILO: parseInt(estilo?.value),
                        IDFABRICANTE: parseInt(fabricante?.value),
                        IDTAMANHO: parseInt(tamanhoSelecionado?.value),
                        DSTAMANHO: tamanhoSelecionado,
                        IDLOCALEXPOSICAO: parseInt(localExposicaoSelecionado?.value),
                        IDCATEGORIAS: parseInt(categoriaSelecionada?.value),
                        IDCATEGORIAPEDIDO: parseInt(categoriaProdutoSelecionado?.value),
                        IDNCM: 0,
                        NUNCM: ncmSelecionado?.value,
                        IDTIPOPRODUTOFISCAL: parseInt(tipoProdutoSelecionado?.value),
                        IDFONTEPRODUTOFISAL: parseInt(tipoFiscalSelecionado?.value),
                        NUREF: referencia,
                        UND: unidadeSelecionada?.value,
                        DTCADASTRO: dataAtual,
                        DTULTATUALIZACAO: dataAtual,
                        STECOMMERCE: ecommerceSelecionado?.value,
                        STREDESOCIAL: redeSocialSelecionado?.value,
                        STATIVO: "True",
                        STCANCELADO: "False",
                        STAVULSO: "True",
                        QTDPRODUTO: parseFloat(quantidade),
                        CODBARRAS: codBarras,
                        DSPRODUTO: descricao,
                        QTDESTOQUEIDEAL: parseFloat(estoque),
                        VRCUSTO: parseFloat(vrCusto),
                        VRVENDA: parseFloat(vrVenda),
                        VRTOTALCUSTO: parseFloat(vrTotalCusto),
                        NUCONTADOR: '',
                        STMIGRADOSAP: "False",
                        IDFORNECEDOR: parseInt(fornecedor?.value),
                        IDRESPCADASTRO: usuarioLogado?.id,
                    };

                    // Aqui você pode fazer a requisição POST para salvar o produto
                    const response = await post('/cadastrar-produto-avulso', data);
                    const textDados = JSON.stringify(data);
                    const textFuncao = 'CADASTRO / CADASTRAR PRODUTO AVULSO';
                    const ipUsuario = await getIPUsuario();
                 
                    const createtLog = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || 'Indisponível'
                    }

                    await post('/log-web', createtLog)
                    Swal.fire({
                        icon: 'success',
                        title: 'Produto cadastrado com sucesso!',
                        timer: 5000,
                        showConfirmButton: false,
                        customClass: {
                            container: 'custom-swal'
                        }
                    });
                    
                    handleClose();
                    return response.data;
                } catch (error) {
                    console.error('Erro ao cadastrar produto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Falha ao cadastrar o produto. Tente novamente.',
                        customClass: {
                            container: 'custom-swal'
                        }
                    });
                }
            }
        })
    };

    return {
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

    };
};