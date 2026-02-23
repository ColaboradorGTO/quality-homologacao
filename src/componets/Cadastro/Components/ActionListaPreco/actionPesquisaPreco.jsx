import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { get } from "../../../../api/funcRequest"
import { ButtonType } from "../../../Buttons/ButtonType"
import { getDataAtual } from "../../../../utils/dataAtual"
import { ActionListaPrecos } from "./actionListaPrecos"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData } from "../../../../hooks/useFetchData"


export const ActionPesquisaPreco = () => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [nomeLista, setNomeLista] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataPesquisaInicio = getDataAtual();
    const dataPesquisaFim = getDataAtual()
    setDataPesquisaInicio(dataPesquisaInicio)
    setDataPesquisaFim(dataPesquisaFim)
 
  }, [])

  const { data: dadosEmpresas = [] } = useFetchData('empresas', '/empresas');

  const fetchListaPreco = async () => {
    try {
      const urlApi = `/lista-de-preco?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLista=${numeroPedido}&nomeLista=${nomeLista}`;
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
   
  const { data: dadosListaPedidos = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaPreco } = useQuery(
    ['listaPreco', dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, numeroPedido, nomeLista, currentPage, pageSize],
    () => fetchListaPreco( currentPage, pageSize),
    {
      enabled: Boolean(dataPesquisaFim && dataPesquisaInicio)
    }
  );


  const handleChangeMarca = (e) => {
    setEmpresaSelecionada(e.value);
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaPreco();
    setTabelaVisivel(true)
  }


  return (

    <Fragment>

      <ActionMain
        title="Lista de Preços"
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Preços"]}

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"N° da Lista"}
        laceHolderInputFieldCodBarra={"Digite o N° da Lista"}
        valueInputFieldCodBarra={numeroPedido}
        onChangeInputFieldCodBarra={(e) => setNumeroPedido(e.target.value)}


        InputFieldComponent={InputField}
        labelInputField="Nome da Lista"
        placeHolderInputFieldComponent={"Digite o nome da lista"}
        valueInputField={nomeLista}
        onChangeInputField={(e) => setNomeLista(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lojas"}
        optionsEmpresas={[
          { value: 0, label: "Selecione..." },
          ...dadosEmpresas.map((marca) => ({
            value: marca.IDEMPRESA,
            label: marca.NOFANTASIA,
          }))]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeMarca}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
      />

      <ActionListaPrecos dadosListaPedidos={dadosListaPedidos} />

    </Fragment>
  )
}
