import { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { ActionListaImagemProduto } from "./actionListaProdutos"
import { ActionCadastroImagemProdutoModal } from "./ActionCadastrar/cadastroImagemProdutoModal"
import { useFetchData } from "../../../../hooks/useFetchData"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaProduto = () => {
  const [referencia, setReferencia] = useState('');
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('');
  const [estruturaSelecionada, setEstruturaSelecionada] = useState('');
  const [modalCadastro, setModalCadastro] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const fetchListaProdutos = async () => {
    try {
    
      const urlApi = `/imagemProdutos?nuRefImagemProduto=${referencia}&idFabricante=${fabricanteSelecionado}&idSubGrupoEstrutura=${estruturaSelecionada}`;
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
    
  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['imagemProdutos', referencia, fabricanteSelecionado, estruturaSelecionada, currentPage, pageSize],
    () => fetchListaProdutos(referencia, fabricanteSelecionado, estruturaSelecionada, currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const { data: dadosMercadoria = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('subGrupoEstrutura', '/subGrupoEstrutura');
  const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useFetchData('fabricantes', '/fabricantes');
  

  const handleSelectFabricante = (e) => {
    setFabricanteSelecionado(e.value);
  }

  const handleSelectStrutura = (e) => {
    setEstruturaSelecionada(e.value);
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaProdutos()
  }


  return (
    <Fragment>
      <ActionMain
        title="Imagens dos Produtos"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Imagens de Produtos"]}

        InputFieldComponent={InputField}
        labelInputField={"Por Referência"}
        valueInputField={referencia}
        onChangeInputField={(e) => setReferencia(e.target.value)}

        InputSelectFornecedorComponent={InputSelectAction}
        optionsFornecedores={[
          { value: '', label: 'selecione' },
          ...dadosMercadoria.map(item => ({
            value: item.IDSUBGRUPOESTRUTURA,
            label: `${item.IDSUBGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA} - ${item.DSSUBGRUPOESTRUTURA} `

          }))
        ]}
        labelSelectFornecedor={"Por Estrutura"}
        valueSelectFornecedor={estruturaSelecionada}
        onChangeSelectFornecedor={handleSelectStrutura}

        InputSelectFabricanteComponent={InputSelectAction}
        optionsFabricantes={[
          { value: '', label: 'selecione' },
          ...dadosFabricantes.map(item => ({
            value: item.IDFABRICANTE,
            label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
          }))
        ]}
        labelSelectFabricantes={"Por Fabricante"}
        valueSelectFabricante={fabricanteSelecionado}
        onChangeSelectFabricante={handleSelectFabricante}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Imagens"}
        onButtonClickCadastro={() => setModalCadastro(true)}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaImagemProduto dadosProdutos={dadosProdutos}/>
     
      <ActionCadastroImagemProdutoModal 
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
      />
    </Fragment>
  )
}