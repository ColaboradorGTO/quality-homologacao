import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../utils/dataAtual";
import { post, put } from "../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../utils/toFloat";
import { useFetchData } from "../../../hooks/useFetchData";


export const useCadastroProdutoAvulso = (dadosDetalheRecebimentos) => {
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

    const { data: dadosUnidadeMedida = [] } = useFetchData('unidadeMedida', '/unidadeMedida');
    const { data: dadosTamanhos = [] } = useFetchData('tamanhos', '/tamanhos');
    const { data: dadosCores = [] } = useFetchData('listaCores', '/listaCores');
    const { data: dadosTipoTecidos = [] } = useFetchData('tipoTecidos', '/tipoTecidos');
    const { data: dadosCategoriaPedidos = [] } = useFetchData('categoriaPedidos', '/categoriaPedidos');
    const { data: dadosCategoriasProdutos = [] } = useFetchData('categoriasProdutos', '/categoriasProdutos');
    const { data: dadosExposicao = [] } = useFetchData('localExposicao', '/localExposicao');
    const { data: dadosTipoProdutos = [] } = useFetchData('tipoProduto', '/tipoProduto');
    const { data: dadosTipoFiscalProdutos = [] } = useFetchData('tipoFiscalProduto', '/tipoFiscalProduto');
    
    const { data: dadosProdutos = [] } = useFetchData('consultaProdutos', '/consultaProdutos');
    
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
        setTipoFiscalSelecionado,
        dadosUnidadeMedida,
        dadosTamanhos,
        dadosCores,
        dadosTipoTecidos,
        dadosCategoriaPedidos,
        dadosCategoriasProdutos,
        dadosExposicao,
        dadosTipoProdutos,
        dadosTipoFiscalProdutos,
        handleCategoriaProduto,
        handleTamanho,
        handleUnidade,
        handleCor,
        handleTipoTecido,
        handleCategoria,
        handleLocalExposicao,
        handleEcommerce,
        handleRedeSocial,
        handleNcm,
        handleTipoProduto,
        handleTipoFiscal,
        cadastrarProduto

    };
};