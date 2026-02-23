import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { ActionListaVendasDigitalMarca } from "./actionListaVendasDigitalMarca"
import { AiOutlineSearch } from "react-icons/ai"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaVendasDigitalMarca = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)
  }, [])
  
  

  const fetchListaVendasMarca = async () => {
    try {
      
      const urlApi = `/venda-digital-marca?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
   
  const { data: dadosVendasMarca = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchListaVendasMarca } = useQuery(
    ['venda-digital-marca', dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVendasMarca(dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, staleTime: 5 * 60 * 1000,
    }
  );

  const handleClick = () => {
    setIsLoadingPesquisa(true);
    setCurrentPage(+1);
    refetchListaVendasMarca()
    setTabelaVisivel(true)
    
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista Vendas Digital"]}
        title="Vendas Digital por Marcas e Período"
        // subTitle="Nome da Loja"
        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (
        <Fragment>

        <ActionListaVendasDigitalMarca dadosVendasMarca={dadosVendasMarca} />
        </Fragment>
      )}

    </Fragment>
  )
}

