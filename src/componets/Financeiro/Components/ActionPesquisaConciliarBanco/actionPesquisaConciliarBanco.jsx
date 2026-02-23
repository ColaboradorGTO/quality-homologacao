import { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import {  AiOutlineSearch } from "react-icons/ai"
import { ActionListaConsolidadoBanco } from "./actionListaConsolidadoBanco"
import { ActionListaConciliarPorBanco } from "./actionListaConciliarBanco"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { useQuery } from 'react-query';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaConciliarBanco = ({usuarioLogado, ID}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaVisivelConsolidado, setTabelaVisivelConsolidado] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [dataPesquisaInicioB, setDataPesquisaInicioB] = useState('')
  const [dataPesquisaFimB, setDataPesquisaFimB] = useState('')
  const [dataPesquisaInicioC, setDataPesquisaInicioC] = useState('')
  const [dataPesquisaFimC, setDataPesquisaFimC] = useState('')
  const [contaSelecionada, setContaSelecionada] = useState('')
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(500); 

  const { data: dadosContaBanco } = useQuery(
    'contaBanco',
    async () => {
      const response = await get(`/contaBanco`);
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const fetchConciliarBanco = async () => {
    const urlBase = `/deposito-loja-conciliacao?idConta=${contaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataCompensacaoInicio=${dataPesquisaInicioB}&dataCompensacaoFim=${dataPesquisaFimB}&dataMovimentoInicio=${dataPesquisaInicioC}&dataMovimentoFim=${dataPesquisaFimC}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosConciliarBanco = [], error: errorConciliarBanco, isLoading: isLoadingConciliarBanco, refetch: refetchConciliarBanco } = useQuery(
    ['deposito-loja-conciliacao'],
    () => fetchConciliarBanco(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  )

  const fetchConciliarBancoConsolidado = async () => {
    const urlBase = `/deposito-loja-consolidado?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataCompInicio=${dataPesquisaInicioB}&dataCompFim=${dataPesquisaFimB}&dataMovInicio=${dataPesquisaInicioC}&dataMovFim=${dataPesquisaFimC}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
        
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
    
  };

  const { data: dadosConciliarBancoConsolidado = [], error: errorBancoConsolidado, isLoading: isLoadingBancoConsolidado, refetch: refetchBancoConsolidado } = useQuery(
    ['deposito-loja-consolidado',  contaSelecionada, dataPesquisaInicio, dataPesquisaFim, dataPesquisaInicioB, dataPesquisaFimB, dataPesquisaInicioC, dataPesquisaFimC, currentPage, pageSize],
    () => fetchConciliarBancoConsolidado(contaSelecionada, dataPesquisaInicio, dataPesquisaFim, dataPesquisaInicioB, dataPesquisaFimB, dataPesquisaInicioC, dataPesquisaFimC, currentPage, pageSize),
    { enabled: false }
  )

  
  const onChangeSelectConta = (e) => {
    setContaSelecionada(e.value)
  }

  const handleClick = () => {

    setTabelaVisivel(true)
    setTabelaVisivelConsolidado(false)
    refetchConciliarBanco()
  }

  const handleClickConsolidado = () => {

    setTabelaVisivelConsolidado(true)
    setTabelaVisivel(false)
    refetchBancoConsolidado()
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Conciliação por Bancos"]}
        title="Conciliação por Bancos"
  
        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Depósito Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicio}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Depósito Fim"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFim}

        InputFieldDTInicioBComponent={InputField}
        labelInputDTInicioB={"Data Compensação Início"}
        valueInputFieldDTInicioB={dataPesquisaInicioB}
        onChangeInputFieldDTInicioB={(e) => setDataPesquisaInicioB(e.target.value)}

        InputFieldDTFimBComponent={InputField}
        labelInputDTFimB={"Data Compensação Fim"}
        onChangeInputFieldDTFimB={(e) => setDataPesquisaFimB(e.target.value)}
        valueInputFieldDTFimB={dataPesquisaFimB}

        InputFieldDTInicioCComponent={InputField}
        labelInputDTInicioC={"Data Movimento Início"}
        onChangeInputFieldDTInicioC={(e) => setDataPesquisaInicioC(e.target.value)}
        valueInputFieldDTInicioC={dataPesquisaInicioC}

        InputFieldDTFimCComponent={InputField}
        labelInputDTFimC={"Data Movimento Fim"}
        onChangeInputFieldDTFimC={(e) => setDataPesquisaFimC(e.target.value)}
        valueInputFieldDTFimC={dataPesquisaFimC}
        

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Conta Banco"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma conta' },
          ...(Array.isArray(dadosContaBanco)
            ? dadosContaBanco.map((item) => ({
                value: item.IDCONTABANCO,
                label: `${item.IDCONTABANCO} - ${item.DSCONTABANCO}`
              }))
            : [])
        ]}
        valueSelectEmpresa={contaSelecionada}
        onChangeSelectEmpresa={onChangeSelectConta}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Consolidado"}
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}
        onButtonClickCadastro={handleClickConsolidado}

      />

      {tabelaVisivel && (
        <ActionListaConciliarPorBanco 
          dadosConciliarBanco={dadosConciliarBanco} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}  
          handleClick={handleClick}
        />

      )}
      {tabelaVisivelConsolidado && (
        <ActionListaConsolidadoBanco  
          dadosConciliarBancoConsolidado={dadosConciliarBancoConsolidado}
        />

      )}
    </Fragment>
  )
}
