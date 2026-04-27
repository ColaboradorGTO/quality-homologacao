import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../utils/toFloat";
import { useFetchData } from "../../../hooks/useFetchData";
import { get } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";


export const useEditarProdutoPedido = (dadosDetalheRecebimentos) => {
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

   
    const { data: dadosUnidadeMedida = [], error: errorUnidadeMedida, isLoading: isLoadingUnidadeMedida, refetch: refetchUnidadeMedida } = useQuery(
        'unidadeMedida',
        async () => { 
            const response = await get(`/unidadeMedida`); 
            return response.data
        },
        { enabled: true }
    );
    
    const { data: dadosCores = [], error: errorCores, isLoading: isLoadingCores, refetch: refetchCores } = useQuery(
        'listaCores',
        async () => { 
            const response = await get(`/listaCores`); 
            return response.data 
        },
        { enabled: true }
    );
    
    const { data: dadosLocalExposicao  = [], error: errorLocalExposicao, isLoading: isLoadingLocalExposicao, refetch: refetchLocalExposicao } = useQuery(
        'localExposicao',
        async () => { 
            const response = await get(`/localExposicao`);  
            return response.data
        },
        { enabled: true }
    );

    const { data: dadosTamanho  = [], error: errorTamanho, isLoading: isLoadingTamanho, refetch: refetchTamanho } = useQuery(
        'tamanho',
        async () => { 
            const response = await get(`/tamanho`);  
            return response.data
        },
        { enabled: true }
    );
  
    const { data: dadosTipoTecidos  = [], error: errorTipoTecidos, isLoading: isLoadingTipoTecidos, refetch: refetchTipoTecidos } = useQuery(
        'tipoTecidos',
        async () => { 
            const response = await get(`/tipoTecidos`);  
            return response.data
        },
        { enabled: true }
    );
    
    const { data: dadosCategoriaPedidos  = [], error: errorCategoriaPedidos, isLoading: isLoadingCategoriaPedidos, refetch: refetchCategoriaPedidos } = useQuery(
        'categoriaPedidos',
        async () => { 
            const response = await get(`/categoriaPedidos`);  
            return response.data
        },
        { enabled: true }
    );

    const { data: dadosCategoriasProdutos  = [], error: errorCategoriasProdutos, isLoading: isLoadingCategoriasProdutos, refetch: refetchCategoriasProdutos } = useQuery(
        'categoriasProdutos',
        async () => { 
            const response = await get(`/categoriasProdutos`);  
            return response.data
        },
        { enabled: true }
    );

    const { data: dadosTipoProdutos  = [], error: errorTipoProdutos, isLoading: isLoadingTipoProdutos, refetch: refetchTipoProdutos } = useQuery(
        'tipoProdutos',
        async () => { 
            const response = await get(`/tipoProdutos`);  
            return response.data
        },
        { enabled: true }
    );
    
    const { data: dadosTipoFiscalProdutos  = [], error: errorTipoFiscalProdutos, isLoading: isLoadingTipoFiscalProdutos, refetch: refetchTipoFiscalProdutos } = useQuery(
        'tipoFiscalProduto',
        async () => { 
            const response = await get(`/tipoFiscalProduto`);  
            return response.data
        },
        { enabled: true }
    );
   
    const { data: dadosProdutos  = [], error: errorConsultaProdutos, isLoading: isLoadingConsultaProdutos, refetch: refetchConsultaProdutos } = useQuery(
        'consultaProdutos',
        async () => { 
            const response = await get(`/consultaProdutos`);  
            return response.data
        },
        { enabled: true }
    );


    
    const handleCategoriaProduto = (e) => {
        setCategoriaProdutoSelecionado(e.value)
    }

    const handleTamanho = (e) => {
        setTamanhoSelecionado(e.value)
    }

    const handleUnidade = (e) => {
        setUnidadeSelecionada(e.value)
    }

    const handleCor = (e) => {
        setCorSelecionada(e.value)
    }

    const handleTipoTecido = (e) => {
        setTipoTecidoSelecionado(e.value)
    }

    const handleCategoria = (e) => {
        setCategoriaSelecionada(e.value)
    }

    const handleLocalExposicao = (e) => {
        setLocalExposicaoSelecionado(e.value)
    }

    const handleEcommerce = (e) => {
        setEcommerceSelecionado(e.value)
    }

    const handleRedeSocial = (e) => {
        setRedeSocialSelecionado(e.value)
    }

    const handleNcm = (e) => {
        setNcmSelecionado(e.value)
    }

    const handleTipoProduto = (e) => {
        setTipoProdutoSelecionado(e.value)
    }

    const handleTipoFiscal = (e) => {
        setTipoFiscalSelecionado(e.value)
    }

    if(fornecedor == '') {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'O campo Fornecedor é obrigatório!',
        })
        return

    } else if(tamanhoSelecionado == '') {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'O campo Tamanho é obrigatório!',
        })
        return

    } else if(fabricante == '') {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'O campo Fabricante é obrigatório!',
        })
        return

    } 
    const cadastrarProduto = async () => {
             Swal.fire({
                icon: 'question',
                title: 'Certeza que Deseja Finalizar o Cadastro?',
                text: 'Você não poderá reverter esta ação!',
                
             }).then(async (result) => {
                if(result.isConfirmed) {
                    const data = {
                        "IDGRUPOEMPRESARIAL": parseInt(IDMarcaCadAv),
                        "IDSUBGRUPOESTRUTURA": parseInt(IDEstMCadAv1),
                        "IDCOR": parseInt(IDCorCadAv),
                        "IDTIPOTECIDO": parseInt(IDTpTecCadAv),
                        "IDESTILO": parseInt(IDEstiloCadAv),
                        "IDFABRICANTE": parseInt(IDFabCadAv),
                        "IDTAMANHO": parseInt(IDTamCadAv),
                        "DSTAMANHO": (tmprodcadAv),
                        "IDLOCALEXPOSICAO": parseInt(IdLocalExpAv),
                        "IDCATEGORIAS": parseInt(IdCategoriasAv),
                        "IDCATEGORIAPEDIDO": parseInt(tipoprodAv),
                        "IDNCM": 0,
                        "NUNCM":nuncmAv,
                        "IDTIPOPRODUTOFISCAL": parseInt(idtipoprodAv),
                        "IDFONTEPRODUTOFISAL": parseInt(idtipofiscalAv),
                        "NUREF":refprodutocadAv,
                        "UND":UnidCadAv,
                        "DTCADASTRO":dataAtualCampo,
                        "DTULTATUALIZACAO":dataAtualCampo,
                        "STECOMMERCE":stEcommerceAv,
                        "STREDESOCIAL":stRedSocialAv,
                        "STATIVO":stAtivoAv,
                        "STCANCELADO":StCancelAv,
                        "STAVULSO":stAvulsoAv,
                        "QTDPRODUTO":parseFloat(qtdprodcadAv),
                        "CODBARRAS":(CodBarraCadAv),
                        "DSPRODUTO":(dsprodutoavulso),
                        "QTDESTOQUEIDEAL":parseFloat(qtdestidealAv),
                        "VRCUSTO":parseFloat(VrCustoCadAv),
                        "VRVENDA":parseFloat(VrVendaCadAv),
                        "VRTOTALCUSTO":parseFloat(VrTotalCustoCadAv),
                        "NUCONTADOR":parseInt(nucontadorsubgrupoAv),
                        "STMIGRADOSAP":StMigradoAv,
                        "IDFORNECEDOR":parseInt(IDFornCadAv)
                    }
                }
             })
    };

    return {
        quantidade,
        setQuantidade,
        referencia,
        setReferencia,
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
        ncmSelecionado,
        setNcmSelecionado,
        tipoProdutoSelecionado,
        setTipoProdutoSelecionado,
        tipoFiscalSelecionado,
        setTipoFiscalSelecionado,
        handleTamanho,
        handleUnidade,
        handleCor,
        handleTipoTecido,
        handleCategoria,
        handleNcm,
        handleTipoProduto,
        handleTipoFiscal,
        observacao,
        setObservacao,
        estoque,
        setEstoque,
        cadastrarProduto,

    };
};