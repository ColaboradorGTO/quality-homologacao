import { Fragment, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaGrupoEstrutura } from "./actionListaGrupoEstrutura";
import { ActionCadastroGrupoEstruturaModal } from "./ActionCadastrar/actionCadastroGrupoEstruturaModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";


export const ActionPesquisaGrupoEstrutura = ({usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState("")
  const [grupoSelecionado, setGrupoSelecionado] = useState("")
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

  const fetchListaGrupo = async () => {
    const urlBase = `/grupoEstrutura?idGrupoEstrutura=${grupoSelecionado}&descricaoGrupoEstrutura=${descricao}`;
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

  const { data: dadosGrupoEstrutura = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaGrupo } = useQuery(
    ['grupoEstrutura', grupoSelecionado, descricao, currentPage, pageSize],
    () => fetchListaGrupo(grupoSelecionado, descricao, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )



  const handleChangeGrupo = (e) => {
    setGrupoSelecionado(e.value)
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaGrupo()
    setTabelaVisivel(true)
      
  }

  const handleCriar = () => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar SubGrupo de Estrutura Mercadológica!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {
      setModalVisivel(true)
    }
  }

  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Grupos Estruturas Mercadológicas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Grupo Estrutura"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Grupo"}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosGrupoEstrutura.map((item) => {
            return {
              value: item.IDGRUPOESTRUTURA,
              label: item.DSGRUPOESTRUTURA
            }
          })
        ]}
        valueSelectGrupo={grupoSelecionado}
        onChangeSelectGrupo={handleChangeGrupo}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Grupo Estrutura"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Grupo Estrutura"}
        onButtonClickCadastro={handleCriar}
        IconCadastro={MdAdd}
        corCadastro={"success"}
        corSearch={"primary"}

      />

    

      <ActionListaGrupoEstrutura 
        dadosGrupoEstrutura={dadosGrupoEstrutura}  
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos} 
        handleClick={handleClick}
      />
      
      <ActionCadastroGrupoEstruturaModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}
