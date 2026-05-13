import React, { Fragment, useState, useEffect } from "react"
import { ActionListaAlteracaoPreco } from "./actionListaAlteracaoPreco";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { InputCheckBoxAction } from "../../../Inputs/chekBoxAction";
import { MenuTreeSelect } from "../../../Inputs/menuDropDown";
import { ActionAlteracaoPreco } from "../../../Actions/ActionAlteracaoPreco";
import Swal from "sweetalert2";

export const ActionPesquisaAlteracaoPreco = ({ }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [codBarra, setCodBarra] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [estoque, setEstoque] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState([]);
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [isQueryAlteracao, setIsQueryAlteracao] = useState(false)

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisaInicio(dataAtual)
    setDataPesquisaFim(dataAtual)

  }, []);


  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);

      return response.data;
    },
    { enabled: Boolean(marcaSelecionada), staleTime: 60 * 60 * 1000, }
  );

  const fetchListaAlteracaoPreco = async () => {
    const urlBase = `/alteracaoPreco?idEmpresa=${encodeURIComponent(empresaSelecionada)}&grupo=${encodeURIComponent(
      grupoSelecionado.join(',')
    )}&subGrupo=${encodeURIComponent(
      subGrupoSelecionado.join(',')
    )}&produto=${descricaoProduto}&codigobarras=${codBarra}&estoque=${estoque}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    
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



  const { data: dadosAlteracaoPreco = [], error: errorVendasMarca, isLoading: isLoadingVendasMarca, refetch: refetchListaPrecoAlteracao } = useQuery(
    ['alteracaoPreco',],
    () => fetchListaAlteracaoPreco(),
    {
      enabled: false,
    }
  );

  const handleChangeMarca = (e) => {
    setMarcaSelecionada(e.value);
  };

  const handleChangeEmpresa = (e) => {
    const empresa = dadosEmpresas.find((item) => item.IDEMPRESA === e.value);
    setEmpresaSelecionada(e.value);
    setEmpresaSelecionadaNome(empresa.NOFANTASIA);
  }

  const [treeData, setTreeData] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState({});


  const { data: dadosGrupos = [], error: errorGrupo, isLoading: isLoadingGrupo } = useQuery(
    'grupo-produto',
    async () => {
      const response = await get(`/grupo-produto`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );


  const { data: dadosSubGrupos = [], error: errorSubGrupo, isLoading: isLoadingSubGrupo } = useQuery(
    'subgrupo-produto',
    async () => {
      const response = await get(`/subgrupo-produto`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );


  useEffect(() => {
    if (dadosSubGrupos.length) {
      const gruposMap = new Map();

      dadosSubGrupos.forEach(subgrupo => {
        const grupoId = subgrupo.ID_GRUPO;
        const grupoDescricao = subgrupo.DS_GRUPO;

        if (!gruposMap.has(grupoId)) {
          gruposMap.set(grupoId, {
            key: grupoId,
            label: grupoDescricao,
            children: [],
          });
        }

        gruposMap.get(grupoId).children.push({
          key: subgrupo.ID_ESTRUTURA,
          label: subgrupo.ESTRUTURA,
        });
      });
      // Atualiza o estado de treeData
      const formattedTreeData = Array.from(gruposMap.values());
      setTreeData(formattedTreeData);

      // Atualiza os grupos e subgrupos selecionados
      setGrupoSelecionado(formattedTreeData.map(grupo => grupo.key));
      setSubGrupoSelecionado(formattedTreeData.flatMap(grupo => grupo.children.map(child => child.key)));
    }
  }, [dadosSubGrupos]);

  const handleTreeSelectChange = (e) => {
    const selectedValue = e.value;
    setSelectedNodes(selectedValue);

    const grupoIds = new Set(treeData.map(item => item.key));
    const subGrupoIds = new Set(treeData.flatMap(item => item.children?.map(child => child.key) || []));

    const selectedGrupo = [];
    const selectedSubGrupo = [];


    Object.keys(selectedValue).forEach(key => {
      const numericKey = Number(key);
      if (grupoIds.has(key) || grupoIds.has(numericKey)) {
        selectedGrupo.push(key);
      } else if (subGrupoIds.has(key) || subGrupoIds.has(numericKey)) {
        selectedSubGrupo.push(key);
      }
    });

    setGrupoSelecionado(selectedGrupo);
    setSubGrupoSelecionado(selectedSubGrupo);
  };


  if (isLoadingGrupo || isLoadingSubGrupo) {
    return <div>Carregando...</div>;
  }

  if (errorGrupo || errorSubGrupo) {
    return <div>Erro ao carregar dados.</div>;
  }

  const handleClick = () => {
    if(empresaSelecionada == '' ){

      Swal.fire({
        icon: 'info',
        text: 'Selecione uma empresa para continuar!',
        timer: 3000,
      })
    } else {
      setIsLoadingPesquisa(true);
      setCurrentPage(prevPage => prevPage + 1)
      setIsQueryAlteracao(true);
      refetchListaPrecoAlteracao()
      setTabelaVisivel(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };


  return (

    <Fragment>


      <ActionAlteracaoPreco
        linkComponentAnterior={["Home"]}
        linkComponent={["Alteração de Preços"]}
        title="Alteração de Preços"
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

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={[
          { value: '', label: 'Selecionar Empresa' },
          ...dadosEmpresas.map((item) => {
            return {
              value: item.IDEMPRESA,
              label: item.NOFANTASIA
            }
          })
        ]}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleChangeEmpresa}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={dadosMarcas.map((marca) => ({
          value: marca.IDGRUPOEMPRESARIAL,
          label: marca.DSGRUPOEMPRESARIAL,

        }))}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={handleChangeMarca}

        MenuTreeSelectComponent={MenuTreeSelect}
        valueTreeSelect={selectedNodes}
        onChangeTreeSelect={(e) => { handleTreeSelectChange(e); }}
        optionsTreeSelect={treeData}
        placeholderTreeSelect={'Selecione'}

        InputCheckBoxAction={InputCheckBoxAction}
        labelCheckBox={"Sem Estoque"}
        nomeChekBox={"estoque"}
        checked={estoque}
        onChangeCheckBox={e => setEstoque(e.target.checked ? 'true' : 'false')}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        valueInputFieldCodBarra={codBarra}
        onChangeInputFieldCodBarra={e => setCodBarra(e.target.value)}
        onKeyDownInputFieldCodBarra={handleKeyPress}

        InputFieldComponent={InputField}
        labelInputField={"Nome Produto"}
        valueInputField={descricaoProduto}
        onChangeInputField={e => setDescricaoProduto(e.target.value)}
        placeHolderInputFieldComponent={"Nome Produto"}
        onKeyDownInputField={handleKeyPress}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Alteração Preços"}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      <ActionListaAlteracaoPreco dadosAlteracaoPreco={dadosAlteracaoPreco} />

    </Fragment>
  )
}