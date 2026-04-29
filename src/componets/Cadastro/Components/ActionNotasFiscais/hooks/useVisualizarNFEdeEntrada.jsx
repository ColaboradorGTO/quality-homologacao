import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get, post, put } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../../hooks/useFetchData"
import { validarCNPJ } from "../../../../../utils/mascaraCNPJ"
import { optionsReposicao, optionsTipoFreteComercial } from "../../../../../../parceiro.json"
import { use } from "react"

export const useVisualizarNFEdeEntrada = ({ handleClose, dadosVisualizarNFE }) => {
    
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

    useEffect(() => {

        if(dadosVisualizarNFE.length && dadosVisualizarNFE.length > 0) {
            const dados = dadosVisualizarNFE[0];
            setNumeroPedido(dados?.IDRESUMOPEDIDO);
            setCondicaoPagamento({ value: dados?.IDCONDPAGAMENTO, label: dados?.NOME_CONDICAO_PAGAMENTO });
            setFornecedorSelecionado({ value: dados?.IDFORNECEDOR, label: `${dados?.EMIT_XFANT} // ${dados?.EMIT_CNPJ}` });
            setSaldo({ value: dados?.STSALDO, label: dados?.STSALDO == 'True' ? 'SIM' : 'NÃO' });
           
        }
  
    }, [])


    
    
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
          const response = await get(`/listaEmpresaComercial?idEmpresa=${dadosVisualizarNFE[0]?.IDEMPRESA}`);
    
          return response.data;
        },
        { enabled: Boolean(dadosVisualizarNFE[0]?.IDEMPRESA), staleTime: 60 * 60 * 1000, }
    );

    useEffect(() => {
         setFilialSelecionada({value: dadosEmpresas[0]?.IDEMPRESA, label: dadosEmpresas[0]?.NOFANTASIA})
    }, [])

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
        optionsReposicao
    }
}

