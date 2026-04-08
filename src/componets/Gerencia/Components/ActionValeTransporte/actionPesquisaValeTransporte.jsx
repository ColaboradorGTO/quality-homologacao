import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { ActionListaValeTransporte } from "./actionListaValeTransporte"
import { MdAdd } from "react-icons/md"
import { ActionCadastrarValeTransporte } from "./ActionCadastrarValeTransporte/actionCadastrarValeTransporte"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"
import Swal from "sweetalert2"
import { InputField } from "../../../Buttons/Input"
import { AiOutlineSearch } from "react-icons/ai"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaValeTransporte = ({ usuarioLogado, ID }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

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

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataPesquisaInicio(dataAtual)
    setDataPesquisaFim(dataAtual)
  }, [])

  const parseData = (dataStr) => {
    if (!dataStr) return null;

    const [dia, mes, ano] = dataStr.split('-');
    return new Date(`${ano}-${mes}-${dia}`);
  };

  const filtrarPorData = (dados) => {
    const dataInicio = parseData(dataPesquisaInicio);
    const dataFim = parseData(dataPesquisaFim);

    return dados.filter(item => {
      if (!item.DTDESPESA) return false;

      const dataItem = parseData(item.DTDESPESA);

      return dataItem >= dataInicio && dataItem <= dataFim;
    });
  };

  const fetchDespesasLojas = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/despesas-loja-empresa?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

      const dadosFiltrados = filtrarPorData(allData);
      return dadosFiltrados;

    } catch (error) {
      console.error('Erro ao buscar dados da api', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosDespesasLoja = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchDadosLoja } = useQuery(
    'despesas-loja-empresa',
    () => fetchDespesasLojas(),
    { enabled: false, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const handleShowModal = () => {
    if (optionsModulos[0]?.CRIAR == 'True') {
      setModalVisivel(true);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não tem permissão para cadastrar!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000,
      })
      return;
    }
  };

  const handleTabelaVisivel = () => {
    refetchDadosLoja();
    setTabelaVisivel(true);
  };

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vale Transporte da Loja"]}
        title="Vale Transporte da Loja"
        subTitle={`${usuarioLogado?.NOFANTASIA}`}

        InputFieldDTInicioAComponent={InputField}
        valueInputFieldDTInicioA={dataPesquisaInicio}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        valueInputFieldDTFimA={dataPesquisaFim}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleTabelaVisivel}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome="Cadastrar Vale Transporte"
        onButtonClickCadastro={handleShowModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}


      />
      {tabelaVisivel && (
        <ActionListaValeTransporte
          dadosDespesasLoja={dadosDespesasLoja}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          refetchDadosLoja={refetchDadosLoja}
        />
      )}

      <ActionCadastrarValeTransporte
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        refetchDadosLoja={refetchDadosLoja}
      />

    </Fragment >
  )
}


