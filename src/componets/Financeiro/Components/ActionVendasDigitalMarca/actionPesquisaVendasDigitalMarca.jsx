import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from 'react-query';

export const ActionPesquisVendasDigitalMarca = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [dadosVendasMarca, setDadosVendasMarca] = useState([])


  useEffect(() => {
    if (dataPesquisaInicio && dataPesquisaFim) {
      getListaVendasMarca()

    }
  }, [dataPesquisaInicio, dataPesquisaFim])

  const fetchListaVendasLojaPeriodo = async (empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize) => {
    try {
      
      let urlApi = `vendaLojaPeriodo?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
      let response = await get(`${urlApi}&page=${currentPage}`);
      let page = Number(response.page);
      let totalPages = page ? Math.round(Number(response.rows) / pageSize) : '';

      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++; 
  
            let responseNextPage = await get(`${urlApi}&page=${currentPage}`);
  
            if (responseNextPage.data.length) {
              allData.push(...responseNextPage.data);
              fetchNextPage(currentPage); 
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  };
  
  

  const { data: dadosVendasLoja = [], error: errorVendasLoja, isLoading: isLoadingVendasLoja, refetch } = useQuery(
    ['listaVendasLojaPeriodo', empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVendasLojaPeriodo(empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, 
    }
  );

  const getListaVendasMarca = async () => {

    try {
      const response = await get(`vendasDigitalResumidaMarca?page=1&dataPesqInicio=${dataPesquisaInicio}&dataPesqFim=${dataPesquisaFim}`)
      if (response.data) {
        setDadosVendasMarca(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela venda digital por marca")
    }

  }



  const handleClick = () => {
    
    setClickContador(prevContador => prevContador + 1);
    
    if (clickContador % 2 === 0) {
      getListaVendasMarca()
      setTabelaVisivel(true)
    } 

  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista Vendas Digital"]}
        title="Vendas Digital por Marcas e Período"
        subTitle="Nome da Loja"
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
        <ActionListaVendasDigitalMarca dadosVendasMarca={dadosVendasMarca} />
      )}

    </Fragment>
  )
}