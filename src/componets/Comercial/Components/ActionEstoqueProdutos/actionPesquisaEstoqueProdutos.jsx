import { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { MultSelectAction } from "../../../Select/MultSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaEstoqueProduto } from "./actionListaEstoqueProdutos";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";


export const ActionPesquisaEstoqueProdutos = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [grupoSelecionado, setGrupoSelecionado] = useState('')
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState('')
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [dataPesquisaInicioB, setDataPesquisaInicioB] = useState('')
  const [dataPesquisaFimB, setDataPesquisaFimB] = useState('')
  const [dataPesquisaInicioC, setDataPesquisaInicioC] = useState('')
  const [dataPesquisaFimC, setDataPesquisaFimC] = useState('')
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [marcaProduto, setMarcaProduto] = useState('')


  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataInicialB = getDataAtual();
    const dataInicialC = getDataAtual();
    const dataFinal = getDataAtual();
    const dataFinalB = getDataAtual();
    const dataFinalC = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaInicioB(dataInicialB);
    setDataPesquisaInicioC(dataInicialC);
    setDataPesquisaFim(dataFinal);
    setDataPesquisaFimB(dataFinalB);
    setDataPesquisaFimC(dataFinalC);
  }, []);

  
  const { data: dadosGrupos = [], error: errorGrupo, isLoading: isLoadingGrupo, refetch: refetchGrupo } = useQuery(
    'grupo-produto',
    async () => {
      const response = await get(`/grupo-produto`);
      return response.data;
    },
    
    {  staleTime: 60 * 60 * 1000, }
    
  );
  
  const { data: dadosSubGrupos = [], error: errorSubGrupo, isLoading: isLoadingSubGrupo, refetch: refetchSubGrupo } = useQuery(
    'subgrupo-produto',
    async () => {
      const response = await get(`/subgrupo-produto?idGrupo=${grupoSelecionado}`);
      return response.data;
    },
    
    {  staleTime: 60 * 60 * 1000, }
    
  );
  
  const { data: dadosFornecedor = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch: refetchFornecedor } = useQuery(
    'lista-fornecedor-produto',
    async () => {
      const response = await get(`/lista-fornecedor-produto`);
      return response.data;
    },
    
    {  staleTime: 60 * 60 * 1000, }
    
  );

  const { data: dadosMarcasProdutos = [], error: errorMarcaProduto, isLoading: isLoadingMarcaProduto, refetch: refetchMarcaProduto } = useQuery(
    'lista-marca-produto',
    async () => {
      const response = await get(`/lista-marca-produto?idSubGrupo=${subGrupoSelecionado}`);
      return response.data;
    },
    {  staleTime: 60 * 60 * 1000, }
  );


  const fetchVendasEstoque = async () => {
    const urlBase = `/vendasEstoqueProduto?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&dataPesquisaInicioB=${dataPesquisaInicioB}&dataPesquisaFimB=${dataPesquisaFimB}&dataPesquisaInicioC=${dataPesquisaInicioC}&dataPesquisaFimC=${dataPesquisaFimC}&descricaoProduto=${descricaoProduto}&idFornecedor=${fornecedorSelecionado}&idGrupo=${grupoSelecionado}&idGrade=${subGrupoSelecionado}&idMarcaProduto=${marcaProduto}`;
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

  const { data: dadosEstoqueVendas = [], error: erroVendasEstoque, isLoading: isLoadingVendasEstoque, refetch: refetchVendasEstoque } = useQuery(
    'vendasEstoqueProduto',
    () => fetchVendasEstoque(),
    { enabled: false, staleTime: 60 * 60 * 1000}
  );


  const handleGrupoChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
  
    setGrupoSelecionado(values);
  }

  const handleSubGrupoChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    
    setSubGrupoSelecionado(values);
  }

  const handleFornecedorChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setFornecedorSelecionado(values);
  }
  const handleMarcarChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setMarcaProduto(values);
  }

  const handleClick = () => {

    refetchVendasEstoque();
    setTabelaVisivel(true)
  
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Relatório Vendas"


        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Início(A)"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicio(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicio}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim(A)"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFim(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFim}

        InputFieldDTInicioBComponent={InputField}
        labelInputDTInicioB={"Data Início(B)"}
        valueInputFieldDTInicioB={dataPesquisaInicioB}
        onChangeInputFieldDTInicioB={(e) => setDataPesquisaInicioB(e.target.value)}

        InputFieldDTFimBComponent={InputField}
        labelInputDTFimB={"Data Fim(B)"}
        onChangeInputFieldDTFimB={(e) => setDataPesquisaFimB(e.target.value)}
        valueInputFieldDTFimB={dataPesquisaFimB}

        InputFieldDTInicioCComponent={InputField}
        labelInputDTInicioC={"Data Início(C)"}
        onChangeInputFieldDTInicioC={(e) => setDataPesquisaInicioC(e.target.value)}
        valueInputFieldDTInicioC={dataPesquisaInicioC}

        InputFieldDTFimCComponent={InputField}
        labelInputDTFimC={"Data Fim(C)"}
        onChangeInputFieldDTFimC={(e) => setDataPesquisaFimC(e.target.value)}
        valueInputFieldDTFimC={dataPesquisaFimC}

        MultSelectGrupoComponent={MultSelectAction}
        optionsMultSelectGrupo={[
          { value: '', label: 'Selecione um Grupo' },
          ...dadosGrupos.map((item) => ({
            value: item.ID_GRUPO,
            label: item.GRUPO,
          }))
        ]}
        labelMultSelectGrupo={"Por Grupo"}
        defaultValueMultSelectGrupo={[grupoSelecionado]}
        onChangeMultSelectGrupo={handleGrupoChange}

        MultSelectSubGrupoComponent={MultSelectAction}
        optionsMultSelectSubGrupo={[
          { value: '', label: 'Selecione um SubGrupo' },
          ...dadosSubGrupos.map((item) => ({
            value: item.ID_ESTRUTURA,
            label: item.ESTRUTURA,
          }))
        ]}
        labelMultSelectSubGrupo={"SubGrupo"}
        valueMultSelectSubGrupo={[subGrupoSelecionado]}
        onChangeMultSelectSubGrupo={handleSubGrupoChange}

        MultSelectFornecedorComponent={MultSelectAction}
        optionsMultSelectFornecedor={[
          { value: '', label: 'Selecione um Fornecedor' },
          ...dadosFornecedor.map((fornecedor) => ({
            value: fornecedor.ID_FORNECEDOR,
            label: `${fornecedor.ID_FORNECEDOR} ${fornecedor.FORNECEDOR}`,
          }))
        ]}
        labelMultSelectFornecedor={"Por Fornecedor"}
        valueMultSelectFornecedor={[fornecedorSelecionado]}
        isMultiSelectGrupo={true}
        onChangeMultSelectFornecedor={handleFornecedorChange}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód. Barras / Nome Produto"}
        valueInputFieldCodBarra={descricaoProduto}
        onChangeInputFieldCodBarra={(e) => setDescricaoProduto(e.target.value)}

        MultSelectMarcaComponent={MultSelectAction}
        labelMultSelectMarca={"Marca"}

        optionsMultSelectMarca={[
          { value: '', label: 'Selecione uma Marca' },
          ...dadosMarcasProdutos.map((marca) => ({
            value: marca.ID_MARCA,
            label: `${marca.ID_MARCA} ${marca.MARCA}`,
          }))
        ]}
        valueMultSelectMarca={marcaProduto}
        onChangeMultSelectMarca={handleMarcarChange}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Vendas e Estoque"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />


      {tabelaVisivel && (
        <ActionListaEstoqueProduto dadosEstoqueVendas={dadosEstoqueVendas} />
      )}
    </Fragment>
  )
}