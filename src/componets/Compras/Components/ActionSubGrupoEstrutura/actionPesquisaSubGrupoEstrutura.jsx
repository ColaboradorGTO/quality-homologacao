import { Fragment, useState, useEffect } from "react"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { MdAdd } from "react-icons/md"
import { ActionMain } from "../../../Actions/actionMain"
import { ActionListaSubGrupoEstrutura } from "./actionListaSubGrupoEstrutura"
import { ActionCadastroEstruturaModal } from "./ActionCadastro/actionCadastroEstruturaModal"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import Swal from "sweetalert2"


export const ActionPesquisaSubGrupoEstrutura = ({usuarioLogado }) => {
  const [descricao, setDescricao] = useState("")
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
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

  const fetchListaSubGrupo = async () => {
    const urlBase = `/subGrupoEstrutura?idSubGrupoEstrutura=${subGrupoSelecionado}&descricao=${descricao}`;
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
    
  const { data: dadosSubGrupo = [], error: errorSubGrupo, isLoading: isLoadingSubGrupo, refetch: refetchListaSubGrupo } = useQuery(
    ['subGrupoEstrutura',],
    () => fetchListaSubGrupo(),
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  )


  const handleClick = () => {
    refetchListaSubGrupo()
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
        title="SubGrupo de Estruturas Mercadológicas"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatórios - SubGrupo Estruturas Mercadológicas"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosSubGrupo.map((item) => {
            return { 
              value: item.IDSUBGRUPOESTRUTURA, 
              label: `${item.DSGRUPOESTRUTURA} - ${item.DSSUBGRUPOESTRUTURA}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Sub Grupo "}
        valueSelectSubGrupo={subGrupoSelecionado}
        onChangeSelectSubGrupo={(e) => setSubGrupoSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar SubGrupo Estruturas"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        
        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar SubGrupo Estruturas"}
        onButtonClickCadastro={handleCriar}
        IconCadastro={MdAdd}
        corCadastro={"success"}

      />

      
      <ActionListaSubGrupoEstrutura 
        dadosSubGrupo={dadosSubGrupo} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos} 
        handleClick={handleClick}  
      />
      

      <ActionCadastroEstruturaModal 
        show={modalVisivel} 
        handleClose={() => setModalVisivel(false)} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}