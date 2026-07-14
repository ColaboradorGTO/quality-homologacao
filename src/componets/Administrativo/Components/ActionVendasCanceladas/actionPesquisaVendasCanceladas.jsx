import React, { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionMain } from "../../../Actions/actionMain"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaVendasCanceladas } from "./actionListaVendasCanceladas"
import { ActionListaVendasCanceladasMinutos } from "./actionListaVendasCanceladasMinutos"
import { ActionListaVendasCanceladasWeb } from "./actionListaVendasCanceladasWeb"
import { ActionListaVendasCanceladasEmitidaPDV } from "./actionListaVendasCanceladasEmitidaPDV"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"
import { ActionListaVendasCanceladasEmTelaPDV } from "./actionListaVendasCanceladasEmTelaPDV"
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento"

export const ActionPesquisaVendasCanceladas = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaVendaWebVisivel, setTabelaVendaWebVisivel] = useState(false);
  const [tabelaVendaEmitidaPDVVisivel, setTabelaVendaEmitidaPDVVisivel] = useState(false);
  const [tabelaVendaCanceladaTelaPDV, setTabelaVendaCanceladaTelaPDV] = useState(false);
  const [tabelaVendaCanceladaMinutoVisivel, setTabelaVendaCanceladaMinutoVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)

  }, [])

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);

      return response.data;
    },
    { enabled: Boolean(marcaSelecionada), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );

  const fetchVendasCanceladas = async () => {
    const urlBase = `/venda-ativa?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&statusCancelado=True`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasCanceladas = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasCanceladas } = useQuery(
    ['venda-ativa',],
    () => fetchVendasCanceladas(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const fetchVendasCanceladas30Minutos = async () => {
    const urlBase = `venda-ativa?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&statusCanceladoDepois30Minutos=True`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasCanceladasMinutos = [], error: errorVendasCanceladas30Minutos, isLoading: isLoadingVendasCanceladas30Minutos, refetch: refetchVendasCanceladas30Minutos } = useQuery(
    ['venda-ativa',],
    () => fetchVendasCanceladas30Minutos(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const fetchVendasCanceladasWeb = async () => {
    const urlBase = `venda-ativa?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&statusCanceladoWeb=True`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasCanceladasWeb = [], error: errorVendasCanceladasWeb, isLoading: isLoadingVendasCanceladasWeb, refetch: refetchVendasCanceladasWeb } = useQuery(
    ['venda-ativa',],
    () => fetchVendasCanceladasWeb(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const fetchVendasCanceladasEmitidasPDV = async () => {
    const urlBase = `venda-ativa?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&stCanceladoPDVEmitida=True`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasCanceladasEmitidasPDV = [], error: errorVendasCanceladasEmitidasPDV, isLoading: isLoadingVendasCanceladasEmitidasPDV, refetch: refetchVendasCanceladasEmitidasPDV } = useQuery(
    ['venda-ativa', 'emitida'],
    () => fetchVendasCanceladasEmitidasPDV(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const fetchVendasCanceladasEmTelaPDV = async () => {
    const urlBase = `/venda-ativa?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&stCanceladoPDVEmTela=True`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');

    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasCanceladasEmTelaPDV = [], error: errorVendasCanceladasEmTelaPDV, isLoading: isLoadingVendasCanceladasEmTelaPDV, refetch: refetchVendasCanceladasEmTelaPDV } = useQuery(
    ['venda-ativa', 'em-tela'],
    () => fetchVendasCanceladasEmTelaPDV(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleClick = () => {
    refetchVendasCanceladas()
    setTabelaVisivel(true)
    setTabelaVendaCanceladaMinutoVisivel(false)
    setTabelaVendaWebVisivel(false)
    setTabelaVendaEmitidaPDVVisivel(false)
    setTabelaVendaCanceladaTelaPDV(false)
  }

  const handleClickMinutos = () => {
    refetchVendasCanceladas30Minutos()
    setTabelaVendaCanceladaMinutoVisivel(true)
    setTabelaVisivel(false)
    setTabelaVendaWebVisivel(false)
    setTabelaVendaEmitidaPDVVisivel(false)
    setTabelaVendaCanceladaTelaPDV(false)
  }

  const handleClickWeb = () => {
    refetchVendasCanceladasWeb()
    setTabelaVendaWebVisivel(true)
    setTabelaVisivel(false)
    setTabelaVendaCanceladaMinutoVisivel(false)
    setTabelaVendaEmitidaPDVVisivel(false)
    setTabelaVendaCanceladaTelaPDV(false)
  }

  const handleClickEmitidasPDV = () => {
    refetchVendasCanceladasEmitidasPDV()
    setTabelaVendaEmitidaPDVVisivel(true)
    setTabelaVendaWebVisivel(false)
    setTabelaVisivel(false)
    setTabelaVendaCanceladaMinutoVisivel(false)
    setTabelaVendaCanceladaTelaPDV(false)

  }
  const handleClickVendasCanceladaPDV = () => {
    refetchVendasCanceladasEmTelaPDV()
    setTabelaVendaCanceladaTelaPDV(true)
    setTabelaVendaEmitidaPDVVisivel(false)
    setTabelaVendaWebVisivel(false)
    setTabelaVisivel(false)
    setTabelaVendaCanceladaMinutoVisivel(false)
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas Convênio por Loja e Período"]}
        title="Vendas Canceladas por Loja e Peíodo"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '0', label: 'Todas' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))]}
        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Por Marca"}
        optionsMarcas={[
          { value: '0', label: 'Selecione uma Marca' },
          ...optionsMarcas.map((item) => ({
            value: item.IDGRUPOEMPRESARIAL,
            label: item.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Todas"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={handleClickMinutos}
        linkNome={"Pesquisa Canc. + 30 Min."}
        IconCadastro={AiOutlineSearch}
        corCadastro={"info"}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Pesquisa Canc. Web"}
        onButtonClickCancelar={handleClickWeb}
        IconCancelar={AiOutlineSearch}
        corCancelar={"success"}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Pesquisa Canc. Emitidas PDV"}
        onButtonClickVendasEstrutura={handleClickEmitidasPDV}
        iconVendasEstrutura={AiOutlineSearch}
        corVendasEstrutura={"danger"}

        ButtonTypeVendasVendedor={ButtonType}
        linkNomeVendasVendedor={"Pesquisa Canc. Em Tela PDV"}
        onButtonClickVendasVendedor={handleClickVendasCanceladaPDV}
        iconVendasVendedor={AiOutlineSearch}
        corVendasVendedor={"warning"}
      />


      {tabelaVisivel &&
        <ActionListaVendasCanceladas
          dadosVendasCanceladas={dadosVendasCanceladas}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      }

      {tabelaVendaCanceladaMinutoVisivel &&
        <ActionListaVendasCanceladasMinutos
          dadosVendasCanceladasMinutos={dadosVendasCanceladasMinutos}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      }

      {tabelaVendaWebVisivel &&
        <ActionListaVendasCanceladasWeb
          dadosVendasCanceladasWeb={dadosVendasCanceladasWeb}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      }

      {tabelaVendaEmitidaPDVVisivel &&
        <ActionListaVendasCanceladasEmitidaPDV
          dadosVendasCanceladasEmitidasPDV={dadosVendasCanceladasEmitidasPDV}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      }

      {tabelaVendaCanceladaTelaPDV &&
        <ActionListaVendasCanceladasEmTelaPDV
          dadosVendasCanceladasEmTelaPDV={dadosVendasCanceladasEmTelaPDV}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      }

    </Fragment>
  )
}