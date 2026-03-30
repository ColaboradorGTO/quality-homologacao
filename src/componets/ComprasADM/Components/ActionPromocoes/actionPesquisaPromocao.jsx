import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { ActionListaPromocao } from "./actionListaPromocao";
import { getDataAtual, getDataDoisMesesAtras } from "../../../../utils/dataAtual";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionCadastroPromocaoModal } from "./ActionCadastrar/actionCadastroPromocaoModal";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaPromocao = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [modalCadastro, setModalCadastro] = useState(false)
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState("");
  const [dataPesquisaFim, setDataPesquisaFim] = useState("");
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInicio = getDataDoisMesesAtras()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)
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

  const fetchListaProdutos = async () => {
    const urlBase = `/listaPromocoes?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '')

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

  const { data: dadosListaPromocao = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchListaPromocao } = useQuery(
    ['listaPromocoes',],
    () => fetchListaProdutos(),
    { enabled: true, staleTime: 5 * 60 * 1000,  }
  )

  const handleClick = () => {
    refetchListaPromocao()
    setTabelaVisivel(true)
  }

  const handleClickModalCadastro = () => {
    setModalCadastro(true)
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Promoções"]}
        title="Programação -"
        subTitle="Promoções"

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Promoção"}
        onButtonClickCadastro={handleClickModalCadastro}
        corCadastro={"success"}
        IconCadastro={MdAdd}
      />

      <ActionListaPromocao 
        dadosListaPromocao={dadosListaPromocao} 
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}  
      />

      <ActionCadastroPromocaoModal
        show={modalCadastro}
        handleClose={() => setModalCadastro(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />

    </Fragment>
  )
}