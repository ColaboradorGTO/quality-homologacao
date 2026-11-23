import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../Buttons/ButtonType";
import { InputFieldAction } from "../../Buttons/InputAction";
import { GrView } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { get } from "../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../utils/animationCarregamento"
import { useCreateProdutoClube } from "./hooks/useCreateProdutoClube";
import { ActionMainProdutoClube } from "../../Actions/ActionMainProdutoClube";
import { ActionModalProduto } from "./ActionModalProduto/actionModalProduto";
import { ActionListaPromocao } from "./actionListaProduto";
import { ActionEditarProdutoClube } from "./ActionEditar/actionEditarProdutoClube";
import { MenuTreeSelect } from "../../Inputs/menuTreeSelect";

export const ActionPesquisaProdutoClube = ({ usuarioLogado }) => {
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null)
  const [actionCriarVisivel, setActionCriarVisivel] = useState(true)
  const [actionEditarVisivel, setActionEditarVisivel] = useState(false)
  const [detalhePromocao, setDetalhePromocao] = useState([])

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
  const {
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    produtoOrigem,
    setProdutoOrigem,
    fileProdutoOrigem,
    setFileProdutoOrigem,
    descricao,
    setDescricao,
    optionsMarcas,
    optionsEmpresas,
    handleFileUpload,
    mostrarProdutosSelecionadosOrigem,
    produtosOrigemDetalhados,
    handleRemoverProdutoOrigem,
    modalPodutoSelecionadoOrigem,
    setModalPodutoSelecionadoOrigem,
    treeData, 
    setTreeData,
    selectedNodesOrigem, 
    setSelectedNodesOrigem,
    onSubmit,
    downloadPlanilhaModelo,

  } = useCreateProdutoClube({ usuarioLogado, optionsModulos });





  const handleCadastrar = () => {
    onSubmit();
  }



  const fetchProdutoSubGrupoDestino = async () => {
    const urlBase = `/promocao-produto-clube`;
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
    async () => fetchProdutoSubGrupoDestino(),
    { enabled: false, }
  );


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

            InputFieldDescription={InputFieldAction}
            labelInputFieldDescription={"Descrição"}
            valueInputFielDescription={descricao}
            onChangeInputFieldDescription={(e) => setDescricao(e.target.value)}
            styleDescription={{ textTransform: "uppercase" }}

            MenuTreeSelectOrigemComponent={MenuTreeSelect}
            valueTreeSelectOrigem={selectedNodesOrigem}
            onChangeTreeSelectOrigem={handleTreeSelectMarca}
            optionsTreeSelectOrigem={treeData}
            placeholderTreeSelectOrigem={"Selecione"}
            labelSelectSubGrupoOrigemAsync={'Marca/Loja'}

            InputFileProdutoOigem={InputFieldAction}
            labelInputFileProdutoOigem={"Produto Origem"}
            acceptFileProdutoOigem=".xlsx"
            onChangeInputFileProdutoOigem={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], true);
                setProdutoOrigem('');
              } else {
                setFileProdutoOrigem([]);
              }
            }}
            readOnlyFileProdutoOigem={produtoOrigem.length > 0 ? true : false}

            ButtonTypeCancelar={ButtonType}
            linkCancelar={"Visualizar Produtos Origem"}
            onButtonClickCancelar={() => {
              mostrarProdutosSelecionadosOrigem('origem');
              setProdutoOrigem('');
            }}
            corCancelar={"danger"}
            IconCancelar={GrView}

            ButtonSearchComponent={ButtonType}
            linkNomeSearch={"Cadastrar "}
            onButtonClickSearch={handleCadastrar}
            corSearch={"primary"}
            IconSearch={IoIosSend}
            // styleButtonSearch

            ButtonTypeRetornar={ButtonType}
            linkRetornar={"Baixar Planilha"}
            onButtonClickRetornar={downloadPlanilhaModelo}
            corRetornar={"success"}
            IconRetornar={FaDownload}
          />

        </>
      )}

      <ActionModalProduto
        show={modalPodutoSelecionadoOrigem}
        handleClose={() => setModalPodutoSelecionadoOrigem(false)}
        produtosOrigemDetalhados={produtosOrigemDetalhados}
        handleRemoverProdutoOrigem={handleRemoverProdutoOrigem}
      />

      {actionEditarVisivel && (

        <ActionEditarProdutoClube
          detalhePromocao={detalhePromocao}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
        />
      )}
    </Fragment>
  )
}

// 1120