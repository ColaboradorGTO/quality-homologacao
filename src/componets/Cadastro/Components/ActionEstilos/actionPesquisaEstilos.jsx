import { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaEstilos } from "./actionListaEstilos";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { useFetchData } from "../../../../hooks/useFetchData";
import { ActionCadastrarEstilosModal } from "./ActionCadastrar/actionCadastrarEstilosModal";
import { MdAdd } from "react-icons/md";
import Swal from "sweetalert2";


export const ActionPesquisaEstilos = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [descricao, setDescricao] = useState("")
  const [estiloSelecionado, setEstiloSelecionado] = useState("")
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEstilos = [] } = useFetchData('listaEstilos', '/listaEstilos');
  const fetchListaEstilos = async () => {
    const urlBase = `/listaEstilos?idEstilo=${estiloSelecionado}&descricao=${descricao}`;
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

  const { data: dadosListaEstilos = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaEstilos } = useQuery(
    ['listaTodosPedidos', ],
    () => fetchListaEstilos(),
    { enabled: false, staleTime: 5 * 60 * 1000,}
  );

  const handleChangeEstilo = (e) => {
    setEstiloSelecionado(e.value)
  }

  const handleClick = () => {
    refetchListaEstilos()
    setTabelaVisivel(true)
  }

  const handleModal = () => {
    if(optionsModulos[0]?.CRIAR === 'True') {
      setModalVisivel(true)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar um novo estilo.`,
      });
      return;
    }
  }

  const handleClose = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>
      <ActionMain
        title="Relatórios - Estilos do Grupo da Estrutura Mercadológica"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Estilos"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosEstilos.map((item) => {
            return {
              value: item.ID_ESTILOS,
              label: `${item.DS_GRUPOESTILOS} - ${item.DS_ESTILOS}`
            }
          })
        ]}
        labelSelectSubGrupo={"Por Estilos (Grupo Estrutura - Estilos)"}
        valueSelectSubGrupo={estiloSelecionado}
        onChangeSelectSubGrupo={handleChangeEstilo}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      {tabelaVisivel && (
        <ActionListaEstilos 
          dadosListaEstilos={dadosListaEstilos} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          handleClick={handleClick}    
        />
      )}

      <ActionCadastrarEstilosModal
        show={modalVisivel}
        handleClose={handleClose}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}

