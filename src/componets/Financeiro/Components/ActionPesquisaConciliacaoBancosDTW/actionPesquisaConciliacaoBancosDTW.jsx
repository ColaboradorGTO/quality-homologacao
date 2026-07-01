import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { useQuery } from 'react-query';
import Swal from "sweetalert2"
import { ActionListaConciliacaoBancoDTW } from "./actionListaConciliacaoBancoDTW"
import { ActionListaConsolidadoBancoDTW } from "./actionListaConsolidadoBancoDTW"
import { ActionListaCompensacaoBancoDTW } from "./actionListaCompensacaoBancoDTW"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData } from "../../../../hooks/useFetchData"

export const ActionPesquisaConciliacaoBancosDTW = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaVisivelConsolidado, setTabelaVisivelConsolidado] = useState(false);
  const [tabelaVisivelCompensacao, setTabelaVisivelCompensacao] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [dataPesquisaInicioB, setDataPesquisaInicioB] = useState('')
  const [dataPesquisaFimB, setDataPesquisaFimB] = useState('')
  const [dataPesquisaInicioC, setDataPesquisaInicioC] = useState('')
  const [dataPesquisaFimC, setDataPesquisaFimC] = useState('')
  const [contaSelecionada, setContaSelecionada] = useState('')
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco, } = useFetchData('contaBanco', '/contaBanco');



  useEffect(() => {
    if (errorContaBanco) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Erro ao buscar conta!',
      });
    }
  }, [errorContaBanco]);


  const fetchConciliarBanco = async () => {
    const urlBase = `/deposito-loja?idConta=${contaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataCompInicio=${dataPesquisaInicioB}&dataCompFim=${dataPesquisaFimB}&dataMovInicio=${dataPesquisaInicioC}&dataMovFim=${dataPesquisaFimC}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosConciliarBanco = [], error: errorConciliarBanco, isLoading: isLoadingConciliarBanco, refetch: refetchConciliarBanco } = useQuery(
    ['deposito-loja',],
    () => fetchConciliarBanco(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  )

  const fetchConciliarBancoConsolidado = async () => {
    const urlBase = `/deposito-loja-consolidado?idConta=${contaSelecionada}&dataCompInicio=${dataPesquisaInicioB}&dataCompFim=${dataPesquisaFimB}&dataMovInicio=${dataPesquisaInicioC}&dataMovFim=${dataPesquisaFimC}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }

  };

  const { data: dadosConciliarBancoConsolidado = [], error: errorBancoConsolidado, isLoading: isLoadingBancoConsolidado, refetch: refetchBancoConsolidado } = useQuery(
    ['deposito-loja-consolidado',],
    () => fetchConciliarBancoConsolidado(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  )

  const onChangeSelectConta = (e) => {
    setContaSelecionada(e.value)
  }

  const handleClick = () => {
    setTabelaVisivel(true)
    setTabelaVisivelConsolidado(false)
    setTabelaVisivelCompensacao(false)
    refetchConciliarBanco()
  }

  const handleClickCompensacao = () => {
    setTabelaVisivel(false)
    setTabelaVisivelConsolidado(false)
    setTabelaVisivelCompensacao(true)
    refetchConciliarBanco()

  }

  const handleClickConsolidado = () => {
    if (!contaSelecionada && !dataPesquisaInicioB && !dataPesquisaFimB && !dataPesquisaInicioC && !dataPesquisaFimC) {
      Swal.fire({
        title: 'Atenção!',
        text: `Informe ao menos uma das Datas para a pesquisa e conta para a pesquisa `,
        icon: 'warning',
        customClass: {
          container: 'custom-swal',
        },

      })
      return;
    }
    setTabelaVisivelConsolidado(true)
    setTabelaVisivel(false)
    setTabelaVisivelCompensacao(false)
    refetchBancoConsolidado()

  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Conciliação por Bancos DTW"]}
        title="Conciliação por Bancos DTW"

        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Depósito Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicio}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Depósito Fim"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFim}

        InputFieldDTInicioBComponent={InputField}
        labelInputDTInicioB={"Data Compensação Início"}
        valueInputFieldDTInicioB={dataPesquisaInicioB}
        onChangeInputFieldDTInicioB={(e) => setDataPesquisaInicioB(e.target.value)}

        InputFieldDTFimBComponent={InputField}
        labelInputDTFimB={"Data Compensação Fim"}
        onChangeInputFieldDTFimB={(e) => setDataPesquisaFimB(e.target.value)}
        valueInputFieldDTFimB={dataPesquisaFimB}

        InputFieldDTInicioCComponent={InputField}
        labelInputDTInicioC={"Data Movimento Início"}
        onChangeInputFieldDTInicioC={(e) => setDataPesquisaInicioC(e.target.value)}
        valueInputFieldDTInicioC={dataPesquisaInicioC}

        InputFieldDTFimCComponent={InputField}
        labelInputDTFimC={"Data Movimento Fim"}
        onChangeInputFieldDTFimC={(e) => setDataPesquisaFimC(e.target.value)}
        valueInputFieldDTFimC={dataPesquisaFimC}


        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Conta Banco"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma conta' },
          ...dadosContaBanco.map((item) => ({
            value: item.IDCONTABANCO,
            label: `${item.IDCONTABANCO} - ${item.DSCONTABANCO}`
          }))
        ]}
        valueSelectEmpresa={contaSelecionada}
        onChangeSelectEmpresa={onChangeSelectConta}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Depósito"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Consolidado"}
        corCancelar={"info"}
        IconCancelar={AiOutlineSearch}
        onButtonClickCancelar={handleClickConsolidado}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Compensação"}
        corCadastro={"success"}
        IconCadastro={AiOutlineSearch}
        onButtonClickCadastro={handleClickCompensacao}

      />

      {tabelaVisivel && (
        <ActionListaConciliacaoBancoDTW
          dadosConciliarBanco={dadosConciliarBanco}
          contaSelecionada={contaSelecionada}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          refetchConciliarBanco={refetchConciliarBanco}
          refetchBancoConsolidado={refetchBancoConsolidado} />
      )}
      {tabelaVisivelCompensacao && (
        <ActionListaCompensacaoBancoDTW
          dadosConciliarBanco={dadosConciliarBanco}
          contaSelecionada={contaSelecionada}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          refetchConciliarBanco={refetchConciliarBanco}
          refetchBancoConsolidado={refetchBancoConsolidado} />
      )}

      {tabelaVisivelConsolidado && (
        <ActionListaConsolidadoBancoDTW dadosConciliarBancoConsolidado={dadosConciliarBancoConsolidado} />

      )}
    </Fragment>
  )
}
