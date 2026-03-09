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
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

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
    try {

      const urlApi = `/vendasProdutos?idGrupoEmpresarial=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
      const response = await get(urlApi);

      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }

        await fetchNextPage(currentPage);
        return allData;
      } else {

        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosVendasMarca = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchListaVendasMarca } = useQuery(
    ['vendas-produtos', marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVendasMarca(marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: Boolean(marcaSelecionada), staleTime: 60 * 60 * 1000 }
  );

  const handleSelectMarca = (e) => {
    const selectId = e.value;
    setMarcaSelecionada(selectId)
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaVendasMarca(marcaSelecionada)
    setTabelaVisivel(true)
  }

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

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

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

      {tabelaVisivel && (
        <ActionListaVendasMarca
          dadosVendasMarca={dadosVendasMarca}
        />
      )}

    </Fragment>
  )
}

