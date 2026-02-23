import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionMain } from "../../../Actions/actionMain"
import { AiOutlineSearch } from "react-icons/ai"
import { get } from "../../../../api/funcRequest"
import { ActionListaCondicoesPagamentos } from "./actionListaCondicoesPagamentos"
import { ActionCadastroCondicaoPagamentoModal } from "./ActionCadastrar/cadastroCondicaoPagamentoModal"
import { MdAdd } from "react-icons/md"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useQuery } from "react-query"


export const ActionPesquisaCondicaoPagamento = ({usuarioLogado, ID}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState('')
  const [condicaoSelecionada, setCondicaoSelecionada] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
 

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsCondicoesPagamentos = [], error: errorCondicoesPagamentos, isLoading: isLoadingCondicoesPagamentos, refetch: refetchCondicoes } = useQuery(
    'condicaoPagamento',
    async () => {
      const response = await get(`/condicaoPagamento`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );

  const fetchListaCondicoes = async () => {
    const urlBase = `/condicaoPagamento?idCondPagamento=${condicaoSelecionada}&descricaoPagamento=${descricao}`;
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
    
  const { data: dadosCondicoesPagamentos = [], error: errorCondicoes, isLoading: isLoadingCondicoes, refetch: refetchListaCondicoes } = useQuery(
    ['condicaoPagamento'],
    () => fetchListaCondicoes(),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )


  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaCondicoes();
    setTabelaVisivel(true);
  }

  const handleShowModal = () => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para cadastrar uma nova Condição de Pagamento!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {
      setModalVisivel(true);
    }
  }

  const handleSelectPagamento = (e) => {
    setCondicaoSelecionada(e.value)
  }

  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Condições de Pagamento"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Condições de Pagamento"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}
        placeHolderInputFieldComponent={"Informe a descrição da condição de pagamento"}

        InputSelectPagamentoComponent={InputSelectAction}
        optionsPagamento={[
          { value: '', label: 'Selecione...' },
          ...optionsCondicoesPagamentos.map((item) => {
            return {
              value: item.IDCONDICAOPAGAMENTO,
              label: item.DSCONDICAOPAG
            }
          })
        ]}
        labelSelectPagamento={"Por Condição Pagamento"}
        valueSelectPagamento={condicaoSelecionada}
        onChangeSelectPagamento={handleSelectPagamento}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Condição Pagamento"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        
        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Condição Pagamento"}
        onButtonClickCadastro={handleShowModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaCondicoesPagamentos 
        dadosCondicoesPagamentos={dadosCondicoesPagamentos}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />

      <ActionCadastroCondicaoPagamentoModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />

    </Fragment>
  )
}

