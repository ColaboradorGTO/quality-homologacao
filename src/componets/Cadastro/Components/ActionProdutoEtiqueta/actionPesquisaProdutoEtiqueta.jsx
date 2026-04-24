import { Fragment, useEffect, useState } from "react"
import { InputField } from "../../../Buttons/Input"
import { ButtonSearch } from "../../../Buttons/ButtonSearch"
import { ActionMain } from "../../../Actions/actionMain"
import { get } from "../../../../api/funcRequest"
import { AiOutlineSearch } from "react-icons/ai"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { ActionListaProdutoEtiqueta } from "./actionListaProdutoEtiqueta"
import { ButtonType } from "../../../Buttons/ButtonType"
import { useFetchData } from "../../../../hooks/useFetchData"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"



export const ActionPesquisaProdutoEtiqueta = ({ usuarioLogado }) => {
  const [descricaoProduto, setDescricaoProduto] = useState('')
  const [codBarrasProduto, setCodBarrasProduto] = useState('')
  const [idProduto, setIDProduto] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [btnVisivel, setBtnVisivel] = useState(false);
  const [modalImprimir, setModalImprimir] = useState(false);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [dadosAcumuladorEtiquetas, setDadosAcumuladorEtiquetas] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {

    getListaEmpresas()
  }, [])

  const { data: dadosEmpresas = [] } = useFetchData('empresas', '/empresas');
  // const { data: dadosListaPrecos = [] } = useFetchData('lista-de-preco', '/lista-de-preco');

  const { data: dadosListaPrecos = [], error: errorListaPrecos, isLoading: isLoadingListaPrecos, refetch } = useQuery(
    'listas-de-precos-sap',
    async () => {
      const response = await get(`/listas-de-precos-sap`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  useEffect(() => {
    if (dadosListaPrecos && usuarioLogado?.IDEMPRESA) {
      const empresa = dadosListaPrecos.find(
        item => item.listaPreco?.IDEMPRESA === usuarioLogado.IDEMPRESA
      );
      if (empresa) {
        setEmpresaSelecionada(empresa.listaPreco?.IDRESUMOLISTAPRECO);
      }
    }
  }, [dadosListaPrecos, usuarioLogado]);

  const getListaEmpresas = async () => {
    try {
      const response = await get(`/lista-de-preco`);
      if (response.data && response.data.length > 0) {
        const empresas = response.data.map(item => ({
          value: item.listaPreco && item.listaPreco.IDRESUMOLISTAPRECO,
          label: item.listaPreco && item.listaPreco.NOMELISTA
        })).filter(item => item.value && item.label); // Filtrar itens com valores válidos
        setDadosEmpresas(empresas);

      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error);
    }
  };


  const fetchListaPrecosSap = async () => {
    const urlBase = `/lista-produtos-etiqueta-sap?idLista=${empresaSelecionada}&idProduto=${idProduto}&descricao=${descricaoProduto}&codBarras=${codBarrasProduto}`;
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

  const { data: dadosListaPrecosSap = [], error: errorMalotes, isLoading: isLoadingMalotes, refetch: refetchListaPrecosSap } = useQuery(
    ['lista-produtos-etiqueta-sap',],
    () => fetchListaPrecosSap(),
    { enabled: false, staleTime: 60 * 60 * 1000, }
  );


  const handleChangeEmpresa = (e) => {
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    refetchListaPrecosSap();
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[""]}
        title="Etiquetagem"
        subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lista de Preço"}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma empresa' },
          ...dadosEmpresas
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        InputFieldComponent={InputField}
        labelInputField={"Id. Produto"}
        valueInputField={idProduto}
        onChangeInputField={(e) => setIDProduto(e.target.value)}
        placeHolderInputFieldComponent={"Id. Produto"}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Descrição"}
        valueInputFieldDescricao={descricaoProduto}
        onChangeInputFieldDescricao={(e) => setDescricaoProduto(e.target.value)}
        placeHolderInputFieldDescricao={"Descrição do Produto"}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras "}
        valueInputFieldCodBarra={codBarrasProduto}
        onChangeInputFieldCodBarra={(e) => setCodBarrasProduto(e.target.value)}
        placeHolderInputFieldCodBarra={"Cód.Barras / Nome Produto"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ActionListaProdutoEtiqueta 
        dadosListaPrecosSap={dadosListaPrecosSap} 
          btnVisivel={btnVisivel}
        setBtnVisivel={setBtnVisivel}
        setModalImprimir={setModalImprimir}
        modalImprimir={modalImprimir}
        produtosSelecionados={produtosSelecionados}
        setProdutosSelecionados={setProdutosSelecionados}
        dadosAcumuladorEtiquetas={dadosAcumuladorEtiquetas}

        setDadosAcumuladorEtiquetas={setDadosAcumuladorEtiquetas}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </Fragment>
  )
}
