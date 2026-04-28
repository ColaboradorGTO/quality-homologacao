import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get, post, put } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../../hooks/useFetchData"
import { validarCNPJ } from "../../../../../utils/mascaraCNPJ"
import { optionsReposicao, optionsTipoFreteComercial } from "../../../../../../parceiro.json"

export const useCadastrarNFEdeEntrada = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    
    const [condicaoPagamento, setCondicaoPagamento] = useState('');
    const [tipoFrete, setTipoFrete] = useState('');
    const [fornecedorExistente, setFornecedorExistente] = useState([]);
    const [ipUsuario, setIpUsuario] = useState('');
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState("")
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
    const [numeroPedido, setNumeroPedido] = useState('');
    const [observacao, setObservacao] = useState('');
    const [totalAntesDesconto, setTotalAntesDesconto] = useState('');
    const [desconto, setDesconto] = useState('');
    const [adiantamentoTotal, setAdiantamentoTotal] = useState('');
    const [despesasAdicionais, setDespesasAdicionais] = useState('');
    const [impostos, setImpostos] = useState('');
    const [impostoRetido, setImpostoRetido] = useState('');
    const [totalPagar, setTotalPagar] = useState('');
    const [valorAplicado, setValorAplicado] = useState('');
    const [saldo, setSaldo] = useState('');

    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';
    
    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setDataCadastro(dataAtual)
        setDataEmissao(dataAtual)
    }, [])


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
    
    
    const { data: dadosCondicoesPagamento = [], error: errorPagamento, isLoading: isLoadingPagamento } = useQuery(
        'condicaoPagamento',
        async () => {
        const response = await get(`/condicaoPagamento`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosTransportadora = [], error: errorTransportadora, isLoading: isLoadingTransportadora } = useQuery(
        'transportadoras',
        async () => {
        const response = await get(`/transportadoras`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosComprador = [], error: errorComprador, isLoading: isLoadingComprador, refetch: refetchComprador } = useQuery(
        'compradores',
        async () => {
            const response = await get(`/compradores`);
            return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        'listaEmpresaComercial',
        async () => {
          const response = await get(`/listaEmpresaComercial`);
    
          return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosUsoPrincipal = [], error: errorUsoPrincipal, isLoading: isLoadingUsoPrincipal, refetch: refetchUsoPrincipal } = useQuery(
        'uso-principal',
        async () => {
          const response = await get(`/uso-principal`);
    
          return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedo } = useQuery(
        'fornecedores',
        async () => {
        const response = await get(`/fornecedores`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );


    const { data: dadosNfePedido = [], error: errorNFE, isLoading: isLoadingNFE } = useQuery(
        ['cadastro-nfpedido'],
        async () => {
            const response = await get(`/cadastro-nfpedido?idPedido`);

            return response.data;
        },
        { enabled: false }
    );

    const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useQuery(
        ['fabricantes'],
        async () => {
            const response = await get(`/fabricantes`);

            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosCNPJ = [], error: errorCNPJ, isLoading: isLoadingCNPJ } = useQuery(
        ['fornecedores'],
        async () => {
            const response = await get(`/fornecedores?CNPJFornecedor`);
            setFornecedorExistente(response.data);
            return response.data;
        },
        { enabled: true  }
    );
    

    const handleFechar = () => {
        handleClose();
    }

    const onSubmit = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar um Fornecedor!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }


        // const isUpdate = fornecedorExistente.length > 0 && idFornecedor;
        const idFornecedor = fornecedorExistente[0]?.IDFORNECEDOR;
        const isUpdate = fornecedorExistente.length > 0 ;
        
        const postData = {
            ...(isUpdate && { IDFORNECEDOR: idFornecedor }),
            IDGRUPOEMPRESARIAL: 1,
            IDSUBGRUPOEMPRESARIAL: 1,

        }
        try {
            
            const response = isUpdate ? await put('/fornecedor/:id', postData) : await post('/cadastrar-fornecedor', postData)

            const textDados = JSON.stringify(postData)
            let textFuncao = isUpdate ? 'COMPRAS/ATUALIZAR FORNECEDOR' : 'COMPRAS/CADASTRO DE FORNECEDOR';
            const ipUsuario = await getIPUsuario();

            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: isUpdate ? 'Atualizado!' : 'Cadastrado!',
                text: isUpdate ? 'Fornecedor atualizado com sucesso.' : 'Fornecedor cadastrado com sucesso.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = isUpdate ? 'COMPRAS/ ERRO AO ATUALIZAR FORNECEDOR' : 'COMPRAS/ ERRO AO CADASTRAR FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao criar fornecedor:', error);
        }
    }

    return {
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
        handleFechar,
        onSubmit,
    }
}

