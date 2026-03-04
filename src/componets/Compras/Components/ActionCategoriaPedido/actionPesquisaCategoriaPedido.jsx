import { Fragment, useState, useEffect } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaCategoriaPedidos } from "./actionListaCategoriaPedido";
import { ActionCadastroCategoriaPedidoModal } from "./ActionCadastrar/actionCadastroCategoriaPedidoModal";
import { ActionListaCategoriaTamanho } from "./actionListaCategoriaTamanho";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useVincularTamanhoPedido } from "./hooks/useVincularTamanhoPedido";


export const ActionPesquisaCategoriaPedido = ({ usuarioLogado }) => {
  const [descricao, setDescricao] = useState('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaTamanhoCategoria, setTabelaTamanhoCategoria] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
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

  const { data: dadosTamanho = [], error: errorTamanhos, isLoading: isLoadingTamanhos } = useFetchData('tamanhosPedidos', '/tamanhosPedidos');

  const fetchListaCategoria = async () => {
    const urlBase = `/categoriaPedidos?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}`;
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

  const { data: dadosCategoria = [], error: errorCategoria, isLoading: isLoadingCategoria, refetch: refetchListaCategoria } = useQuery(
    ['categoriaPedidos', ],
    () => fetchListaCategoria(),
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  )

  const fetchListaCategoriaTamanhos = async () => {
    const urlBase = `/vinculo-tamanho-categoria?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}&idTamanho=${tamanhoSelecionado}`;
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

  const { data: dadosCategoriaTamanhos = [], error: errorCategoriaTamanhos, isLoading: isLoadingCategoriaTamanhos, refetch: refetchListaCategoriaTamanhos } = useQuery(
    ['vinculo-tamanho-categoria', ],
    () => fetchListaCategoriaTamanhos(),
    { enabled: Boolean(descricao), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  )

  const { data: dadosVinculados = [], error: errorVinculo, isLoading: isLoadingVinculo, refetch: refetchVinculo } = useQuery(
    ['vinculo-tamanho-categoria', categoriaSelecionada, descricao, tamanhoSelecionado],
    async () => {
      const response = await get(`/vinculo-tamanho-categoria?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}&idTamanho=${tamanhoSelecionado}`);
      return response.data;
    },
    { enabled: Boolean(categoriaSelecionada, tamanhoSelecionado), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );

  const handleClick = () => {
    refetchListaCategoria()
    setTabelaVisivel(true)
    setTabelaTamanhoCategoria(false)
  }

  const handlePesquisarTamanhoCategoria = () => {
    refetchListaCategoriaTamanhos()
    setTabelaTamanhoCategoria(true)
    setTabelaVisivel(false)
  }

  const {vincularCategoriaTamanho} = useVincularTamanhoPedido({  usuarioLogado, optionsModulos, categoriaSelecionada, tamanhoSelecionado, dadosVinculados, refetchVinculo})

  const handleModal = () => {
    setModalVisivel(true)
  }


  return (
    <Fragment>
      <ActionMain
        title="Relatórios -  Categorias de Pedido"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Categorias de Pedido"]}

        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Por Tamanhos de Pedido"}
        optionsEmpresas={[
          { value: '', label: 'Selecione...' },
          ...dadosTamanho.map((item) => {
            return { value: item.IDTAMANHO, label: item.DSTAMANHO }
          })
        ]}
        valueSelectEmpresa={tamanhoSelecionado}
        onChangeSelectEmpresa={(e) => setTamanhoSelecionado(e.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Por Categorias de Pedido"}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosCategoria.map((item) => {
            return {
              value: item.IDCATEGORIAPEDIDO,
              label: `${item.TIPOPEDIDO} - ${item.DSCATEGORIAPEDIDO}`
            }
          })
        ]}
        valueSelectGrupo={categoriaSelecionada}
        onChangeSelectGrupo={(e) => setCategoriaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Categorias de Pedido"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastro de Categorias de Pedido"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={" Vinculo Categorias - Tamanho"}
        onButtonClickCancelar={handlePesquisarTamanhoCategoria}
        corCancelar={"danger"}
        IconCancelar={AiOutlineSearch}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Vincular Categoria / Tamanho "}
        onButtonClickVendasEstrutura={vincularCategoriaTamanho}
        corVendasEstrutura={"warning"}
        iconVendasEstrutura={MdAdd}
      />

      {tabelaVisivel && (
        <ActionListaCategoriaPedidos
          dadosCategoria={dadosCategoria}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
          handleClick={handleClick}
        />
      )}

      {tabelaTamanhoCategoria && (
        <ActionListaCategoriaTamanho
          dadosCategoriaTamanhos={dadosCategoriaTamanhos}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
        />

      )}

      <ActionCadastroCategoriaPedidoModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        handleClick={handleClick}
      />
    </Fragment>
  )
}