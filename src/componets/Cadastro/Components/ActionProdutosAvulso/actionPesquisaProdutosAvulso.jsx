import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaProdutoAvulso } from "./actionListaProdutoAvulso";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionCadastrarProodutodPedidoAvulsoModal } from "./actionCadastarProduto/actionCadastroProdutoPedidoAvulsoModal";


export const ActionPesquisaProdutosAvulso = ({ usuarioLogado }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [descricao, setDescricao] = useState('')
  const [codBarra, setCodBarra] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);
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

  const fetchListaProdutos = async () => {
    const urlBase = `/produtoAvulso?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&descricao=${descricao}&codigoBarra=${codBarra}`;
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

  const { data: dadosProdutosAvulso = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchProdutos } = useQuery(
    ['produtoAvulso', ],
    () => fetchListaProdutos(),
    { enabled: false, staleTime: 60 * 60 * 1000, }
  );

  const handleClick = () => {
    setTabelaVisivel(true)
    refetchProdutos()
  }


  const handleClickModal = () => {
    setModalVisivel(true)
  }
  const handleCloseModal = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>


      <ActionMain
        title="Dashboard Cadastros"
        subTitle="Movimento de Caixa"
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio="Data Início do Cadastro"
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim="Data Fim do Cadastro"
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra="Cod. Barras"
        valueInputFieldCodBarra={codBarra}
        onChangeInputFieldCodBarra={(e) => setCodBarra(e.target.value)}

        InputFieldComponent={InputField}
        labelInputField="Descrição"
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Produtos"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={handleClickModal}
        linkNome={"Cadastrar Produtos"}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />


      {tabelaVisivel &&
        <ActionListaProdutoAvulso 
          dadosProdutosAvulso={dadosProdutosAvulso} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos} 
          handleClick={handleClick} 
        />
      }

      <ActionCadastrarProodutodPedidoAvulsoModal
        show={modalVisivel}
        handleClose={handleCloseModal}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />


    </Fragment>
  )
}
