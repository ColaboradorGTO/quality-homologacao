import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaVendasContingencia } from "./actionListaVendasContingencia";
import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useFetchData, useFetchEmpresas, useFetchEmpresasContabilidade } from "../../../../hooks/useFetchData";

export const ActionPesquisaVendasContingencia = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInical = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInical);
    setDataPesquisaFim(dataFinal);
  }, [])

  const { data: marcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');

  const { data: empresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas
  } = useQuery(
    ['empresasLista', marcaSelecionada],
    async () => {
      const response = await get(
        `/todas-empresas?idSubGrupoEmpresa=${marcaSelecionada}`
      );

      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const fetchListaVendasContigencia = async () => {
    try {

      const urlApi = `/listaVendasContigencia?idMarca=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  const { data: dadosVendasContigencia = [], error: errorVendas, isLoading: isLoadingVendas, refetch: refetchVendasContigencia } = useQuery(
    ['listaVendasContigencia', marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVendasContigencia(marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: Boolean(marcaSelecionada), staleTime: 60 * 60 * 1000 }
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

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

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

      <div id="resultado">
        {tabelaVisivel &&

          <ActionListaVendasContingencia
            dadosVendasContigencia={dadosVendasContigencia}
            optionsModulos={optionsModulos}
          />
        }

      </div>
    </Fragment>
  )
}