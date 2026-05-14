import { Fragment, useEffect, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaMetas } from "./actionListaMetas";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useQuery } from "react-query";
import { ActionListaMetasVendasResumidas } from "./actionListaMetasVendasResumidas";
import { ActionListaMetasDetalhadas } from "./actionListaMetasDetalhada";


export const ActionPesquisaMetas = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [marcaNome, setMarcaNome] = useState('');
  const [tabelaVendaResumidaVisivel, setTabelaVendaResumidaVisivel] = useState(false);
  const [tabelaMetasVendasVisivel, setTabelaMetasVendasVisivel] = useState(false);
  const [dadosVendasResumida, setDadosVendasResumida] = useState([]);
  const [dadosMetasDetalhadas, setDadosMetasDetalhadas] = useState([]);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])
 

    const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchGrupo } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );


  const { data: dadosVendasMarca = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchVendasMarca } = useQuery(
    'listaMetaVendas',
    async () => {
      const response = await get(`/listaMetaVendas`);
      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000 }
  );

  const handleClick = () => {
    refetchVendasMarca()
    setTabelaVisivel(true)
    setTabelaVendaResumidaVisivel(false);
    setTabelaMetasVendasVisivel(false);
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Vendas por Marcas e Período"
        subTitle={marcaNome}

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          { value: '0', label: 'Selecionar Marca' },
            ...dadosMarcas.map((marca) => {
            return {
              
              value: marca.IDGRUPOEMPRESARIAL,
              label: marca.DSGRUPOEMPRESARIAL,
            }
          })
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={(e) => setMarcaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />
      

      {tabelaVisivel && (
        <ActionListaMetas 
          dadosVendasMarca={dadosVendasMarca} 
          setTabelaVisivel={setTabelaVisivel}
          setTabelaVendaResumidaVisivel={setTabelaVendaResumidaVisivel}
          setTabelaMetasVendasVisivel={setTabelaMetasVendasVisivel}
          setDadosVendasResumida={setDadosVendasResumida}
          setDadosMetasDetalhadas={setDadosMetasDetalhadas}
        />
      )}
      {
        tabelaVendaResumidaVisivel && (

          <ActionListaMetasVendasResumidas 
            dadosVendasResumida={dadosVendasResumida}
          /> 
        )
      }
      {tabelaMetasVendasVisivel && (
        <ActionListaMetasDetalhadas
          dadosMetasDetalhadas={dadosMetasDetalhadas}
        />
      )}
    </Fragment>
  )
}