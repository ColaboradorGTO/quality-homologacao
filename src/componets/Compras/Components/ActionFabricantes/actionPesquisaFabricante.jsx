import { Fragment, useState, useEffect } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSave, AiOutlineSearch } from "react-icons/ai"
import { MdAdd } from "react-icons/md"
import { ActionListaFabricantes } from "./actionListaFabricantes"
import { ActionCadastroFabricanteModal } from "./ActionCadastrar/actionCadastroFabricanteModal"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useCadastrarVinculoFabricanteFornecedor } from "../ActionVincularFabricanteFornecedor/hooks/useCadastrarViculoFabricanteFornecedor"


export const ActionPesquisaFabricante = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalCadastrarFabricante, setModalCadastrarFabricante] = useState(false);
  const [nomeFabricante, setNomeFabricante] = useState('');
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('')
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);


  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);
  
  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: dadosFornecedores = [], error: errorFabricantes, isLoading: isLoadingFabricantes, refetch: refetchFabricante } = useQuery(
    'fornecedores',
    async () => {
      const response = await get(`/fornecedores`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000}
  );

  const fetchListaFornecedores = async () => {
    const urlBase = `/fabricantes`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {

      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      console.log('Primeira resposta:', primeiraResposta);
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

  const { data: dadosFabricantes = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch } = useQuery(
    ['fabricantes'],
    async () => fetchListaFornecedores(),
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000}
  );


  const fetchListaFabricanteFornecedor = async () => {
    const urlBase = `/fabricante-fornecedor?idFabricante=${fabricanteSelecionado}&descricaoFabricante=${nomeFabricante}&idFornecedor=${fornecedorSelecionado}`;
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

  const { data: dadosFabricantesFornecedor = [], error: errorFabricanteFornecedor, isLoading: isLoadingFabricanteFornecedor, refetch: refetchListaFabricanteFornecedor } = useQuery(
    ['fabricante-fornecedor'],
    () => fetchListaFabricanteFornecedor(),
    { enabled: false, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  )

  const { data: dadosVinculosFornecedores = [], error: errorVinculos, isLoading: isLoadingVinculos, refetch: refetchVinculos } = useQuery(
    'vincularFabricanteFornecedor',
    async () => {
      const response = await get(`/vincularFabricanteFornecedor?idFabricantePedido=${fabricanteSelecionado}&idFornecedorPedido=${fornecedorSelecionado}`);

      return response.data;
    },
    { enabled: Boolean(fabricanteSelecionado && fornecedorSelecionado), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000}
  );

  const handleClick = () => {
    refetchListaFabricanteFornecedor();
    setTabelaVisivel(false)
  }

  const handleModal = () => {
    setModalVisivel(true)
    setModalCadastrarFabricante(true)
  }

  const {
    handleCadastrarVinculo
  } = useCadastrarVinculoFabricanteFornecedor({
    dadosVinculosFornecedores, 
    usuarioLogado, 
    optionsModulos,
    fabricanteSelecionado,
    fornecedorSelecionado,
    refetchVinculos
  });

  return (

    <Fragment>

      <ActionMain
        title="Relatórios - Fabricantes"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Fabricantes"]}

        InputFieldComponent={InputField}
        labelInputField={"Nome Fabricante"}
        valueInputField={nomeFabricante}
        onChangeInputField={(e) => setNomeFabricante(e.target.value)}

        InputSelectFornecedorComponent={InputSelectAction}
        optionsFornecedores={[
          { value: '', label: 'selecione' },
          ...dadosFornecedores.map(item => ({
            value: item.IDFORNECEDOR,
            label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`

          }))
        ]}
        labelSelectFornecedor={"Por Fornecedor"}
        valueSelectFornecedor={fornecedorSelecionado}
        onChangeSelectFornecedor={(e) => setFornecedorSelecionado(e.value)}

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
        onChangeSelectFabricante={(e) => setFabricanteSelecionado(e.value)}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar Fabricante"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Fabricante"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Vincular Fabricante / Fornecedor"}
        onButtonClickCancelar={handleCadastrarVinculo}
        corCancelar={"warning"}
        IconCancelar={AiOutlineSave}
      />

      <ActionListaFabricantes
        dadosFabricantesFornecedo={dadosFabricantesFornecedor}
        dadosFornecedores={dadosFornecedores}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />

      <ActionCadastroFabricanteModal
        show={modalCadastrarFabricante}
        handleClose={() => setModalCadastrarFabricante(false)}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
        optionsModulos={optionsModulos}

      />

    </Fragment>
  )
}