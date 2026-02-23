import { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { ActionListaUnidadeMedida } from "./actionListaUnidadeMedida";
import { ActionCadastroUnidadeMedidaModal } from "./ActionCadastroMedidas/actionCadastroUnidadeMedidaModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaUnidadeMedida = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState("")
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsMedidas = [], error: errorMedidas, isLoading: isLoadingMedidas, refetch: refetchMedidas } = useQuery(
    'unidades-de-Medidas',
    async () => {
      const response = await get(`/unidades-de-Medidas`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const fetchListaUnidadesMedidas = async () => {
    const urlBase = `/unidades-de-Medidas?idUnidadeMedida=${unidadeSelecionada}&descricao=${descricao}`;
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

  const { data: dadosUnidadeMedidas = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaUnidadesMedidas } = useQuery(
    ['unidades-de-Medidas', unidadeSelecionada, descricao, currentPage, pageSize],
    () => fetchListaUnidadesMedidas(),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )


  const handleChangeUnidade = (e) => {
    setUnidadeSelecionada(e.value)
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaUnidadesMedidas()
    setTabelaVisivel(true)
  }

  const handleModal = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>
      <ActionMain
        title="Relatórios - Unidades de Medidas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Unidades de Medidas"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição / Sigla"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...optionsMedidas.map((item) => {
            return {
              value: item.IDUNIDADEMEDIDA,
              label: `${item.DSUNIDADE} - ${item.DSSIGLA}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Unidade"}
        valueSelectSubGrupo={unidadeSelecionada}
        onChangeSelectSubGrupo={handleChangeUnidade}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Unidade de Medidas"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Unidade de Medidas"}
        onButtonClickCadastro={handleModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />


      <ActionListaUnidadeMedida
        dadosUnidadeMedidas={dadosUnidadeMedidas}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />


      <ActionCadastroUnidadeMedidaModal
        show={modalVisivel}
        handleClose={handleClose}
        refetchListaUnidadesMedidas={refetchListaUnidadesMedidas}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}