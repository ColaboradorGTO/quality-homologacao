import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaVendasContingencia } from "./actionListaVendasContingencia";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../hooks/useFetchData";

export const ActionPesquisaVendasContingencia = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInical = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInical);
    setDataPesquisaFim(dataFinal);
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, });

  const { data: marcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');

  const { data: empresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['empresasLista', marcaSelecionada],
    async () => {
      const response = await get(`/todas-empresas?idSubGrupoEmpresa=${marcaSelecionada}`);

      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );


  const fetchListaVendasContigencia = async () => {
    const urlBase = `/listaVendasContigencia?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    const controller = new AbortController();
    let allData = [];

    try {
      animacaoCarregamento('Carregando dados...', true, true, () => controller.abort());

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`, { signal: controller.signal });
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          if (foiCancelado()) break;
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`, { signal: controller.signal });
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return allData;
      }
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasContigencia = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchVendasContigencia } = useQuery(
    ['listaVendasContigencia', ],
    () => fetchListaVendasContigencia(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const handleChangeMarca = (e) => {
    setMarcaSelecionada(e.value)
  }

  const handleChangeEmpresa = (e) => {
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    refetchVendasContigencia(marcaSelecionada)
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
        linkComponent={["Lista de Vendas"]}
        title=" Vendas Em Contingência"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        InputSelectMarcasComponent={InputSelectAction}
        optionsMarcas={[
          { value: "", label: "Selecione a Marca" },
          ...marcas.map((marca) => ({
            value: marca.IDGRUPOEMPRESARIAL,
            label: marca.DSGRUPOEMPRESARIAL
          }))
        ]}
        labelSelectMarcas={"Marcas"}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleChangeMarca}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: "", label: "Selecione a Loja" },
          ...empresas.map((marca) => ({
            value: marca.IDEMPRESA,
            label: marca.NOFANTASIA
          }))
        ]}
        labelSelectEmpresa={"Filial"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Atualizar Dados"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
      />

  
      {tabelaVisivel &&
        <ActionListaVendasContingencia
          dadosVendasContigencia={dadosVendasContigencia}
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}
        />
      }

    </Fragment>
  )
}