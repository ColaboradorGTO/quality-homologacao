import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaPedidoCompra } from "./actionListaPedidoCompra";
import { useFetchData } from "../../../../hooks/useFetchData";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";


export const ActionPesquisaDistribuicaoHistorico = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFim)
 
  }, [])
  
    const fetchListaPedidos = async () => {
      try {
      
        const urlApi = `/distribuicao-compras-historico?idFornecedor=${fornecedorSelecionado}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      
    const { data: dadosPedidosCompra = [], error: errorPedidos, isLoading: isLoadingPedidos, refetch: refetchListaPedidos } = useQuery(
      ['imagemProdutos', fornecedorSelecionado, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
      () => fetchListaPedidos(fornecedorSelecionado, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
      { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    )
  
    const { data: dadosFonecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('fornecedores', '/fornecedores');





  const handleSelectFornecedor = (e) => {
    setFornecedorSelecionado(e.value);
  }

  const handleClickActionDistribuicaoCompras = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaPedidos()
    setTabelaVisivel(true)
  }

  const handleModalVisivel = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }
  const options = [
    { value: '1', label: 'Marca 1' },
    { value: '2', label: 'Marca 2' },
    { value: '3', label: 'Marca 3' }
  ]
  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Distruibuição de Compras"]}
        title="Analisar Histórico da Distribuição de Compras"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Fornecedor"}
        optionsEmpresas={[
          { value: '', label: 'Selecione o Fornecedor' },
          ...dadosFonecedores.map(item => ({
            value: item.IDFORNECEDOR,
            label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`
          }))
        ]}
        valueSelectEmpresa={fornecedorSelecionado}
        onChangeSelectEmpresa={handleSelectFornecedor}



        InputFieldComponent={InputField}
        labelInputFieldF={"Numero Pedido"}
        placeHolderInputFieldComponent={"Numero Pedido"}
        valueInputField={numeroPedido}
        onChangeInputField={(e) => setNumeroPedido(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClickActionDistribuicaoCompras}
        corSearch={"primary"}
      />

      {tabelaVisivel && (
        <ActionListaPedidoCompra dadosPedidosCompra={dadosPedidosCompra} />
        
      )}

 
    </Fragment>
  )
}
