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


export const ActionPesquisaEstilos = () => {
  // const [dadosEstilos, setDadosEstilos] = useState([])
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [descricao, setDescricao] = useState("")
  const [estiloSelecionado, setEstiloSelecionado] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const { data: dadosEstilos = [] } = useFetchData('listaEstilos', '/listaEstilos');
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
   
  const { data: dadosListaEstilos = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaEstilos } = useQuery(
    ['listaTodosPedidos',  estiloSelecionado, descricao,  currentPage, pageSize],
    () => fetchListaEstilos( estiloSelecionado, descricao, currentPage, pageSize),
    {
      enabled: Boolean(estiloSelecionado),
    }
  );

  // useEffect(() => {
  //   getListaEstilos()
  // }, [])

  // const getListaEstilos = async () => {
  //   try {
  //     const response = await get(`/listaEstilos?idEstilo=${estiloSelecionado}&descricao=${descricao}`)
  //     if (response.data) {
  //       setDadosEstilos(response.data)
  //     }
  //   } catch (error) {
  //     console.log(error, "não foi possivel pegar os dados da tabela ")
  //   }
  // }


  const handleChangeEstilo = (e) => {
    setEstiloSelecionado(e.value)
  }

  const handlePesquisar = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaEstilos()
    setTabelaVisivel(true)
  }

  const handleModal = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }


  const optionsF = [
    { value: '1', label: 'Ativo' },
    { value: '2', label: 'Inativo' }
  ]


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
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      {tabelaVisivel && (
        <ActionListaEstilos dadosListaEstilos={dadosListaEstilos} />
      )}

      <ActionCadastrarEstilosModal
        show={modalVisivel}
        handleClose={handleClose}
      />
    </Fragment>
  )
}

