import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { get } from "../../../../api/funcRequest";
import { ActionListaVendasVendedor } from "./actionListaVendasVendedor";
import { getDataAtual } from "../../../../utils/dataAtual";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";
import { MultSelectAction } from "../../../Select/MultSelectAction";
import { optionsUF, optionComissoes } from "../../../../../parceiro.json";

export const ActionPesquisaVendasVendedor = () => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [percComissaoSelecionada, setPercComissaoSelecionada] = useState('');
  const [ufSelecionado, setUfSelecionado] = useState('');

  useEffect(() => {
    const dataInicio = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)

  }, [])
 
  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );
   
  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
      
      return response.data;
    },
    {enabled: Boolean(marcaSelecionada), staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000,}
  );

const fetchListaVendasVendedor = async () => {
    const urlBase = `/venda-vendedor-adm?idGrupo=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&uf=${ufSelecionado}`;
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
   
  const { data: dadosVendasVendedor = [], error: errorVendasVendedor, isLoading: isLoadingVendasVendedor, refetch: refetchListaVendasVendedor } = useQuery(
    ['venda-vendedor-adm',],
    () => fetchListaVendasVendedor(),
    {
      enabled: false,
    }
  );

  const handleSelectComissoes = (e) => {
    setPercComissaoSelecionada(e.value);
  };

  const handleSelectEmpresa = (selectedOptions) => {  
    const values = selectedOptions.map((option) => option.value);
    setEmpresaSelecionada(values);
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleClick = () => {
    refetchListaVendasVendedor()
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
        linkComponent={["Vendas por Vendedor e Período"]}
        title="Vendas por Vendedor e Período"
        subTitle={empresaSelecionadaNome}

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

        MultSelectEmpresaComponent={MultSelectAction}
        optionsMultSelectEmpresa={[
          { value: '0', label: 'Selecione uma loja' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelMultSelectEmpresa={"Empresa"}
        valueMultSelectEmpresa={[empresaSelecionada]}
        onChangeMultSelectEmpresa={handleSelectEmpresa}
        onKeyDownEmpresa={handleKeyPress}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={optionsMarcas.map((marca) => ({
          value: marca.IDGRUPOEMPRESARIAL,
          label: marca.DSGRUPOEMPRESARIAL,
        }))}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}
        onKeyDownSelectMarcas={handleKeyPress}

        InputSelectUFComponent={InputSelectAction}
        labelSelectUF={"UF"}
        optionsSelectUF={optionsUF.map((empresa) => ({
          value: empresa.value,
          label: empresa.label,
        }))}
        onChangeSelectUF={e => setUfSelecionado(e.value)}
        valueSelectUF={ufSelecionado}
        onKeyDownSelectUF={handleKeyPress}

        InputSelectComissoesComponent={InputSelectAction}
        labelSelectComissoes={"% Comissão"}
        optionsComissoes={optionComissoes.map((empresa) => ({
          value: empresa.value,
          label: empresa.label,
        }))}
        valueSelectComissoes={percComissaoSelecionada}
        onChangeSelectComissoes={handleSelectComissoes}
        onKeyDownSelectComissoes={handleKeyPress}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />
      <ActionListaVendasVendedor dadosVendasVendedor={dadosVendasVendedor} percComissaoSelecionada={percComissaoSelecionada} />

    </Fragment>
  )
}