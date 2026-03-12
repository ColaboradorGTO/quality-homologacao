import { useEffect, useState } from "react";
import axios from "axios"
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { useQuery } from "react-query";
import { toFloat } from "../../../../../utils/toFloat";
import { set } from "date-fns";

export const useIncluirProutoPedido = ({ optionsModulos, usuarioLogado }) => {
    const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
    const [dataPesquisaFim, setDataPesquisaFim] = useState('')
    const [tabelaVisivel, setTabelaVisivel] = useState(true);
    const [tabelaCadastroProduto, setTabelaCadastroProduto] = useState(true);
    const [marcaSelecionada, setMarcaSelecionada] = useState('')
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
    const [compradorSelecionado, setCompradorSelecionado] = useState('')
    const [fiscalSelecionado, setFiscalSelecionado] = useState('')
    const [enviarSelecionado, setEnviarSelecionado] = useState('')
    const [condicoesPagamentosSelecionado, setCondicoesPagamentosSelecionado] = useState('')
    const [obsFornecedor, setObsFornecedor] = useState('')
    const [obsInterna, setObsInterna] = useState('')
    const [tipoPedidoSelecionado, setTipoPedidoSelecionado] = useState('')
    const [vendedor, setVendedor] = useState('')
    const [emailVendedor, setEmailVendedor] = useState('')
    const [desconto1, setDesconto1] = useState('')
    const [desconto2, setDesconto2] = useState('')
    const [desconto3, setDesconto3] = useState('')
    const [totalLiq, setTotalLiq] = useState('')
    const [comissao, setComissao] = useState('')
    const [transportadoraSelecionada, setTransportadoraSelecionada] = useState('')
    const [freteSelecionado, setFreteSelecionado] = useState('')
    const [modalPedidoNota, setModalPedidoNota] = useState(false);
    const [modalPedidoNotaSemPreco, setModalPedidoNotaSemPreco] = useState(false);
    const [arquivoGerado, setArquivoGerado] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [ipUsuario, setIpUsuario] = useState('');
    const [dataPedido, setDataPedido] = useState('')
    const [dataAtual, setDataAtual] = useState('')
    const [dataPrevisaoEntrega, setDataPrevisaoEntrega] = useState('');
    const [idResumoPedido, setIdResumoPedido] = useState('');
    const [stRascunho, setStRascunho] = useState('');
    const [checked, setChecked] = useState(false);
    const [fornecedorExiste, setFornecedorExiste] = useState(false);
    const [modalIncluirProdutoPedido, setModalIncluirProdutoPedido] = useState(false);

    useEffect(() => {
        const data = getDataAtual();
        setDataAtual(data);
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

    const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch: refetchFornecedor } = useQuery(
        'fornecedores',
        async () => {
            const response = await get(`/fornecedores`);
            return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosComprador = [], error: errorComprador, isLoading: isLoadingComprador, refetch: refetchComprador } = useQuery(
        'compradores',
        async () => {
        const response = await get(`/compradores`);
        return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
        'marcasLista',
        async () => {
        const response = await get(`/marcasLista`);
        return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosPagamentos = [], error: errorPagamentos, isLoading: isLoadingPagamentos, refetch: refetchPagamentos } = useQuery(
        'condicaoPagamento',
        async () => {
        const response = await get(`/condicaoPagamento`);
        return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosTransportador = [], error: errorTransportador, isLoading: isLoadingTransportador, refetch: refetchTransportador } = useQuery(
        'listaTransportador',
        async () => {
        const response = await get(`/listaTransportador`);
        return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosDetalhe = [], error: errorDetalhes, isLoading: isLoadingDetalhes, refetch: refetchListaProdutoPedidos } = useQuery(
        'lista-detalhe-pedidos',
        async () => {
        const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
        return response.data;
        },
        { staleTime: 5 * 60 * 1000, enabled: false }
    );

    const { data: dadosDetalhesPedidos = [], error: errorDetalhePedido, isLoading: isLoadingDetalhePedido, refetch: refetchListaDetalhePedidos } = useQuery(
        'lista-detalhe-pedidos',
        async () => {
        const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}&stTransformado=False`);
        return response.data;
        },
        { staleTime: 5 * 60 * 1000, enabled: false }
    );


    const { data: dadosProdutosPedidos = [], error: errorProdutosPedido, isLoading: isLoadingProdutosPedidos, refetch: refetchListaCadastroProdutoPedidos } = useQuery(
        'cadastrar-produto-Pedido',
        async () => {
        const response = await get(`/cadastrar-produto-Pedido?idResumoPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
        return response.data;
        },
        { staleTime: 5 * 60 * 1000, enabled: false }
    );
    // console.log(fornecedorExiste, 'fornecedorExiste fora')
    const verificaDadosDoFornecedorSelecionado = async (stCarregarDados = true) => {
        try {
            const fornecedor = dadosFornecedores.find(f => f.IDFORNECEDOR == fornecedorSelecionado.value);

            const fornecedorAtivo = fornecedor?.STATIVOSAP == 'Y' ? 'Fornecedor Ativo' : 'Fornecedor Inativo No SAP'
            const vinculoFabricante = !fornecedor?.VINCFABRICANTE ? 'Fornecedor Sem Fabricante Vinculado' : 'True'
            const titleOption = (fornecedorAtivo?.STATIVOSAP == 'Y' && !fornecedorAtivo?.VINCFABRICANTE) ? vinculoFabricante : null;
            let stFornecedor = titleOption !== 'Fornecedor Inativo No SAP' ? 'True' : 'False';
            let idVinculoFornecedor = vinculoFabricante == 'True' ? true : false;
            let msgPendencias = [];

            if (!stFornecedor || idVinculoFornecedor) {
                !stFornecedor && msgPendencias.push('Fornecedor selecionado está inativo ou não está cadastrado no SAP');
                !idVinculoFornecedor && msgPendencias.push('Fornecedor selecionado está sem vinculo com Fabricante');
            }

            if (stCarregarDados) {
                await carregarDadosDoFornecedorOuDoUltimoPedidoDoFornecedor();
            }

            if (msgPendencias.length > 0) {
                await exibirPendenciasFornecedor(msgPendencias);
            }
        } catch (error) {
            console.error('❌ Erro ao verificar fornecedor:', error);
            Swal.fire({
                icon: 'error',
                text: 'Erro ao tentar carregar as informações do fornecedor, recarregue e tente novamente!',
                customClass: {
                    container: 'custom-swal',
                },
            })
            return false;
        }
    }

    const carregarDadosDoFornecedorOuDoUltimoPedidoDoFornecedor = async () => {
        try {
            // 1. Obter ID do fornecedor (equivalente ao $("#idforn").val())
            const idFornPedido = fornecedorSelecionado?.value;

            if (!idFornPedido) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Selecione um fornecedor primeiro'
                });
                return;
            }

            // 2. Iniciar loading (equivalente à verificação $('.animacaoLoading'))
            Swal.fire({
                title: 'Carregando dados do fornecedor selecionado, aguarde...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                showConfirmButton: false
            });

            // 3. Buscar lista de pedidos do fornecedor
            const dadosPedidos = await get(`/lista-pedidos?idFornecedor=${idFornPedido}`);
            let dadosFornParaPreencher = dadosPedidos;
            let respQuestion = false;

            // 4. Se tem pedidos, perguntar se quer carregar do último pedido
            if (dadosPedidos?.data && dadosPedidos.data.length > 0) {
                Swal.close(); // Fechar o loading para mostrar a pergunta

                const result = await Swal.fire({
                    title: 'Carregar dados do último pedido?',
                    text: 'Deseja carregar as informações de acordo com último pedido realizado para este Fornecedor?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não'
                });

                respQuestion = result.isConfirmed;

                // Reabrir loading
                Swal.fire({
                    title: 'Processando dados...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    showConfirmButton: false
                });
            }

            // 5. Se não tem pedidos ou usuário escolheu não, buscar dados do fornecedor
            if (dadosPedidos?.data?.length === 0 || !respQuestion) {
                dadosFornParaPreencher = await get(`/lista-pedidos?idFornecedor=${idFornPedido}`);
            }

            // 6. Preencher dados do fornecedor no pedido
            await retornoDadosDoFonecedoNoPedido(dadosFornParaPreencher);

            Swal.close(); // Fechar loading de sucesso

        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao carregar os dados do fornecedor, recarregue e tente novamente!',
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error(error);
        }

    }

    const exibirPendenciasFornecedor = async (pendencias) => {
        const msgFormatada = pendencias.join(', ');

        // Verifica o andamento do pedido (você pode ajustar conforme sua lógica)
        const idAndamento = 1; // ou pegar de algum state

        if (idAndamento === 1 || idAndamento === 15) {
            await Swal.fire({
                icon: 'warning',
                title: 'Pendências Encontradas',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Este pedido só poderá ser salvo como rascunho devido às pendências:</strong></p>
                        <ul>
                            ${pendencias.map((pendencia, index) => `<li>${index + 1} - ${pendencia}</li>`).join('')}
                        </ul>
                    </div>
                `,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    };

    const retornoDadosDoFonecedoNoPedido = async (dadosFornecedor) => {
        try {
            const dados = dadosFornecedor?.data?.[0] || dadosFornecedor?.[0];
            const NUCNPJ = dados?.CNPJFORN;

            if (!dados) return;
            // Preencher os estados com os dados recebidos
            setDataPesquisaInicio(dados?.DTPEDIDOFORMATADA || '');
            setDataPesquisaFim(dados?.DTPREVENTREGAFORMATADA || '');
            
            setCompradorSelecionado({value: dados.IDCOMPRADOR,  label: dados.NOMECOMPRADOR });
    
    
            setMarcaSelecionada(dados?.NOFANTASIA || '');
            setObsFornecedor(dados?.OBSPEDIDO || '');
            setObsInterna(dados?.OBSPEDIDO2 || '');
            setVendedor(dados?.NOREPRESETANTE || dados?.NOVENDEDOR || '');
            setTipoPedidoSelecionado(dados?.MODPEDIDO || '');
            setEmailVendedor(dados?.EEMAIL || dados?.EEMAILVENDEDOR || dados?.EMAILFORN || '');
            // setTransportadoraSelecionada({value: dados?.IDTRANSPORTADORA, label: `${dados?.NOFANTASIA} - ${NUCNPJ}  `}) 
            setTransportadoraSelecionada({value: dados?.IDTRANSPORTADORA, label: `${NUCNPJ} - ${dados?.NOMETRANSPORTADORA}  `}) 
            console.log(transportadoraSelecionada, 'transportadoraSelecionada')
            console.log(dados, 'dados do fornecedor selecionado')
            setCondicoesPagamentosSelecionado({
            value: dados.IDCONDICAOPAGAMENTO, 
            label: dados.DSCONDICAOPAG
            } );
            
            // Configurar envio
            if (dados?.TPARQUIVO) {
            setEnviarSelecionado({
                value: dados.TPARQUIVO, 
                label: dados.TPARQUIVO === 'NE' ? 'NÃO ENVIAR' : 
                    dados.TPARQUIVO === 'ET' ? 'ETIQUETA' : 'ARQUIVO'
            });
            } else if (dados?.TPARQUIVOPADRAO) {
            setEnviarSelecionado({
                value: dados.TPARQUIVOPADRAO, 
                label: dados.TPARQUIVOPADRAO === 'NE' ? 'NÃO ENVIAR' : 
                    dados.TPARQUIVOPADRAO === 'ET' ? 'ETIQUETA' : 'ARQUIVO'
            });
            }
            
            setTipoPedidoSelecionado({
            value: dados?.TPPEDIDOPADRAO || dados?.MODPEDIDO, 
            label: dados?.MODPEDIDO || dados?.TPPEDIDOPADRAO
            });

  } catch (error) {
    console.error('Erro ao preencher dados do fornecedor:', error);
    Swal.fire({
      icon: 'error',
      text: 'Erro ao processar dados do fornecedor'
    });
  }
    }

    const onIncluirProdutoPedido = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Atenção',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Usuário não possui permissão para incluir produtos no pedido.`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {


            if (fornecedorSelecionado == '') {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'O campo fornecedor é obrigatório.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (!compradorSelecionado) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Selecione o Comprador do Pedido.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (marcaSelecionada) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Selecione uma Marca.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (!tipoPedidoSelecionado) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Selecione o Tipo Fiscal do Fornecedor.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (!vendedor) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Adicione o Nome do Vendedor.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (!transportadoraSelecionada) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Selecione a Transportadora.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else if (!freteSelecionado) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Selecione o Tipo de Frete.',
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            } else {

                const isUpdate = idResumoPedido.length > 0 && idResumoPedido;
                const data = {
                    ...(isUpdate && { IDRESUMOPEDIDO: idResumoPedido }),
                    IDGRUPOEMPRESARIAL: '',
                    IDSUBGRUPOEMPRESARIAL: '',
                    IDCOMPRADOR: compradorSelecionado?.value,
                    IDCONDICAOPAGAMENTO: condicoesPagamentosSelecionado?.value,
                    IDFORNECEDOR: fornecedorSelecionado?.value,
                    IDTRANSPORTADORA: transportadoraSelecionada?.value,
                    IDANDAMENTO: '',
                    MODPEDIDO: tipoPedidoSelecionado?.value,
                    NOVENDEDOR: vendedor,
                    EEMAILVENDEDOR: emailVendedor,
                    DTPEDIDO: dataPedido,
                    DTPREVENTREGA: dataPrevisaoEntrega,
                    TPFRETE: freteSelecionado?.value,
                    DESCPERC01: desconto1,
                    DESCPERC02: desconto2,
                    DESCPERC03: desconto3,
                    PERCCOMISSAO: comissao,
                    VRTOTALLIQUIDO: totalLiq,
                    OBSPEDIDO: obsInterna,
                    OBSPEDIDO2: obsFornecedor,
                    DTFECHAMENTOPEDIDO: dataAtual,
                    DTCADASTRO: dataAtual,
                    TPARQUIVO: enviarSelecionado?.value,
                    STDISTRIBUIDO: 'False',
                    STAGRUPAPRODUTO: 'False',
                    STCANCELADO: 'False',
                    TPFISCAL: fiscalSelecionado?.value,
                    STRASCUNHO: stRascunho || 'False'
                }

                const response = isUpdate ? await put('/atualizar-pedido/:id', data) : await post('/pedido', data);

                const textDados = JSON.stringify(data);
                let textFuncao = isUpdate ? 'COMPRAS / ATUALIZAR PEDIDO' : 'COMPRAS / INCLUIR PEDIDO';
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
                    text: isUpdate ? 'Pedido atualizado com sucesso.' : 'Pedido cadastrado com sucesso.',
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: {
                        container: 'custom-swal',
                    }
                })
            }
        } catch (error) {
            const textDados = JSON.stringify(data)
            let textFuncao = isUpdate ? 'COMPRAS / ATUALIZAR PEDIDO' : 'COMPRAS / INCLUIR PEDIDO';
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
                title: 'Erro ao tentar incluir o produto, recarregue e tente novamente!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
        }
    }

    return {
        tabelaVisivel,
        setTabelaVisivel,
        tabelaCadastroProduto,
        setTabelaCadastroProduto,
        marcaSelecionada,
        setMarcaSelecionada,
        fornecedorSelecionado,
        setFornecedorSelecionado,
        compradorSelecionado,
        setCompradorSelecionado,
        fiscalSelecionado,
        setFiscalSelecionado,
        enviarSelecionado,
        setEnviarSelecionado,
        condicoesPagamentosSelecionado,
        setCondicoesPagamentosSelecionado,
        obsFornecedor,
        setObsFornecedor,
        obsInterna,
        setObsInterna,
        tipoPedidoSelecionado,
        setTipoPedidoSelecionado,
        vendedor,
        setVendedor,
        emailVendedor,
        setEmailVendedor,
        desconto1,
        setDesconto1,
        desconto2,
        setDesconto2,
        desconto3,
        setDesconto3,
        totalLiq,
        setTotalLiq,
        comissao,
        setComissao,
        transportadoraSelecionada,
        setTransportadoraSelecionada,
        freteSelecionado,
        setFreteSelecionado,
        modalPedidoNota,
        setModalPedidoNota,
        modalPedidoNotaSemPreco,
        setModalPedidoNotaSemPreco,
        arquivoGerado,
        setArquivoGerado,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        dataPesquisaFim,
        setDataPesquisaFim,
        dataPesquisaInicio,
        setDataPesquisaInicio,
        idResumoPedido,
        setIdResumoPedido,
        checked,
        setChecked,
        modalIncluirProdutoPedido,
        setModalIncluirProdutoPedido,
        dadosFornecedores,
        dadosComprador,
        dadosMarcas,
        dadosPagamentos,
        dadosTransportador,
        dadosDetalhe, 
        dadosDetalhesPedidos,
        dadosProdutosPedidos,
        verificaDadosDoFornecedorSelecionado,
        onIncluirProdutoPedido
    }
}