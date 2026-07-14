import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { MultSelectAction } from "../../../Select/MultSelectAction"
import { ActionListaVendasPCJ } from "./actionListaVendasPCJ"
import { ActionListaVendasMarcaROB } from "./actionListaVendasMarcaROB"
import { ActionListaVendasMarcaMarckup } from "./actionListaVendasMarcaMarckup"
import { ActionListaVendasMarca } from "./actionListaVendasMarca"
import { ActionListaVendasTicketMedio } from "./actionListaVendasTicketMedio"
import { getDataAtual } from "../../../../utils/dataAtual"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from 'react-query';
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento"

export const ActionPesquisaVendasMarca = () => {
  const [tabelaFinanceiroActionPesqVendasMarca, setTabelaFinanceiroActionPesqVendasMarca] = useState(false)
  const [tabelaFinanceiroActionPesqVendasMarcaMarckup, setTabelaFinanceiroActionPesqVendasMarcaMarckup] = useState(false)
  const [tabelaFinanceiroVendasPeriodoTicketMedio, setTabelaFinanceiroVendasPeriodoTicketMedio] = useState(false)
  const [tabelaFinanceiroResultadoOperacionalBruto, setTabelaFinanceiroResultadoOperacionalBruto] = useState(false)
  const [tabelaFinanceiroPCJVendas, setTabelaFinanceiroPCJVendas] = useState(false)
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaLivre, setEmpresaLivre] = useState([]);
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);

 
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])

  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );


  const fetchListaVendasPCJ = async () => {
    const urlBase = `/lista-caixas-movimento?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`;
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
  
  const { data: dadosVendasPCJ = [], error: errorVendasLoja, isLoading: isLoadingVendasPCJ, refetch: refecthPcj } = useQuery(
    ['lista-caixas-movimento'],
    () => fetchListaVendasPCJ(),
    { enabled: false, staleTime: 5 * 60 * 1000, }
  );
  
  const fetchListaVendasMarca = async () => {
    const urlBase = `/vendas-marca-periodo?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idEmpresa=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
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
  }

  const {data: dadosListaVendasMarca = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasMarca} = useQuery(
    ['vendas-marca-periodo'],
    () => fetchListaVendasMarca(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  ); 

  const fetchListaVendasMarcaROB = async ( ) => {
    const urlBase = `/vendaMarcaRob?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
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
  }

  const {data: dadosListaVendasMarcaROB = [], error: errorVendasMarcaROB, isLoading: isLoadingVendasMarcaROB, refetch: refetchVendasMarcaROB} = useQuery(
    ['vendaMarcaRob'],
    () => fetchListaVendasMarcaROB(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const fetchListaVendasMarcaMarckup = async () => {
    const urlBase = `/vendaMarcaMarckup?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
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
  }

  const {data: dadosListaVendasMarcaMarckup = [], error: errorVendasMarcaMarckup, isLoading: isLoadingVendasMarcaMarckup, refetch: refetchVendasMarcaMarckup} = useQuery(
    ['vendaMarcaMarckup'],
    () => fetchListaVendasMarcaMarckup(),
    { enabled: false, staleTime: 5 * 60 * 1000  }
  );


  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleChangeEmpresa = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setEmpresaSelecionada(selectedValues);
    
  }


  const handleClick = () => {
    setTabelaFinanceiroActionPesqVendasMarca(true)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)

    refetchVendasMarca()
  }

  const handleClickMarckup = () => {
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(true)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)

    refetchVendasMarcaMarckup()
  }

  const handleClickTicketMedio = () => {
    setTabelaFinanceiroVendasPeriodoTicketMedio(true)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)

    refetchVendasMarca()
  }

  const handleClickROB = () => {
    setTabelaFinanceiroResultadoOperacionalBruto(true)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)

    refetchVendasMarcaROB()
  }

  const handleClickPCJVendas = () => {

    setTabelaFinanceiroPCJVendas(true)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    refecthPcj();
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Vendas por Marcas e Período"
      

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Por Marca"}
        optionsMarcas={[
          { value: '0', label: 'Selecione uma Marca' },
          ...dadosMarcas?.map((item) => ({
            value: item.IDGRUPOEMPRESARIAL,
            label: item.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}


        MultSelectEmpresaComponent={MultSelectAction}
        optionsMultSelectEmpresa={[
          { value: '0', label: 'Selecione uma loja' },
          ...dadosEmpresas?.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelMultSelectEmpresa={"Empresa"}
        valueMultSelectEmpresa={empresaSelecionada}
        onChangeMultSelectEmpresa={handleChangeEmpresa}

        InputFieldComponent={InputField}
        labelInputField={"Empresas  Livre"}
        placeHolderInputFieldComponent={"Empresas Livres"}
        valueInputField={empresaLivre}
        onChangeInputField={(e) => setEmpresaLivre(e.target.value)}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Vendas por Período e Recebimentos"}
        onButtonClickCadastro={handleClick}
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}

        ButtonTypeVendasVendedor={ButtonType}
        linkNomeVendasVendedor={"Vendas por Período e Indicadores"}
        onButtonClickVendasVendedor={handleClickMarckup}
        corVendasVendedor={"info"}
        iconVendasVendedor={AiOutlineSearch}

        ButtonTypeSaldo={ButtonType}
        linkNomeSaldo={"Vendas por Período e Ticket Médio"}
        onButtonClickSaldo={handleClickTicketMedio}
        corTypeSaldo={"danger"}
        iconTypeSaldo={AiOutlineSearch}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"ROB - Resultado Operacional Bruto"}
        onButtonClickVendasEstrutura={handleClickROB}
        corVendasEstrutura={"warning"}
        iconVendasEstrutura={AiOutlineSearch}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"PCJ - Vendas"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        onButtonClickSearch={handleClickPCJVendas}

      />

      {tabelaFinanceiroActionPesqVendasMarca && (
        <ActionListaVendasMarca dadosListaVendasMarca={dadosListaVendasMarca} />
      )}


      {tabelaFinanceiroActionPesqVendasMarcaMarckup && (
        <ActionListaVendasMarcaMarckup dadosListaVendasMarcaMarckup={dadosListaVendasMarcaMarckup} />
      )}

      {tabelaFinanceiroResultadoOperacionalBruto && (
        <ActionListaVendasMarcaROB dadosListaVendasMarcaROB={dadosListaVendasMarcaROB} />
      )}


      {tabelaFinanceiroVendasPeriodoTicketMedio && (
        <ActionListaVendasTicketMedio dadosListaVendasMarca={dadosListaVendasMarca} />
      )}

      {tabelaFinanceiroPCJVendas && (
    
        <ActionListaVendasPCJ dadosVendasPCJ={dadosVendasPCJ} />
      )}

    </Fragment>
  )
}
