import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaPedidoCompra } from "./actionListaPedidoCompra";
import { useFetchData } from "../../../../hooks/useFetchData";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { ActionListaDistribuicaoSugestoesHistoricoVisualizar } from "./actionListaDistribuicaoSugestoesHistoricoVisualizar";
import { FaCheck } from "react-icons/fa6";
import { MdMenu, MdOutlineSearch } from "react-icons/md";


export const ActionPesquisaDistribuicaoHistorico = ({usuarioLogado}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaSugestao, setTabelaSugestao] = useState(false);
  const [tabelaVisualizar, setTabelaVisualizar] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [dadosSugestoesHistorico, setDadosSugestoesHistorico] = useState([]);
   const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
    
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
  
  // useEffect(() => {
  //   const dataInicial = getDataAtual()
  //   const dataFim = getDataAtual()
  //   setDataPesquisaInicio(dataInicial)
  //   setDataPesquisaFim(dataFim)

  // }, [])

  const fetchListaPedidos = async () => {
    const urlBase = `/distribuicao-compras-historico?idFornecedor=${fornecedorSelecionado}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  const { data: dadosPedidosCompra = [], error: errorPedidos, isLoading: isLoadingPedidos, refetch: refetchListaPedidos } = useQuery(
    ['imagemProdutos',],
    () => fetchListaPedidos(),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const { data: dadosFonecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('fornecedores', '/fornecedores');





  const handleSelectFornecedor = (e) => {
    setFornecedorSelecionado(e.value);
  }

  const handleClickActionDistribuicaoCompras = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaPedidos()
    setTabelaVisivel(true)
  }

  const handleModalVisivel = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }
  const options = [
    { value: '1', label: 'Marca 1' },
    { value: '2', label: 'Marca 2' },
    { value: '3', label: 'Marca 3' }
  ]
  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Distruibuição de Compras"]}
        title="Analisar Histórico da Distribuição de Compras"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Fornecedor"}
        optionsEmpresas={[
          { value: '', label: 'Selecione o Fornecedor' },
          ...dadosFonecedores.map(item => ({
            value: item.IDFORNECEDOR,
            label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`
          }))
        ]}
        valueSelectEmpresa={fornecedorSelecionado}
        onChangeSelectEmpresa={handleSelectFornecedor}



        InputFieldComponent={InputField}
        labelInputFieldF={"Numero Pedido"}
        placeHolderInputFieldComponent={"Numero Pedido"}
        valueInputField={numeroPedido}
        onChangeInputField={(e) => setNumeroPedido(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClickActionDistribuicaoCompras}
        corSearch={"primary"}
        IconSearch={MdOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome="Visualizar"
        onButtonClickCadastro
        corCadastro={"secondary"}
        IconCadastro={MdMenu}
        // styleCadastro

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Finalizar"}
        corCancelar={"success"}
        IconCancelar={FaCheck}
        // styleCancelar={}
      />

      {tabelaVisivel && (
        <ActionListaPedidoCompra 
          dadosPedidosCompra={dadosPedidosCompra} 
          dadosSugestoesHistorico={dadosSugestoesHistorico} 
          setDadosSugestoesHistorico={setDadosSugestoesHistorico}
          tabelaVisivel={tabelaVisivel}
          setTabelaVisivel={setTabelaVisivel}
          tabelaVisualizar={tabelaVisualizar}
          setTabelaVisualizar={setTabelaVisualizar}
          tabelaSugestao={tabelaSugestao}
          setTabelaSugestao={setTabelaSugestao}
          
        />

      )}

      {tabelaVisualizar && (

        <ActionListaDistribuicaoSugestoesHistoricoVisualizar
          dadosSugestoesHistorico={dadosSugestoesHistorico}
        />
      )}
    </Fragment>
  )
}
