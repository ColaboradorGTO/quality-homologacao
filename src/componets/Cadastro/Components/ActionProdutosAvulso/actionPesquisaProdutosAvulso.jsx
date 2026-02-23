import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";

import { AiOutlineSearch } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { ActionListaProdutoAvulso } from "./actionListaProdutoAvulso";

import { ActionEditarProodutodPedidoAvulsoModal } from "./actionEditarProdutoPedidoAvulsoModal";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../utils/dataAtual";



export const ActionPesquisaProdutosAvulso = () => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [descricao, setDescricao] = useState('')
  const [codBarra, setCodBarra] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [pageSize, setPageSize] = useState(1000);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFinal)
  
  }, [])


  const fetchListaProdutos = async () => {
    try {
      const urlApi = `/produtoAvulso?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&descricao=${descricao}&codigoBarra=${codBarra}`;
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
   
  const { data: dadosProdutosAvulso = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchProdutos } = useQuery(
    ['produtoAvulso',  dataPesquisaInicio, dataPesquisaFim, descricao, codBarra,  currentPage, pageSize],
    () => fetchListaProdutos( dataPesquisaInicio, dataPesquisaFim, descricao, codBarra, currentPage, pageSize),
    {
      enabled: Boolean(dataPesquisaInicio && dataPesquisaFim),
    }
  );

  
  // const getTabelas = async () => {
  //   try {
  //     const response = await get(`/cadastrarProdutoAvulso?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&descricao=${descricao}&codigoBarra=${codBarra}`)
  //     if (response.data) {
  //       setDadosProdutosAvulso(response.data)
  //     }
  //   } catch (error) {
  //     console.log(error, "não foi possivel pegar os dados da tabela ")
  //   }
    
  // }

  const handleClick = () => {
    
    setTabelaVisivel(true)
    refetchProdutos()
    
  }


  const handleClickModal = () => {
    setModalVisivel(true)
  }
  const handleCloseModal = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>


      <ActionMain
        title="Dashboard Cadastros"
        subTitle="Movimento de Caixa"
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio="Data Início do Cadastro"
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim="Data Fim do Cadastro"
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra="Cod. Barras"
        valueInputFieldCodBarra={codBarra}
        onChangeInputFieldCodBarra={(e) => setCodBarra(e.target.value)}

        InputFieldComponent={InputField}
        labelInputField="Descrição"
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Produtos"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={handleClickModal}
        linkNome={"Cadastrar Produtos"}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />


      {tabelaVisivel &&
        <ActionListaProdutoAvulso dadosProdutosAvulso={dadosProdutosAvulso} /> 
      }

      <ActionEditarProodutodPedidoAvulsoModal
        show={modalVisivel}
        handleClose={handleCloseModal}
      />


    </Fragment>
  )
}
