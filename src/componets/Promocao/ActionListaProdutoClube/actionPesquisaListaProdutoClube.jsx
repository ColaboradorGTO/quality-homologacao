import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { ButtonType } from "../../Buttons/ButtonType";
import { InputFieldAction } from "../../Buttons/InputAction";
import { InputSelectActionPromocao } from "../../Inputs/InputSelectActionPromocao";
import { MultSelectAction } from "../../Select/MultSelectAction";
import { FaDownload } from "react-icons/fa6";
import { get } from "../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../utils/animationCarregamento"
import { ActionMainProdutoClube } from "../../Actions/ActionMainProdutoClube";
import { FaSearch } from "react-icons/fa";
import { ActionListaPromocao } from "./actionListaPromocao";
import { ActionListaProdutos } from "./actionListaProdutos";
import { ActionEditarProdutoClube } from "../ProdutoClube/ActionEditar/actionEditarProdutoClube";
import { MenuTreeSelect } from "../../Inputs/menuTreeSelect";
import { situacao } from "../../../../parceiro.json"

export const ActionPesquisaListaProdutoClube = ({ usuarioLogado }) => {
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [status, setStatus] = useState('')
  const [actionCriarVisivel, setActionCriarVisivel] = useState(true)
  const [actionEditarVisivel, setActionEditarVisivel] = useState(false)
  const [tabelaPromocao, setTabelaPromocao] = useState(true)
  const [tabelaProduto, setTabelaProduto] = useState(false)
  const [detalhePromocao, setDetalhePromocao] = useState([])
  const [treeData, setTreeData] = useState([]);
  const [selectedNodesOrigem, setSelectedNodesOrigem] = useState(null);

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: false, staleTime: 1000 * 60 * 60 }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);

  const fetchPromocao = async () => {
    const urlBase = `/promocao-produto-clube?dataInicio=${dataInicio}&dataFim=${dataFim}&status=${status}`;
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

  const { data: dadosPromocao = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchPromocao } = useQuery(
    ['promocao-produto-clube', false],
    async () => fetchPromocao(),
    { enabled: false, }
  );

  const fetchProduto = async () => {
    const urlBase = `/produto-preco-clube-promocao?idEmpresa=${empresaSelecionada}&dataInicio=${dataInicio}&dataFim=${dataFim}&status=${status}`;
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

  const { data: dadosProdutosPromocao = [], error: errorProduto, isLoading: isLoadingProduto, refetch: refetchProduto } = useQuery(
    ['produto-preco-clube-promocao', false],
    async () => fetchProduto(),
    { enabled: false, }
  );

  // Busca as empresas de todas as marcas para montar a árvore Marca -> Empresas
  const { data: optionsEmpresasTree = [] } = useQuery(
    ['listaEmpresaComercialTree', optionsMarcas],
    async () => {
      const marcasArray = Array.isArray(optionsMarcas) ? optionsMarcas : [];
      const respostas = await Promise.all(
        marcasArray.map(async (marca) => {
          const response = await get(`/listaEmpresaComercial?idMarca=${marca.IDGRUPOEMPRESARIAL}`);
          return (response.data || []).map(empresa => ({
            ...empresa,
            IDGRUPOEMPRESARIAL: marca.IDGRUPOEMPRESARIAL,
          }));
        })
      );
      return respostas.flat();
    },
    { enabled: Array.isArray(optionsMarcas) && optionsMarcas.length > 0, staleTime: 1000 * 60 * 60 }
  );

  useEffect(() => {
      if (Array.isArray(optionsMarcas) && optionsMarcas.length) {
        const gruposMap = new Map();

        optionsMarcas.forEach(marca => {
          gruposMap.set(marca.IDGRUPOEMPRESARIAL, {
            key: `grupo_${marca.IDGRUPOEMPRESARIAL}`,
            label: marca.DSGRUPOEMPRESARIAL,
            children: [],
          });
        });

        optionsEmpresasTree.forEach(empresa => {
          const grupo = gruposMap.get(empresa.IDGRUPOEMPRESARIAL);
          if (grupo) {
            grupo.children.push({
              key: `subgrupo_${empresa.IDEMPRESA}`,
              label: `${empresa.IDEMPRESA} - ${empresa.NOFANTASIA}`,
              data: empresa
            });
          }
        });

        const formattedTreeData = Array.from(gruposMap.values());
        setTreeData([
          { key: 'todas', label: 'Selecionar Todas' },
          ...formattedTreeData
        ]);
      }
  }, [optionsMarcas, optionsEmpresasTree]);

  const handleTreeSelectMarca = (e) => {
    let selectedValue = e.value || {};
    const todasAntes = Boolean(selectedNodesOrigem?.todas?.checked);
    const todasAgora = Boolean(selectedValue?.todas?.checked);

    if (todasAgora && !todasAntes) {
      // Marcou "Selecionar Todas": marca todas as marcas e empresas
      selectedValue = {};
      treeData.forEach(node => {
        selectedValue[node.key] = { checked: true, partialChecked: false };
        (node.children || []).forEach(child => {
          selectedValue[child.key] = { checked: true, partialChecked: false };
        });
      });
    } else if (!todasAgora && todasAntes) {
      // Desmarcou "Selecionar Todas": limpa tudo
      selectedValue = {};
    } else if (todasAgora && todasAntes) {
      // Desmarcou algum item com "Selecionar Todas" marcado: tira o "Selecionar Todas"
      const todosMarcados = treeData
        .filter(node => node.key !== 'todas')
        .every(node => selectedValue[node.key]?.checked);
      if (!todosMarcados) {
        selectedValue = { ...selectedValue };
        delete selectedValue.todas;
      }
    }

    setSelectedNodesOrigem(selectedValue);

    const selectedGrupo = [];
    const selectedSubGrupo = [];

    // Considera apenas os nós totalmente marcados (ignora partialChecked)
    Object.keys(selectedValue).forEach(key => {
      if (!selectedValue[key]?.checked) return;

      if (key.startsWith('grupo_')) {
        const grupoId = Number(key.replace('grupo_', ''));
        selectedGrupo.push(grupoId);
      } else if (key.startsWith('subgrupo_')) {
        const empresaId = Number(key.replace('subgrupo_', ''));
        selectedSubGrupo.push(empresaId);
      }
    });

    setMarcaSelecionada(selectedGrupo);
    setEmpresaSelecionada(selectedSubGrupo);
  };

  const handleClick = () => {
    refetchPromocao()
    setTabelaPromocao(true)
    setTabelaProduto(false)
  }

  const handleClickProduto = () => {
    refetchProduto()
    setTabelaProduto(true)
    setTabelaPromocao(false)
  }
  
  const onChangeStatus = (e) => {
    console.log(e.value, 'value')
    setStatus(e.value)
  }

  return (
    <Fragment>
      {actionCriarVisivel && (
        <>
          <ActionMainProdutoClube
            linkComponentAnterior={["Home"]}
            linkComponent={["Cadastro de Promoções"]}
            title="Cadastro de Promoções"
          
            InputFieldDTInicioComponent={InputFieldAction}
            labelInputDTInicio={"Data Inicio"}
            valueInputFieldDTInicio={dataInicio}
            onChangeInputFieldDTInicio={(e) => setDataInicio(e.target.value)}
    
            InputFieldDTFimComponent={InputFieldAction}
            labelInputDTFim={"Data Fim"}
            valueInputFieldDTFim={dataFim}
            onChangeInputFieldDTFim={(e) => setDataFim(e.target.value)}
    
            MenuTreeSelectOrigemComponent={MenuTreeSelect}
            valueTreeSelectOrigem={selectedNodesOrigem}
            onChangeTreeSelectOrigem={handleTreeSelectMarca}
            optionsTreeSelectOrigem={treeData}
            placeholderTreeSelectOrigem={"Selecione"}
            labelSelectSubGrupoOrigemAsync={'Marca/Loja'}

            InputSelectStatusComponent={InputSelectActionPromocao}
            optionsStatus={situacao?.map((item) => ({
              value: item.value,
              label: item.label
              }))
            }
            defaultValueStatus={status}
            labelSelectStatus={"Status"}
            onChangeSelectStatus={(e) => setStatus(e.value)}
    
            ButtonSearchComponent={ButtonType}
            linkNomeSearch={"Pesquisar Produto"}
            onButtonClickSearch={handleClickProduto}
            corSearch={"primary"}
            IconSearch={FaSearch}
            // styleButtonSearch
    
            ButtonTypePedido={ButtonType} 
            linkPedido={"Pesquisar Promoção"}
            onButtonClickPedido={handleClick}
            corPedido={'info'}
            IconPedido={FaSearch}
    
     
            IconRetornar={FaDownload}
          />

          {tabelaPromocao && (

            <ActionListaPromocao 
            dadosPromocao={dadosPromocao}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado} 
            setActionEditarVisivel={setActionEditarVisivel}
            setActionCriarVisivel={setActionCriarVisivel}
            setDetalhePromocao={setDetalhePromocao}
            />
          )}

          {tabelaProduto && (

            <ActionListaProdutos 
              dadosProdutosPromocao={dadosProdutosPromocao}
            />
          )}
        </>
      )}


      {actionEditarVisivel && (

        <ActionEditarProdutoClube 
          detalhePromocao={detalhePromocao}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          setActionEditarVisivel={setActionEditarVisivel}
          setActionCriarVisivel={setActionCriarVisivel}
        />
      )} 
    </Fragment>
  )
}