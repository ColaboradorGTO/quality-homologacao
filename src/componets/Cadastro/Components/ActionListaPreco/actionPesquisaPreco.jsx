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


export const ActionPesquisaPreco = ({ usuarioLogado }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [nomeLista, setNomeLista] = useState('')
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataPesquisaInicio = getDataAtual();
    const dataPesquisaFim = getDataAtual()
    setDataPesquisaInicio(dataPesquisaInicio)
    setDataPesquisaFim(dataPesquisaFim)
  }, [])

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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [] } = useFetchData('empresas', '/empresas');


  const fetchListaPreco = async () => {
    const urlBase = `/lista-de-preco?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&idLista=${numeroPedido}&nomeLista=${nomeLista}`;
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

  const { data: dadosListaPedidos = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaPreco } = useQuery(
    ['listaPreco',],
    () => fetchListaPreco(),
    { enabled: false }
  )

  const handleClick = () => {
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
        onChangeSelectEmpresa={(e) => setEmpresaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Criar Lista"}
        onButtonClickCadastro
        IconCadastro={AiOutlineSearch}
        corCadastro={"success"}
      />

      <ActionListaPrecos
        dadosListaPedidos={dadosListaPedidos}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />

    </Fragment>
  )
}
