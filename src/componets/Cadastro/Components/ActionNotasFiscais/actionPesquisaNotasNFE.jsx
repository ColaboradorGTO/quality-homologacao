import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../hooks/useFetchData"
import { ActionListaNotasNFE } from "./actionListaNotasNFE"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { get } from "../../../../api/funcRequest"


export const ActionPesquisaNFE = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [actionVisivel, setActionVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState("")
  const [dataPesquisaFim, setDataPesquisaFim] = useState("")
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("")
  const [numSerie, setNumSerie] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataPesquisaInicio(dataAtual)
    setDataPesquisaFim(dataAtual)
  }, [])

  const { data: dadosFornecedores = [] } = useFetchData('fornecedores', '/fornecedores');
  const fetchListaNFE = async () => {
    try {
      const urlApi = `/nfPedido?idFornecedor=${fornecedorSelecionado}&numSerie=${numSerie}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
   
  const { data: dadosNFE = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaNFE } = useQuery(
    ['nfPedido',  fornecedorSelecionado, numSerie,  currentPage, pageSize],
    () => fetchListaNFE(fornecedorSelecionado, numSerie, currentPage, pageSize),
    {
      enabled: Boolean(dataPesquisaFim && dataPesquisaInicio)
    }
  );

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaNFE();
    setTabelaVisivel(true)
    

  }
  const handleClickAction = () => {
    setClickContador(prevContador => prevContador + 1);


    setActionVisivel(true)


  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Notas Fiscais"]}
        title="Lista de Notas Fiscais"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        labelInputFieldDTFim={"Data Fim"}
        InputFieldDTFimComponent={InputField}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectFornecedorComponent={InputSelectAction}
        labelSelectFornecedor={"Fornecedor"}
        optionsFornecedores={[
          { value: 0, label: "Selecione..." },
          ...dadosFornecedores.map((fornecedor) => ({
            value: fornecedor.IDFORNECEDOR,
            label: `${fornecedor.NOFANTASIA} - ${fornecedor.NUCNPJ} - ${fornecedor.NORAZAOSOCIAL}`,
          }))]}

        InputFieldSerieComponent={InputField}
        labelInputFieldSerie={"Nº Série"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={'primary'}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        onButtonClickModal={handleClickAction}
        linkNome={"Cadastrar NFE"}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

      {tabelaVisivel &&
        <ActionListaNotasNFE dadosNFE={dadosNFE} />
      }
    </Fragment>
  )
}