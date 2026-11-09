import { Fragment } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { AiOutlineSearch } from "react-icons/ai"
import { IoMdAdd, IoMdCheckmark } from "react-icons/io"
import { ActionCadastrarModal } from "./CadastrarSolicitacao/actionCadastrarModal"
import { ActionListaAdiantamento } from "./actionListaSolicitarAdiantamento"
import { Departamentos } from "../../../../../parceiro.json";
import { usePesquisa } from "../hooks/usePesquisa"
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento"
import { get } from "../../../../api/funcRequest"
import { useEffect, useRef } from "react"
import { useState } from "react"
import Swal from "sweetalert2"
import { Cards } from "../../../Financeiro/Components/ActionAdiantamento/Cards/card"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"

export const ActionPesquisaCriarAdiantamento = ({ usuarioLogado, ID }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('')
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [modal, setModal] = useState(false)
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    // setDataPesquisaInicio(dataInicial);
    // setDataPesquisaFim(dataFinal);
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


  // Provisão Financeira: o usuário só enxerga os adiantamentos do próprio departamento
  const departamentoUsuario = usuarioLogado?.DEPARTAMENTO || ''

  const fetchListaVendasConciliacao = async (status = statusSelecionado, exibirCarregamento = true) => {
    if (!departamentoUsuario) {
      if (exibirCarregamento) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Usuário sem departamento cadastrado.',
          text: 'Não é possível listar os adiantamentos.',
          customClass: { container: 'custom-swal' },
        });
      }
      return [];
    }

    const urlBase = `/lista-adiantamento-departamento?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&status=${status}&departamento=${encodeURIComponent(departamentoUsuario)}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    const controller = new AbortController();
    let allData = [];

    try {
      if (exibirCarregamento) animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (exibirCarregamento && foiCancelado()) break;
          if (exibirCarregamento) animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData.filter(item => item.DEPARTAMENTO === departamentoUsuario);
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData.filter(item => item.DEPARTAMENTO === departamentoUsuario);
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      if (exibirCarregamento) fecharAnimacaoCarregamento();
    }
  };

  // Chaves próprias da Provisão para não reaproveitar o cache da tela do Financeiro (todos os departamentos)
  const { data: dadosAdiantamentos = [], error: errorVendasConciliacao, isLoading: isLoadingVendasConciliacao, refetch } = useQuery(
    ['provisao-lista-adiantamento-departamento', departamentoUsuario],
    () => fetchListaVendasConciliacao(),
    { enabled: false }
  );

  const { data: dadosCards = [], refetch: refetchCards } = useQuery(
    ['provisao-cards-adiantamento-departamento', departamentoUsuario],
    () => fetchListaVendasConciliacao('', false),
    { enabled: Boolean(departamentoUsuario) }
  );

  const pesquisaPorCard = useRef(false);

  useEffect(() => {
    if (pesquisaPorCard.current) {
      pesquisaPorCard.current = false;
      refetch();
    }
  }, [statusSelecionado]);

  const handleClickCard = (status) => {
    if (status === statusSelecionado) {
      refetch();
      return;
    }
    pesquisaPorCard.current = true;
    setStatusSelecionado(status);
  }

  const handleShowModal = () => {
    setModal(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const options = [
    { value: 'AGUARDANDO FINANCEIRO', label: 'AGUARDANDO FINANCEIRO' },
    { value: 'PAGO', label: 'PAGO' },
    { value: 'COMPROVANTE ANEXADO', label: 'COMPROVANTE ANEXADO' },
    { value: 'AGUARDANDO NOTA FISCAL', label: 'AGUARDANDO NOTA FISCAL' },
    { value: 'PAGAMENTO RECUSADO', label: 'PAGAMENTO RECUSADO' },
    { value: 'NOTA FISCAL EM ATRASO', label: 'NOTA FISCAL EM ATRASO' }
  ]

  const handleClick = () => {
    refetch()
    refetchCards()
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Adiantamento Salarial"]}
        title="Adiantamentos Departamentos"

        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas="Departamentos"
        optionsMarcas={[
          {
            value: departamentoUsuario,
            label: Departamentos.find((item) => item.value === departamentoUsuario)?.label || departamentoUsuario
          }
        ]}
        valueSelectMarca={departamentoUsuario}
        onChangeSelectMarcas={() => {}}

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={(e) => setStatusSelecionado(e.value)}
        valueSelectEmpresa={statusSelecionado}
        optionsEmpresas={[
          { value: '', label: 'Selecione um status' },
          ...options.map((empresa) => ({
            value: empresa.value,
            label: empresa.label,
          }))
        ]}
        labelSelectEmpresa={"Status"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar"}
        corCadastro={"success"}
        onButtonClickCadastro={handleShowModal}
        IconCadastro={IoMdAdd}


      />

      <Cards
        dados={dadosCards}
        statusSelecionado={statusSelecionado}
        onClickCard={handleClickCard}
      />

      <ActionListaAdiantamento
        dadosAdiantamentos={dadosAdiantamentos}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
      />

      <ActionCadastrarModal
        show={modal}
        handleClose={() => setModal(false)}
        handleClick={handleClick}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />

    </Fragment>
  )
}