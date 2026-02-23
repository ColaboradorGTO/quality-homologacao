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
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaVendasMarca = () => {
  const [tabelaFinanceiroActionPesqVendasMarca, setTabelaFinanceiroActionPesqVendasMarca] = useState(false)
  const [tabelaFinanceiroActionPesqVendasMarcaMarckup, setTabelaFinanceiroActionPesqVendasMarcaMarckup] = useState(false)
  const [tabelaFinanceiroVendasPeriodoTicketMedio, setTabelaFinanceiroVendasPeriodoTicketMedio] = useState(false)
  const [tabelaFinanceiroResultadoOperacionalBruto, setTabelaFinanceiroResultadoOperacionalBruto] = useState(false)
  const [tabelaFinanceiroPCJVendas, setTabelaFinanceiroPCJVendas] = useState(false)
  const [clickContador, setClickContador] = useState(0);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaLivre, setEmpresaLivre] = useState([]);
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);
  const [isQueryPcj, setIsQueryPcj] = useState(false);
  const [isQueryVendasMarca, setIsQueryVendasMarca] = useState(false);
  const [isQueryVendasMarcaROB, setIsQueryVendasMarcaROB] = useState(false);
  const [isQueryVendasMarcaMarckup, setIsQueryVendasMarcaMarckup] = useState(false);

 
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])


  const { data: optionsMarcas = [] } = useFetchData('marcasLista', '/marcasLista');
  const { data: optionsEmpresas = [], refetch: refetchEmpresas } = useFetchEmpresas(marcaSelecionada);

  const fetchListaVendasPCJ = async () => {
    const urlBase = `/lista-caixas-movimento?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
     fecharAnimacaoCarregamento();
    }
  };
  
  const { data: dadosVendasPCJ = [], error: errorVendasLoja, isLoading: isLoadingVendasPCJ, refetch: refecthPcj } = useQuery(
    ['lista-caixas-movimento', marcaSelecionada, empresaSelecionada, empresaLivre, currentPage, pageSize],
    () => fetchListaVendasPCJ(marcaSelecionada, empresaSelecionada, empresaLivre, currentPage, pageSize),
    { enabled: Boolean(isQueryPcj), staleTime: 5 * 60 * 1000, }
  );
  
  const fetchListaVendasMarca = async () => {
    const urlBase = `/vendas-marca-periodo?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idEmpresa=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
     fecharAnimacaoCarregamento();
    }
  }

  const {data: dadosListaVendasMarca = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasMarca} = useQuery(
    ['vendas-marca-periodo', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchListaVendasMarca(marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, empresaLivre),
    { enabled: Boolean(isQueryVendasMarca), staleTime: 5 * 60 * 1000 }
  ); 

  const fetchListaVendasMarcaROB = async ( ) => {
    const urlBase = `/vendaMarcaRob?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
     fecharAnimacaoCarregamento();
    }
  }

  const {data: dadosListaVendasMarcaROB = [], error: errorVendasMarcaROB, isLoading: isLoadingVendasMarcaROB, refetch: refetchVendasMarcaROB} = useQuery(
    ['vendaMarcaRob', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchListaVendasMarcaROB(marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, empresaLivre),
    { enabled: Boolean(isQueryVendasMarcaROB), staleTime: 5 * 60 * 1000 }
  );

  const fetchListaVendasMarcaMarckup = async () => {
    const urlBase = `/vendaMarcaMarckup?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLojaPesquisa=${empresaLivre}`
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', ''); 
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
     fecharAnimacaoCarregamento();
    }
  }

  const {data: dadosListaVendasMarcaMarckup = [], error: errorVendasMarcaMarckup, isLoading: isLoadingVendasMarcaMarckup, refetch: refetchVendasMarcaMarckup} = useQuery(
    ['vendaMarcaMarckup', marcaSelecionada, empresaSelecionada, empresaLivre],
    () => fetchListaVendasMarcaMarckup(marcaSelecionada, empresaSelecionada, empresaLivre),
    { enabled: Boolean(isQueryVendasMarcaMarckup), staleTime: 5 * 60 * 1000  }
  );


  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleChangeEmpresa = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    setEmpresaSelecionada(selectedValues);
    
  }


  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);
    setTabelaFinanceiroActionPesqVendasMarca(true)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)
    setIsLoadingPesquisa(true);
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryVendasMarca(true);
    refetchVendasMarca()
  }

  const handleClickMarckup = () => {
    setClickContador(prevContador => prevContador + 1);
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(true)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryVendasMarcaMarckup(true);
    refetchVendasMarcaMarckup()
  }

  const handleClickTicketMedio = () => {
    setClickContador(prevContador => prevContador + 1);
    setTabelaFinanceiroVendasPeriodoTicketMedio(true)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryVendasMarca(false);
    refetchVendasMarca()
  }

  const handleClickROB = () => {
    setClickContador(prevContador => prevContador + 1);
    setTabelaFinanceiroResultadoOperacionalBruto(true)
    setTabelaFinanceiroPCJVendas(false)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryVendasMarcaROB(true);
    refetchVendasMarcaROB()
  }

  const handleClickPCJVendas = () => {
    setClickContador(prevContador => prevContador + 1);
    setTabelaFinanceiroPCJVendas(true)
    setTabelaFinanceiroActionPesqVendasMarca(false)
    setTabelaFinanceiroActionPesqVendasMarcaMarckup(false)
    setTabelaFinanceiroVendasPeriodoTicketMedio(false)
    setTabelaFinanceiroResultadoOperacionalBruto(false)
    setIsLoadingPesquisa(true);
    setCurrentPage(prevPage => prevPage + 1);
    setIsQueryPcj(true);
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
          ...optionsMarcas.map((item) => ({
            value: item.IDGRUPOEMPRESARIAL,
            label: item.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}


        MultSelectEmpresaComponent={MultSelectAction}
        optionsMultSelectEmpresa={[
          { value: '0', label: 'Selecione uma loja' },
          ...optionsEmpresas.map((empresa) => ({
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
