import { Fragment, useState, useEffect } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaEstilos } from "./actionListaEstilos";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { MdAdd } from "react-icons/md";
import { ActionCadastrarEstilosModal } from "./ActionCadastrarEstilos/actionCadastrarEstilosModal";
import Swal from "sweetalert2";

export const ActionPesquisaEstilos = ({usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const fetchListaEstilos = async () => {
    try {
      const urlApi = `/listaEstilos?idEstilo=${estiloSelecionado}&descricao=${descricao}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
        
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
  
  const { data: dadosEstilos = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchListaEstilos } = useQuery(
    ['listaEstilos', ],
    () => fetchListaEstilos(),
    { enabled: true, staleTime: 60 * 60 * 1000, }
  )

  const handleChangeEstilo = (e) => {
    setEstiloSelecionado(e.value)
  }

  const abreModalCadastro = () => {
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

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaEstilos()
    setTabelaVisivel(true)
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
        linkNomeSearch={"Pesquisar Estilos"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={abreModalCadastro}
        linkNome={"Cadastrar Estilos"}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      {tabelaVisivel && (
        <ActionListaEstilos 
          dadosEstilos={dadosEstilos} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          handleClick={handleClick}  
        />
      )}

      <ActionCadastrarEstilosModal 
        show={modalVisivel} 
        handleClose={(e) => setModalVisivel(false)} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}
