import { Fragment, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { ActionListaCores } from "./actionListaCores";
import { ActionCadastroCoresModal } from "./ActionCadastrarCores/actionCadastroCoresModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaCores = ({ usuarioLogado, ID }) => {
  const [descricao, setDescricao] = useState("")
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [corSelecionada, setCorSelecionada] = useState('');
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

  const { data: optionsCores = [], error: errorCores, isLoading: isLoadingCores, refetch: refetchCores } = useQuery(
    'listaCores',
    async () => {
      const response = await get(`/listaCores`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000}
  );

  const fetchListaCores = async () => {
    const urlBase = `/listaCores?idCor=${corSelecionada}&descricao=${descricao}`;
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

  const { data: dadosCores = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaCores } = useQuery(
    ['listaCores', corSelecionada, descricao, currentPage, pageSize],
    () => fetchListaCores(corSelecionada, descricao, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000 }
  )

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaCores()
    setTabelaVisivel(true)
  }

  const handleChangeCor = (e) => {
    setCorSelecionada(e.value)
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
        title="Relatórios - Cores"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Cores"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}


        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...optionsCores.map((item) => {
            return {
              value: item.ID_GRUPOCOR,
              label: `${item.DS_GRUPOCOR} - ${item.DS_COR}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Unidade"}
        valueSelectSubGrupo={corSelecionada}
        onChangeSelectSubGrupo={handleChangeCor}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Cores"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Cores"}
        onButtonClickCadastro={handleModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />

      {tabelaVisivel && (
        <ActionListaCores 
          dadosCores={dadosCores} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          refetchListaCores={refetchListaCores}  
        />
      )}

      <ActionCadastroCoresModal 
        show={modalVisivel} 
        handleClose={handleClose} 
        usuarioLogado={usuarioLogado}
        refetchListaCores={refetchListaCores}
        optionsModulos={optionsModulos}  
      />
    </Fragment>
  )
}
