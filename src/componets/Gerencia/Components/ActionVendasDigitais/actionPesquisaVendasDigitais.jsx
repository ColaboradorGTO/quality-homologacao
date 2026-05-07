import React, { Fragment, useState, useEffect } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { ActionListaVendasDigitais } from "./actionListaVendasDigitais";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";

export const ActionPesquisaVendasDigitais = ({ usuarioLogado, optionsEmpresas }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, []);

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

  const fetchVendasDigitais = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/vendas-digitais?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados da api', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasDigitais = [], error: erroVendasDigitais, isLoading: isLoadingVendasDigitais, refetch: refetchVendasDigitais } = useQuery(
    'vendas-digitais',
    () => fetchVendasDigitais(),
    { enabled: false, staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const handleClick = () => {
    refetchVendasDigitais();
    setTabelaVisivel(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vendas Digital por Marcas e Período"]}
        title="Vendas Digital por Marcas e Período"

        InputSelectPendenciaComponent={InputSelectAction}
        labelSelectPendencia="Selecione a Empresa"
        optionsPendencia={[
          { value: '', label: 'Todas' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        onChangeSelectPendencia={(e) => setEmpresaSelecionada(e.value)}
        valueSelectPendencia={empresaSelecionada}
        stylePendencia={optionsModulos[0]?.ADMINISTRADOR === "True"}

        InputFieldDTInicioAComponent={InputField}
        valueInputFieldDTInicioA={dataPesquisaInicio}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicioA={handleKeyPress}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        valueInputFieldDTFimA={dataPesquisaFim}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFimA={handleKeyPress}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

      />
      {tabelaVisivel && (
        <ActionListaVendasDigitais
          dadosVendasDigitais={dadosVendasDigitais}
        />
      )}

    </Fragment>
  )
}

