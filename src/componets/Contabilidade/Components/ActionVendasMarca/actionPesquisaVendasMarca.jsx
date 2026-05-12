import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaVendasMarca } from "./actionListaVendasMarca";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { getDataAtual } from "../../../../utils/dataAtual";

export const ActionPesquisaVendasMarca = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);

      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );


  const fetchListaVendasMarca = async () => {
    const urlBase = `/vendasProdutos?idGrupoEmpresarial=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  const { data: dadosVendasMarca = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchListaVendasMarca } = useQuery(
    ['vendasProdutos',],
    () => fetchListaVendasMarca(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );

  const handleSelectMarca = (e) => {
    const selectId = e.value;
    setMarcaSelecionada(selectId)
  }

  const handleClick = () => {
    refetchListaVendasMarca()
    setTabelaVisivel(true)
  }

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
        title="Vendas por Marcas e Período"
        subTitle

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

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={handleSelectMarca}
        valueSelectEmpresa={marcaSelecionada}
        optionsEmpresas={[

          { value: '', label: 'Selecione a Marca' },
          ...optionsMarcas.map((empresa) => ({
            value: empresa.IDGRUPOEMPRESARIAL,
            label: empresa.DSGRUPOEMPRESARIAL,
          }))
        ]}

        labelSelectEmpresa={"Marca"}
        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ActionListaVendasMarca dadosVendasMarca={dadosVendasMarca} />

    </Fragment>
  )
}