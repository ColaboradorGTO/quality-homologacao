import { Fragment, useEffect, useRef, useState } from "react"
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { get } from "../../../../api/funcRequest"
import { ButtonType } from "../../../Buttons/ButtonType"
import { getDataAtual, getDataDoisMesesAtras } from "../../../../utils/dataAtual"
import { ActionListaPedidosPeriodo } from "./actionListaPedidosPeriodo"
import { ActionPDFPedidoResumido } from "./comprasActionPDFPedidoResumido"
import { ActionPDFPedidoDetalhado } from "./comprasActionPDFPedidoDetalhado"
import { ActionListaProdutosCriados } from "./actionListaProdutosCriados"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../hooks/useFetchData"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { CiEdit } from "react-icons/ci"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { MdOutlineLocalPrintshop, MdOutlineSend } from "react-icons/md"
import { SiSap } from "react-icons/si"
import { GrView } from "react-icons/gr"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ActionPDFPedido } from "./ActionPDF/actionPDFPedido"
import { ActionPDFPedidoSemPreco } from "./ActionPDFSemPreco/actionPDFPedidoSemPreco"
import { ActionNovoPedido } from "../ActionNovoPedido/actionNovoPedido"
import { formatMoeda } from "../../../../utils/formatMoeda"
import HeaderTable from "../../../Tables/headerTable"
import { optionsSap } from "../../../../../parceiro.json"
import { ActionEditarNovoPedido } from "../ActionNovoPedido/actionEditarNovoPedido"

export const ActionPesquisaHome = ({ usuarioLogado }) => {
  const [actionHome, setActionHome] = useState(true)
  const [actionListaPedidos, setActionListaPedidos] = useState(true)
  const [actionPedidoResumido, setActionPedidoResumido] = useState(false)
  const [actionPedidoDetalhado, setActionPedidoDetalhado] = useState(false)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [tabelaPedidoPeriodo, setTabelaPedidoPeriodo] = useState(true);
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('')
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('')
  const [compradorSelecionado, setCompradorSelecionado] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [actionProdutosCriados, setActionProdutosCriados] = useState(false)
  const [isQueryPedidoResumido, setIsQueryPedidoResumido] = useState(false)
  const [isQueryPedidos, setIsQueryPedidos] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [dadosVisualizarPedido, setDadosVisualizarPedido] = useState([]);
  const [dadosDetalhePedido, setDadosDetalhePedido] = useState([]);
  const [actionVisualizarPedido, setActionVisualizarPedido] = useState(false);
  const [actionEditarPedido, setActionEditarPedido] = useState(false);

  useEffect(() => {
    const dataPesquisaInicio = getDataDoisMesesAtras();
    const dataPesquisaFim = getDataAtual()
    setDataInicio(dataPesquisaInicio)
    setDataFim(dataPesquisaFim)
  }, [])

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
      setActionHome(true)
    }
  }, [setActionHome]);


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedo } = useQuery(
    'fornecedores',
    async () => {
      const response = await get(`/fornecedores`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosCompradores = [], error: errorCompradores, isLoading: isLoadingCompradores } = useQuery(
    'compradores',
    async () => {
      const response = await get(`/compradores`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsFabricantes = [], error: errorOptionsFabricantes, isLoading: isLoadingOptionsFabricantes } = useQuery(
    'fabricantes',
    async () => {
      const response = await get(`/fabricantes`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const fetchListaFabricantes = async (currentPage, pageSize) => {
    const urlBase = `/fabricantes`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes, refetch } = useQuery(
    ['fabricantes',],
    () => fetchListaFabricantes(),
    { enabled: false, cacheTime: 5 * 60 * 1000 }
  );

  const fetchListaPedidos = async () => {
    const urlBase = `/lista-pedidos?dataPesquisaInicio=${dataInicio}&dataPesquisaFim=${dataFim}&idMarca=${marcaSelecionada}&idFornecedor=${fornecedorSelecionado}&idFabricante=${fabricanteSelecionado}&idComprador=${compradorSelecionado}&stSituacaoSap=${situacaoSelecionada}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosListaPedidos = [], error: errorPedido, isLoading: isLoadingPedido, refetch: refetchListaPedidos } = useQuery(
    ['lista-pedidos',],
    () => fetchListaPedidos(),
    { enabled: true, cacheTime: 5 * 60 * 1000 }
  );

  const fetchPedidosResumido = async () => {
    const urlBase = `/lista-pedidos?dataPesquisaInicio=${dataInicio}&dataPesquisaFim=${dataFim}&idFornecedor=${fornecedorSelecionado}&idMarca=${marcaSelecionada}&idPedido=${numeroPedido}&idFabricante=${fabricanteSelecionado}&idComprador=${compradorSelecionado}&stSituacaoSAP=${situacaoSelecionada}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosPedidoResumido = [], error: errorVouchers, isLoading: isLoadingPedidoResumido, refetch: refetchPedidosResumido } = useQuery(
    ['lista-pedidos',],
    () => fetchPedidosResumido(),
    { enabled: false, cacheTime: 5 * 60 * 1000 }
  );

  const fetchPedidosDetalhados = async () => {
    const urlBase = `/listaPedidosDetalhado?dataPesquisaInicio=${dataInicio}&dataPesquisaFim=${dataFim}&idFornecedor=${fornecedorSelecionado}&idMarca=${marcaSelecionada}&idPedido=${numeroPedido}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosPedidosDetalhados = [], error: errorPedidoDetalhados, isLoading: isLoadingPedidoDetalhados, refetch: refetchPedidosDetalhados } = useQuery(
    ['listaPedidosDetalhado',],
    () => fetchPedidosDetalhados(),
    { enabled: false, cacheTime: 5 * 60 * 1000 }
  );

  const fetchPedidosCriados = async () => {
    const urlBase = `/cadastrar-produto-Pedido?idResumoPedido=${numeroPedido}&dataPesquisaInicio=${dataInicio}&dataPesquisaFim=${dataFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosListaProdutosCriados = [], error: errorPedidosCriados, isLoading: isLoadingPedidosCriados, refetch: refetchPedidosCriados } = useQuery(
    ['cadastrar-produto-Pedido',],
    () => fetchPedidosCriados(),
    { enabled: false, cacheTime: 5 * 60 * 1000 }
  );

  const handleClick = () => {
    setTabelaPedidoPeriodo(true)
    refetchListaPedidos()
  }

  const handleClickRelatorioResumido = () => {
    setActionPedidoResumido(true);
    setActionHome(false);
    setActionPedidoDetalhado(false);
    setTabelaPedidoPeriodo(false)
    refetchListaPedidos();
  }

  const handleClickRelatorioDetalhado = () => {
    setActionPedidoDetalhado(true);
    setActionPedidoResumido(false);
    setTabelaPedidoPeriodo(false)
    setActionHome(false);
    refetchPedidosDetalhados();
  }

  const handleClickRelatorioProdutosCriados = () => {
    setActionProdutosCriados(true);
    setActionPedidoDetalhado(false);
    setActionPedidoResumido(false);
    setTabelaPedidoPeriodo(false)
    refetchPedidosCriados();
  }

  const handleClickRelatorioDetalhadoReturn = () => {
    setActionPedidoDetalhado(false);
    setActionProdutosCriados(false);
    setActionPedidoResumido(false);
    setTabelaPedidoPeriodo(true)
    setActionHome(true);
  }

  return (

    <Fragment>

      {actionHome && (

        <ActionMain
          title="Dashboard Cadastros"
          subTitle=""
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}

          InputFieldDTInicioComponent={InputField}
          valueInputFieldDTInicio={dataInicio}
          labelInputFieldDTInicio={"Data Início"}
          onChangeInputFieldDTInicio={(e) => setDataInicio(e.target.value)}

          InputFieldDTFimComponent={InputField}
          labelInputFieldDTFim={"Data Fim"}
          valueInputFieldDTFim={dataFim}
          onChangeInputFieldDTFim={(e) => setDataFim(e.target.value)}

          InputFieldNumeroNFComponent={InputField}
          labelInputFieldNumeroNF={"N° Pedido"}
          valueInputFieldNumeroNF={numeroPedido}
          onChangeInputFieldNumeroNF={(e) => setNumeroPedido(e.target.value)}

          InputSelectMarcasComponent={InputSelectAction}
          labelSelectMarcas={"Marca"}
          optionsMarcas={[
            { value: 0, label: "Selecione..." },
            ...dadosMarcas.map((marca) => ({
              value: marca.IDGRUPOEMPRESARIAL,
              label: marca.GRUPOEMPRESARIAL,
            }))]}
          valueSelectMarca={marcaSelecionada}
          onChangeSelectMarcas={(e) => setMarcaSelecionada(e.value)}

          InputSelectFornecedorComponent={InputSelectAction}
          optionsFornecedores={[
            { value: 0, label: "Selecione..." },
            ...dadosFornecedores.map((fornecedor) => ({
              value: fornecedor.IDFORNECEDOR,
              label: `${fornecedor.NOFANTASIA} - ${fornecedor.NUCNPJ} - ${fornecedor.NORAZAOSOCIAL}`,
            }))]}
          defaultValueSelectFornecedor={fornecedorSelecionado}
          onChangeSelectFornecedor={(e) => setFornecedorSelecionado(e.value)}
          valueSelectFornecedor={fornecedorSelecionado}
          labelSelectFornecedor={"Por Fornecedor"}

          InputSelectFabricanteComponent={InputSelectAction}
          optionsFabricantes={[
            { value: 0, label: "Selecione..." },
            ...optionsFabricantes?.map((fabricante) => ({
              value: fabricante.IDFABRICANTE,
              label: fabricante.DSFABRICANTE,
            }))]}
          onChangeSelectFabricante={(e) => setFabricanteSelecionado(e.value)}
          valueSelectFabricante={fabricanteSelecionado}
          labelSelectFabricantes={"Por Fabricante"}

          InputSelectCompradorComponent={InputSelectAction}
          optionsCompradores={[
            { value: '', label: "Selecione..." },
            ...dadosCompradores.map((comprador) => ({
              value: comprador.IDFUNCIONARIO,
              label: comprador.NOFUNCIONARIO,
            }))]}
          onChangeSelectComprador={(e) => setCompradorSelecionado(e.value)}
          valueSelectComprador={compradorSelecionado}
          labelSelectComprador={"Por Comprador"}

          InputSelectSituacaoComponent={InputSelectAction}
          optionsSituacao={[
            { value: 0, label: "Selecione..." },
            ...optionsSap?.map((situacao) => ({
              value: situacao.value,
              label: situacao.label,
            }))]}
          labelSelectSituacao={"Por Situação"}
          valueSelectSituacao={situacaoSelecionada}
          onChangeSelectSituacao={(e) => setSituacaoSelecionada(e.value)}

          ButtonSearchComponent={ButtonType}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
          corSearch={"primary"}
          IconSearch={AiOutlineSearch}

          ButtonTypeCadastro={ButtonType}
          linkNome={"Relatório Resumido"}
          onButtonClickCadastro={handleClickRelatorioResumido}
          corCadastro={"success"}
          IconCadastro={AiOutlineSearch}

          ButtonTypeCancelar={ButtonType}
          linkCancelar={"Relatório Detalhado"}
          onButtonClickCancelar={handleClickRelatorioDetalhado}
          corCancelar={"warning"}
          IconCancelar={AiOutlineSearch}

          ButtonTypeVendasEstrutura={ButtonType}
          linkNomeVendasEstrutura={"Relatório Produtos Criados"}
          onButtonClickVendasEstrutura={handleClickRelatorioProdutosCriados}
          corVendasEstrutura={"info"}
          iconVendasEstrutura={AiOutlineSearch}
        />
      )}

      {!actionPedidoResumido && actionListaPedidos && actionHome && (
        <ActionListaPedidosPeriodo 
          dadosListaPedidos={dadosListaPedidos} 
          setDadosVisualizarPedido={setDadosVisualizarPedido}
          setDadosDetalhePedido={setDadosDetalhePedido}
          dadosDetalhePedido={dadosDetalhePedido}
          setActionVisualizarPedido={setActionVisualizarPedido}
          actionVisualizarPedido={actionVisualizarPedido}
          actionEditarPedido={actionEditarPedido}
          setActionEditarPedido={setActionEditarPedido}
          setActionPedidoResumido={setActionPedidoResumido}
          actionHome={actionHome}
          setActionHome={setActionHome}
          handleClick={handleClick}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          // actionListaPedidos={actionListaPedidos}
          // setActionListaPedidos={setActionListaPedidos}
        
        />
      )}

      {actionPedidoResumido && (
        <ActionPDFPedidoResumido dadosPedidoResumido={dadosPedidoResumido} />
      )}

      {actionPedidoDetalhado && (
        <ActionPDFPedidoDetalhado dadosPedidosDetalhados={dadosPedidosDetalhados} />
      )}

      {actionProdutosCriados && (
        <ActionListaProdutosCriados dadosListaProdutosCriados={dadosListaProdutosCriados} />
      )}

      
      {actionVisualizarPedido && (
        
        <ActionNovoPedido 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          dadosVisualizarPedido={dadosVisualizarPedido}
          dadosDetalhePedido={dadosDetalhePedido} 
          actionVisualizarPedido={actionVisualizarPedido}
          setActionVisualizarPedido={setActionVisualizarPedido}
          setActionEditarPedido={setActionEditarPedido}
          actionHome={actionHome}
          setActionHome={setActionHome}
        />
      )}

      {actionEditarPedido && (
        <ActionEditarNovoPedido
          dadosVisualizarPedido={dadosVisualizarPedido}
          dadosDetalhePedido={dadosDetalhePedido}
        />
      )}

     
    </Fragment>
  )
}