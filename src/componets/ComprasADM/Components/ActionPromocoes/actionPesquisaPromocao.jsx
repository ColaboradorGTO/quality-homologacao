import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { ActionListaPromocao } from "./actionListaPromocao";
import { getDataAtual, getDataDoisMesesAtras } from "../../../../utils/dataAtual";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionCadastroPromocaoModal } from "./ActionCadastrar/actionCadastroPromocaoModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaPromocao = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalCadastro, setModalCadastro] = useState(false)
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState("");
  const [dataPesquisaFim, setDataPesquisaFim] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  
  useEffect(() => {
    const dataInicio = getDataDoisMesesAtras()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)
  }, [])

  // const { data: dadosListaPromocao = [], error: errorPromocaoes, isLoading: isLoadingPromocoes } = useFetchData('listaPromocoes', '/listaPromocoes');
  
  
  const fetchListaProdutos = async () => {
    try {
    
      const urlApi = `/listaPromocoes?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
    
  const { data: dadosListaPromocao = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchListaPromocao } = useQuery(
    ['listaPromocoes', dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaProdutos(dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaPromocao()
    setTabelaVisivel(true)
  }

  const handleClickModalCadastro = () => {
    setModalCadastro(true)
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Promoções"]}
        title="Programação -"
        subTitle="Promoções"

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick }
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Promoção"}
        onButtonClickCadastro={handleClickModalCadastro}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaPromocao dadosListaPromocao={dadosListaPromocao} />

      <ActionCadastroPromocaoModal 
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
      />

    </Fragment>
  )
}