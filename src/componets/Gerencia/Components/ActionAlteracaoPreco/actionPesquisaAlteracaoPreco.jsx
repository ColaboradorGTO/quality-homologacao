import React, { Fragment, useState, useEffect } from "react"
import { ActionListaAlteracaoPreco } from "./actionListaAlteracaoPreco"
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { AiOutlineSearch } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";
import { MenuTreeSelect } from "../../../Inputs/menuDropDown";
import { InputCheckBoxAction } from "../../../Inputs/chekBoxAction";
import { ActionAlteracaoPreco } from "../../../Actions/ActionAlteracaoPreco";


export const ActionPesquisaAlteracaoPreco = ({ usuarioLogado }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [codBarra, setCodBarra] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [estoque, setEstoque] = useState(false);

  useEffect(() => {
    const dataInicio = getDataAtual();
    const dataFim = getDataAtual();
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)
  }, [])


  const fetchListaAlteracaoPreco = async () => {
    const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
    const urlBase = `/alteracaoPreco?idEmpresa=${usuarioLogado.IDEMPRESA}&grupo=${grupoSelecionado}&subGrupo=${subGrupoSelecionado}&descProduto=${nomeProduto}&codBarras=${codBarra}&estoque=${estoque}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  const { data: dadosAlteracaoPreco = [], error: errorBalanco, isLoading: isLoadingBalanco, refetch: refetchListaAlteracaoPreco } = useQuery(
    ['alteracaoPreco'],
    () => fetchListaAlteracaoPreco(),
    { enabled: false, staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosGrupos = [], error: errorGrupo, isLoading: isLoadingGrupo } = useQuery(
    'grupo-produto',
    async () => {
      const response = await get(`/grupo-produto`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  );

  const { data: dadosSubGrupos = [], error: errorSubGrupo, isLoading: isLoadingSubGrupo } = useQuery(
    'subgrupo-produto',
    async () => {
      const response = await get(`/subgrupo-produto`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
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

      const formattedTreeData = Array.from(gruposMap.values());
      setTreeData(formattedTreeData);

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

  const handleClick = () => {
    if (usuarioLogado && usuarioLogado.IDEMPRESA) {
      refetchListaAlteracaoPreco()
      setTabelaVisivel(true);
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
        title="Alteração de Preços "
        subTitle="Nome da Loja"

        InputFieldNomeProdutoComponent={InputField}
        labelInputNomeProduto={"Nome Produto"}
        valueInputFieldNomeProduto={nomeProduto}
        onChangeInputFieldNomeProduto={e => setNomeProduto(e.target.value)}
        onKeyDownInputFieldNomeProduto={handleKeyPress}

        InputFieldCodBarrasComponent={InputField}
        labelInputCodBarras={"Cód.Barras"}
        valueInputFieldCodBarras={codBarra}
        onChangeInputFieldCodBarras={e => setCodBarra(e.target.value)}
        onKeyDownInputFieldCodBarras={handleKeyPress}

        InputFieldDTInicioComponent={InputField}
        labelInputDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}
        onKeyDownInputFieldDTInicio={handleKeyPress}

        InputFieldDTFimComponent={InputField}
        labelInputDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}
        onKeyDownInputFieldDTFim={handleKeyPress}

        MenuTreeSelectComponent={MenuTreeSelect}
        valueTreeSelect={selectedNodes}
        onChangeTreeSelect={(e) => { handleTreeSelectChange(e); }}
        optionsTreeSelect={treeData}
        placeholderTreeSelect={'Selecione'}

        InputCheckBoxAction={InputCheckBoxAction}
        labelCheckBox={"Sem Estoque"}
        nomeChekBox={"estoque"}
        checkedBox={estoque}
        onChangeCheckBox={(e) => setEstoque(e.target.checked)}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleClick}
        linkNomeSearch={"Alteração Preços"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

      />

      {tabelaVisivel && (
        <ActionListaAlteracaoPreco dadosAlteracaoPreco={dadosAlteracaoPreco} />
      )}

    </Fragment>
  )
}