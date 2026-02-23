import { Fragment, useEffect, useState } from "react";
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonSearch } from "../../../Buttons/ButtonSearch"
import { InputField } from "../../../Buttons/Input"
import { getDataAtual, getDataDoisMesesAtras } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { AiOutlineSearch } from "react-icons/ai";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ActionListaPedidos } from "./actionListaPedidos";
import { ActionPDFPedidoResumido } from "./comprasActionPDFPedidoResumido";
import { ActionPDFPedidoDetalhado } from "./comprasActionPDFPedidoDetalhado";
import { ActionListaProdutosCriados } from "./actionListaProdutosCriados";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionComprasADMHome = () => {
  const [actionHome, setActionHome] = useState(true)
  const [actionBTN, setActionBTN] = useState(true)
  const [actionListaPedidos, setActionListaPedidos] = useState(true)
  const [actionPedidoResumido, setActionPedidoResumido] = useState(false)
  const [actionPedidoDetalhado, setActionPedidoDetalhado] = useState(false)
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [dadosPedidoResumido, setDadosPedidoResumido] = useState([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [fabricanteSelecionado, setFabricanteSelecionado] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [compradorSelecionado, setCompradorSelecionado] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');
  const [actionProdutosCriados, setActionProdutosCriados] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  useEffect(() => {
    const dataInicial = getDataDoisMesesAtras();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);

  }, [])

  const { data: dadosFonecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor } = useFetchData('fornecedores', '/fornecedores');
  const { data: dadosFabricantes = [], error: errorFabricantes, isLoading: isLoadingFabricantes } = useFetchData('fabricantes', '/fabricantes');
  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');
  const { data: dadosCompradores = [], error: errorCompradores, isLoading: isLoadingCompradores } = useFetchData('compradores', '/compradores');

  const fetchListaPedidos = async () => {
    try {

      const urlApi = `/lista-pedidos?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornPesquisa=${fornecedorSelecionado}&idMarcaPesquisa=${marcaSelecionada}&NuPedidoPesquisa=${numeroPedido}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosPedidos = [], error: errorPedidos, isLoading: isLoadingPedidos, refetch: refetchListaPedidos } = useQuery(
    ['lista-pedidos', dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize],
    () => fetchListaPedidos(dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const fetchListaPedidosDetalhados = async () => {
    try {

      const urlApi = `/lista-pedidosDetalhado?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornecedor=${fornecedorSelecionado}&idMarca=${marcaSelecionada}&idPedido=${numeroPedido}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosPedidosDetalhados = [], error: errorPedidosDetalhados, isLoading: isLoadingPedidosDetalhados, refetch: refetchListaPedidosDetalhados } = useQuery(
    ['lista-pedidosDetalhado', dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize],
    () => fetchListaPedidosDetalhados(dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const fetchListaProdutos = async () => {
    try {

      const urlApi = `/cadastrar-produto-Pedido?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosProdutosCriados = [], error: errorProdutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['cadastrar-produto-Pedido', dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize],
    () => fetchListaProdutos(dataPesquisaInicio, dataPesquisaFim, fornecedorSelecionado, marcaSelecionada, numeroPedido, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )

  const handleSelectFornecedor = (e) => {
    setFornecedorSelecionado(e.value);
  }

  const handleSelectFabricante = (e) => {
    setFabricanteSelecionado(e.value);
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value);
  }

  const handleSelectComprador = (e) => {
    setCompradorSelecionado(e.value);
  }

  const handleClick = () => {
    setActionListaPedidos(true);
    refetchListaPedidos();
  }

  const handleClickRelatorioResumido = () => {
    setActionPedidoResumido(true);
    setActionPedidoDetalhado(false);
    setActionListaPedidos(false);
    setActionProdutosCriados(false);
    setActionHome(false);
    setActionBTN(false);
    getListaPedidos();
  }

  const handleClickRelatorioDetalhado = () => {
    setActionPedidoDetalhado(true);
    setActionPedidoResumido(false);
    setActionHome(false);
    setActionProdutosCriados(false);
    setActionListaPedidos(false);
    setActionBTN(false);
    refetchListaPedidosDetalhados();
  }

  const handleClickRelatorioProdutosCriados = () => {
    setActionProdutosCriados(true);
    setActionPedidoDetalhado(false);
    setActionPedidoResumido(false);
    setActionListaPedidos(false);
    setActionBTN(true);

    refetchListaProdutos();
  }

  return (
    <Fragment>

      {actionHome && (
        <ActionMain
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}
          title="Tela Principal"
          subTitle="Dashboard de Compras"

          InputFieldDTInicioComponent={InputField}
          labelInputFieldDTInicio={"Data Início"}
          valueInputFieldDTInicio={dataPesquisaInicio}
          onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

          InputFieldDTFimComponent={InputField}
          labelInputFieldDTFim={"Data Fim"}
          valueInputFieldDTFim={dataPesquisaFim}
          onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

          InputSelectMarcasComponent={InputSelectAction}
          labelSelectMarcas={"Marcas"}
          optionsMarcas={[
            { value: '', label: 'Selecione a Marca' },
            ...dadosMarcas.map(item => ({
              value: item.IDGRUPOEMPRESARIAL,
              label: item.GRUPOEMPRESARIAL
            }))
          ]}
          valueSelectMarcas={marcaSelecionada}
          onChangeSelectMarcas={handleSelectMarca}

          InputSelectEmpresaComponent={InputSelectAction}
          labelSelectEmpresa={"Fornecedor"}
          optionsEmpresas={[
            { value: '', label: 'Selecione o Fornecedor' },
            ...dadosFonecedores.map(item => ({
              value: item.IDFORNECEDOR,
              label: `${item.IDFORNECEDOR} - ${item.NOFANTASIA} - ${item.NUCNPJ} - ${item.NORAZAOSOCIAL}`
            }))
          ]}
          valueSelectEmpresa={fornecedorSelecionado}
          onChangeSelectEmpresa={handleSelectFornecedor}

          InputSelectGrupoComponent={InputSelectAction}
          labelSelectGrupo={"Comprador"}
          optionsGrupos={[
            { value: '', label: 'Selecione o Comprador' },
            ...dadosCompradores.map(item => ({
              value: item.IDFUNCIONARIO,
              label: `${item.IDFUNCIONARIO} - ${item.NOFUNCIONARIO}`
            }))
          ]}
          valueSelectGrupo={compradorSelecionado}
          onChangeSelectGrupo={handleSelectComprador}


          InputSelectFabricanteComponent={InputSelectAction}
          labelSelectFabricantes={"Fabricante"}
          optionsFabricantes={[
            { value: '', label: 'Selecione o Fabricante' },
            ...dadosFabricantes.map(item => ({
              value: item.IDFABRICANTE,
              label: item.DSFABRICANTE
            }))
          ]}
          valueSelectFabricantes={fabricanteSelecionado}
          onChangeSelectFabricantes={handleSelectFabricante}

          InputFieldComponent={InputField}
          labelInputField={"Nº Pedido"}
          placeHolderInputFieldComponent={"Digite o Nº Pedido"}
          valueInputField={numeroPedido}
          onChangeInputField={e => setNumeroPedido(e.target.value)}

          ButtonSearchComponent={ButtonType}
          linkNomeSearch={"Atualizar Dados"}
          onButtonClickSearch={handleClick}
          corSearch={"primary"}
        />
      )}

      {actionBTN && (
        <div className="panel" style={{ width: "100%", marginTop: '10rem' }}>
          <div className="panel-hdr">
            <h2>
              Lista de Pedidos <span class="fw-300"><i>Por Período</i></span>
            </h2>
          </div>
          <div className="row p-1 mb-2" style={{ width: '75%' }}>


            <ButtonType
              textButton="Relatório Resumido"
              onClickButtonType={handleClickRelatorioResumido}
              cor="primary"
              Icon={AiOutlineSearch}
              iconColor="white"
              iconSize={16}
            />

            <ButtonType
              Icon={AiOutlineSearch}
              iconSize={16}
              textButton="Relatório Detalhado"
              cor="secondary"
              tipo="button"
              onClickButtonType={handleClickRelatorioDetalhado}
            />


            <ButtonType
              textButton="Produtos Criados"
              onClickButtonType={handleClickRelatorioProdutosCriados}
              cor="info"
              Icon={AiOutlineSearch}
              iconColor="white"
              iconSize={16}
            />


          </div>
        </div>
      )}

      {!actionPedidoResumido && actionListaPedidos && actionHome && (
        <Fragment>
          <ActionListaPedidos dadosPedidos={dadosPedidos} />
        </Fragment>
      )}

      {/* preciso que ActionPDFPedidoResumido esteja visivel as outras não esteja visivel quando for clicado no button resumo relatorio */}
      {actionPedidoResumido && (
        <ActionPDFPedidoResumido dadosPedidoResumido={dadosPedidoResumido} />
      )}

      {actionPedidoDetalhado && (
        <ActionPDFPedidoDetalhado dadosPedidosDetalhados={dadosPedidosDetalhados} />
      )}

      {actionProdutosCriados && (
        <ActionListaProdutosCriados dadosProdutosCriados={dadosProdutosCriados} />
      )}
    </Fragment>
  )

}