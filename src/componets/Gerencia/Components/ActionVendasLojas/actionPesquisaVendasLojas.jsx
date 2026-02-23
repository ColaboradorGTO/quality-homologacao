import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ActionListaVendasProdutos } from "./actionListaVendasProdutos";
import { ActionListaVendasResumidas } from "./actionListaVendasResumida";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";



export const ActionPesquisaVendasLojas = ({usuarioLogado, optionsEmpresas}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [tabelaVisivelProduto, setTabelaVisivelProduto] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
 
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaFim(dataFinal);
    setDataPesquisaInicio(dataInicial);
  }, []);
  
    
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const fetchVendasProdutos = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/vendas-por-produtos?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados da api', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasLojaProdutos = [], error: erroProdutos, isLoading: isLoadingProdutos, refetch: refetchVendasProdutos } = useQuery(
    'vendas-por-produtos',
    () => fetchVendasProdutos(),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const fetchVendasLojasResumido = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/venda-resumido?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasLojaResumido = [], error: erroVendasResumidas, isLoading: isLoadingVendasResumidas, refetch: refetchVendasLojasResumido } = useQuery(
    'venda-resumido',
    () => fetchVendasLojasResumido(),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );
 
  const handleClick = () => {
  
    if (usuarioLogado && usuarioLogado.IDEMPRESA) {
      refetchVendasLojasResumido(usuarioLogado && usuarioLogado.IDEMPRESA) 
     setTabelaVisivel(true)
     setTabelaVisivelProduto(false)
   
    }

  }
  
  const handleClickVendaProduto = () => {

    if (usuarioLogado && usuarioLogado.IDEMPRESA) {
      refetchVendasProdutos(usuarioLogado && usuarioLogado.IDEMPRESA)
      setTabelaVisivelProduto(true)
      setTabelaVisivel(false)
    } 
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista Vendas da Lojas "]}
        title="Vendas Loja e Período"
        subTitle={usuarioLogado?.NOFANTASIA}

        InputSelectPendenciaComponent={InputSelectAction}
        labelSelectPendencia="Selecione a Empresa"
        optionsPendencia={[
          ...optionsEmpresas?.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
      
          }))
        ]}
        onChangeSelectPendencia={(e) =>  setEmpresaSelecionada(e.value) }
        valueSelectPendencia={empresaSelecionada}
        stylePendencia={optionsModulos[0]?.ADMINISTRADOR == "True"}

        InputFieldDTInicioAComponent={InputField}
        valueInputFieldDTInicioA={dataPesquisaInicio}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        
        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        valueInputFieldDTFimA={dataPesquisaFim}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Vendas Resumido"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Vendas Por Período"}
        oonButtonClickCadastro 
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}
        
        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Vendas Por Produto"}
        onButtonClickCancelar={handleClickVendaProduto}
        corCancelar={"warning"}
        IconCancela={AiOutlineSearch}
      />

      {tabelaVisivel && (

        <ActionListaVendasResumidas dadosVendasLojaResumido={dadosVendasLojaResumido} />
      )}

      {tabelaVisivelProduto &&
        <ActionListaVendasProdutos dadosVendasLojaProdutos={dadosVendasLojaProdutos}/>
      }

    </Fragment >
  )
}
