import { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { ActionListaProduto } from "./actionListaProdutos"
import { ActionCadastroImagemProdutoModal } from "./ActionCadastrar/cadastroImagemProdutoModal"
import { useFetchData } from "../../../../hooks/useFetchData"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"


export const ActionPesquisaProduto = ({usuarioLogado, ID}) => {
  const [referencia, setReferencia] = useState('');
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('');
  const [estruturaSelecionada, setEstruturaSelecionada] = useState('');
  const [pedido, setPedido] = useState('');
  const [modalCadastro, setModalCadastro] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
 

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const fetchListaProdutos = async () => {
    const urlBase = `/imagemProdutos?nuRefImagemProduto=${referencia}&idFabricante=${fabricanteSelecionado}&idSubGrupoEstrutura=${estruturaSelecionada}&idPedido=${pedido}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {

      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
    
  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['imagemProdutos'],
    () => fetchListaProdutos(),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
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

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Por Pedido"}
        valueInputFieldCodBarra={pedido}
        onChangeInputFieldCodBarra={(e) => setPedido(e.target.value)}
        placeHolderInputFieldCodBarra={"Número do Pedido"}

        InputFieldComponent={InputField}
        labelInputField={"Por Referência"}
        valueInputField={referencia}
        onChangeInputField={(e) => setReferencia(e.target.value)}
        placeHolderInputFieldComponent={"Número da Referência"}

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

      <ActionListaProduto 
        dadosProdutos={dadosProdutos}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}  
      />
     
      <ActionCadastroImagemProdutoModal 
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}