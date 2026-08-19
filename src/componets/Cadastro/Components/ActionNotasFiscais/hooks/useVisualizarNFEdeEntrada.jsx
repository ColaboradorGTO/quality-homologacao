import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get, post, put } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../../hooks/useFetchData"
import { validarCNPJ } from "../../../../../utils/mascaraCNPJ"
import { formatMoeda } from "../../../../../utils/formatMoeda"
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

    const optionsUsoPrincipal = [
        { value: '10', label: 'Compra Comercial' },
    ]

    const optionsTipoNFE = [
        { value: '-2', label: 'Externo' },
    ]

    const optionsModeloNFE = [
        { value: '55', label: 'NFe(55)' },
    ]

    useEffect(() => {

        if(dadosVisualizarNFE.length && dadosVisualizarNFE.length > 0) {
            const dados = dadosVisualizarNFE[0];
            console.log(dados, 'condicao');
            const totalNotaEntrada = formatMoeda(parseFloat(dados?.VNF || 0));

            setNumeroPedido(dados?.IDRESUMOPEDIDO);
            // setFornecedorSelecionado({ value: dados?.IDFORNECEDOR, label: `${dados?.EMIT_XFANT} // ${dados?.EMIT_CNPJ}` });
            // setUsoPrincipalSelecionado({ value: dados?.IDUSOPRINCIPAL, label: 'Compra Comercial' });
            setStatusSelecionado('Fechado');
            setSaldoSelecionado({ value: dados?.STSALDO, label: dados?.STSALDO == 'True' ? 'SIM' : 'NÃO' });
            setDataCadastro(String(dados?.DTCADASTRO || '').substring(0, 10));
            setDataEmissao(String(dados?.DEMI || '').substring(0, 10));
            setNumeroNFE(dados?.NNF || '');
            setSerieNFE(dados?.SERIE || 0);
            setModeloNFE(dados?.XMOD || '');
            setChaveNFE(dados?.CHNFE || '');
            setObservacao(dados?.OBSERVACOES || '');
            setTotalAntesDesconto(totalNotaEntrada);
            setTotalPagar(totalNotaEntrada);
            setSaldo(totalNotaEntrada);

            const condicaoEncontrada = dadosCondicoesPagamento.find((item) => item.IDCONDICAOPAGAMENTO == dados?.IDCONDPAGAMENTO);
            if(condicaoEncontrada) {
                setCondicaoPagamento({
                    value: condicaoEncontrada.IDCONDICAOPAGAMENTO,
                    label: condicaoEncontrada.DSCONDICAOPAG
                })
            }
            
            const usoPrincipalEncontrado = dadosUsoPrincipal.find((item) => item.ID == dados?.IDUSOPRINCIPAL);
            if(usoPrincipalEncontrado) {
                setUsoPrincipalSelecionado({
                    value: usoPrincipalEncontrado.IDUSOPRINCIPAL,
                    label: usoPrincipalEncontrado.Usage
                })
            }
  
            const tipoFreteEncontrado = optionsTipoFreteComercial?.find((item) => String(item.value) === String(dados?.MODFRETE));
            if(tipoFreteEncontrado) setTipoFrete(tipoFreteEncontrado);

            // const tipoNFEEncontrado = optionsTipoNFE?.find((item) => String(item.value) === String(dados?.MOD))
            // if(tipoNFEEncontrado) {
            //     setTipoNFESelecionada({
            //         value: tipoNFEEncontrado.value,
            //         label: tipoNFEEncontrado.label
            //     })
            // }
        }

    }, [dadosVisualizarNFE])


    
    
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
        if(!(dadosVisualizarNFE.length > 0) || !(dadosEmpresas.length > 0)) return;

        const dados = dadosVisualizarNFE[0];
        const filialEncontrada = dadosEmpresas.find((item) => String(item.IDEMPRESA) === String(dados?.IDEMPRESA));

        if(filialEncontrada) {
            setFilialSelecionada({
                value: filialEncontrada.IDEMPRESA,
                label: `${filialEncontrada.NOFANTASIA} - ${filialEncontrada.NORAZAOSOCIAL}`,
                cnpj: filialEncontrada.NUCNPJ
            });
            setCnpjFilial(filialEncontrada.NUCNPJ);
        }
    }, [dadosVisualizarNFE, dadosEmpresas])

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
        const response = await get(`/fornecedores?idFornecedor=${dadosVisualizarNFE[0]?.IDFORNECEDOR}`);
    
        return response.data;
        },
        { enabled: true }
    );

    useEffect(() => {
        if(dadosFornecedores.length > 0) {
            setFornecedorSelecionado({
                value: dadosFornecedores[0]?.IDFORNECEDOR,
                label: `${dadosFornecedores[0]?.NORAZAOSOCIAL} // ${dadosFornecedores[0]?.NUCNPJ} // ${dadosFornecedores[0]?.NOFANTASIA}`
            })
        }
    }, [])


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

    useEffect(() => {
        if(!(dadosVisualizarNFE.length > 0) || !(dadosFabricantes.length > 0)) return;

        const dados = dadosVisualizarNFE[0];
        const marcaEncontrada = dadosFabricantes.find((item) => String(item.IDFABRICANTE) === String(dados?.IDMARCA));

        if(marcaEncontrada) {
            setMarcaSelecionada({ value: marcaEncontrada.IDFABRICANTE, label: `${marcaEncontrada.IDFABRICANTE} - ${marcaEncontrada.DSFABRICANTE}` });
        }
    }, [dadosVisualizarNFE, dadosFabricantes])

    useEffect(() => {
        if(!(dadosVisualizarNFE.length > 0) || !(dadosComprador.length > 0)) return;

        const dados = dadosVisualizarNFE[0];
        const compradorEncontrado = dadosComprador.find((item) => String(item.IDFUNCIONARIO) === String(dados?.IDCOMPRADOR));

        if(compradorEncontrado) {
            setCompradorSelecionado({ value: compradorEncontrado.IDFUNCIONARIO, label: compradorEncontrado.NOFUNCIONARIO });
        }
    }, [dadosVisualizarNFE, dadosComprador])

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

