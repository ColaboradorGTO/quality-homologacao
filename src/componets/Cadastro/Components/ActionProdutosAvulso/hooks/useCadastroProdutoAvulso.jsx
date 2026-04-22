import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { adicionarMeses, getDataAtual } from "../../../../../utils/dataAtual";
import { post, put } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../../../../../utils/toFloat";
import { useFetchData } from "../../../../../hooks/useFetchData";
import { optionsTipoPedido, optionsReposicao } from "../../../../../../parceiro.json"
import axios from "axios"

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
    const { data: dadosFornecedores = [] } = useFetchData('fornecedor-produto', '/fornecedor-produto');
    const { data: dadosFabricantes = [] } = useFetchData('vincularFabricanteFornecedor', '/vincularFabricanteFornecedor');
    
    const onSubmit = async () => {
        // Validações movidas para dentro da função onSubmit
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
                    const dataAtual = getDataAtual();
                    const data = {
                        "QTDPRODUTO": parseFloat(quantidade) || 0,
                        "NUREF": referencia || '',
                        "CODBARRAS": codBarras || '',
                        "DSPRODUTO": descricao || '',
                        "DSFORNECEDOR": fornecedor || '',
                        "DSFABRICANTE": fabricante || '',
                        "DSESTRUTURA": estrutura || '',
                        "DSESTILO": estilo || '',
                        "VRCUSTO": parseFloat(vrCusto) || 0,
                        "VRVENDA": parseFloat(vrVenda) || 0,
                        "CATEGORIAPRODUTO": categoriaProdutoSelecionado?.value || '',
                        "IDTAMANHO": tamanhoSelecionado?.value || 0,
                        "UND": unidadeSelecionada?.value || '',
                        "IDCOR": corSelecionada?.value || 0,
                        "IDTIPOTECIDO": tipoTecidoSelecionado?.value || 0,
                        "IDCATEGORIAS": categoriaSelecionada?.value || 0,
                        "IDLOCALEXPOSICAO": localExposicaoSelecionado?.value || 0,
                        "STECOMMERCE": ecommerceSelecionado?.value || 'False',
                        "STREDESOCIAL": redeSocialSelecionado?.value || 'False',
                        "IDNCM": ncmSelecionado?.value || 0,
                        "IDTIPOPRODUTOFISCAL": tipoProdutoSelecionado?.value || 0,
                        "IDFONTEPRODUTOFISAL": tipoFiscalSelecionado?.value || 0,
                        "DTCADASTRO": dataAtual,
                        "DTULTATUALIZACAO": dataAtual,
                        "STATIVO": "True",
                        "STCANCELADO": "False",
                        "STAVULSO": "True",
                        "IDUSUARIO": usuarioLogado?.IDUSUARIO || 0,
                        "IP": ipUsuario || '127.0.0.1'
                    };

                    // Aqui você pode fazer a requisição POST para salvar o produto
                    // const response = await post('/cadastrar-produto-avulso', data);
                    
                    console.log('Dados para cadastro:', data);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Produto cadastrado com sucesso!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    handleClose();
                    
                } catch (error) {
                    console.error('Erro ao cadastrar produto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Falha ao cadastrar o produto. Tente novamente.',
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
        dadosUnidadeMedida,
        dadosTamanhos,
        dadosCores,
        dadosTipoTecidos,
        dadosCategoriaPedidos,
        dadosCategoriasProdutos,
        dadosExposicao,
        dadosTipoProdutos,
        dadosTipoFiscalProdutos,
        dadosFornecedores,
        dadosFabricantes,
        onSubmit

    };
};