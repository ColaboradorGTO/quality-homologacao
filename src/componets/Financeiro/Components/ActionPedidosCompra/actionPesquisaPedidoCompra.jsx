import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { getDataAtual, getDataDoisMesesAtras } from "../../../../utils/dataAtual"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaPedidoCompra } from "./actionListaPedidoCompra"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from 'react-query';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"

export const ActionPesquisaPedidoCompra = () => {
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');

  useEffect(() => {
    const dataInicial = getDataDoisMesesAtras();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  
  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: optionsFornecedores = [], error: errorFornecedores, isLoading: isLoadingFornecedores } = useQuery(
    'fornecedores',
    async () => {
      const response = await get(`/fornecedores`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  const fetchPedidosCompras = async () => {
    const urlBase = `/pedido-compras?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idFornecedor=${fornecedorSelecionado}&idMarca=${marcaSelecionada}&idPedido=${numeroPedido}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
    
  };

  const { data: dadosPedidosCompras = [], error: errorPedidosCompras, isLoading: isLoadingPedidosCompras, refetch: refetchPedidosCompras } = useQuery(
    ['pedido-compras'],
    () => fetchPedidosCompras(),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const handleSelectFornecedor = (e) => {
    const selectId = e.value
    if (selectId) {
      setFornecedorSelecionado(selectId)
    }
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value)
  }

  const handleClick = () => {
    refetchPedidosCompras()
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
        linkComponent={["Lista de Pedidos"]}
        title="Pedidos de Compras"
        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          // { value: '', label: 'Selecione uma loja' },
          ...optionsMarcas.map((marca) => ({
            value: marca.IDGRUPOEMPRESARIAL,
            label: marca.DSGRUPOEMPRESARIAL
          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

        InputSelectFornecedorComponent={InputSelectAction}
        labelSelectFornecedor={"Por Fornecedor"}
        optionsFornecedores={[
          { value: '', label: 'Selecione um fornecedor' },
          ...optionsFornecedores.map((fornecedor) => ({
            value: fornecedor.IDFORNECEDOR,
            label: `${fornecedor.NORAZAOSOCIAL} - ${fornecedor.NUCNPJ} - ${fornecedor.DSFORNECEDOR}`
          }))
        ]}
        onChangeSelectFornecedor={handleSelectFornecedor}
        valueSelectFornecedor={fornecedorSelecionado}

        InputFieldComponent={InputField}
        labelInputField={"N° Pedido"}
        placeHolderInputFieldComponent={"N° Pedido"}
        valueInputField={numeroPedido}
        onChangeInputField={(e) => setNumeroPedido(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ActionListaPedidoCompra dadosPedidosCompras={dadosPedidosCompras} />

    </Fragment>
  )
}