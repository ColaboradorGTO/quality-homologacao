import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputFieldAction } from "../../../Buttons/InputAction";
import { GrView } from "react-icons/gr";
import { IoIosSend, IoMdReturnLeft } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { ActionMainProdutoClube } from "../../../Actions/ActionMainProdutoClube";
import { ActionListaProdutos } from "./actionListaProdutos";
import { extrairIds, useEditeProdutoClube } from "../hooks/useEditeProdutoClube";
import { MenuTreeSelect } from "../../../Inputs/menuTreeSelect";
import { useQuery } from "react-query";

export const ActionEditarProdutoClube = ({ detalhePromocao, usuarioLogado, optionsModulos, setActionEditarVisivel, setActionCriarVisivel }) => {
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null)
  const selecaoInicialAplicada = useRef(false)

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

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
    dadosProdutosPromocao,
    downloadPlanilhaModelo,
    treeData,
    setTreeData,
    selectedNodesOrigem,
    setSelectedNodesOrigem,
    onSubmit,

  } = useEditeProdutoClube({ detalhePromocao, usuarioLogado, optionsModulos });



  const handleEmpresaChange = useCallback((selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setEmpresaSelecionada(values);
  }, [setEmpresaSelecionada]);

  const handleCadastrar = () => {
    onSubmit();
  }

  const empresasFiltradas = useMemo(() => {
    const empresasArray = Array.isArray(optionsEmpresas) ? optionsEmpresas : [];
    if (!marcaSelecionada || marcaSelecionada == "all") return empresasArray;
    if (Array.isArray(marcaSelecionada)) {
      return empresasArray.filter(empresa =>
        marcaSelecionada.includes(empresa.IDGRUPOEMPRESARIAL)
      );
    }
    return empresasArray.filter(empresa => empresa.IDGRUPOEMPRESARIAL === marcaSelecionada);
  }, [optionsEmpresas, marcaSelecionada, empresaSelecionada, setEmpresaSelecionada]);

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

      // Pré-seleciona (uma única vez) as marcas/empresas que já existem na promoção
      if (!selecaoInicialAplicada.current && optionsEmpresasTree.length > 0 && detalhePromocao?.length > 0) {
        selecaoInicialAplicada.current = true;
        aplicarSelecaoInicial(formattedTreeData);
      }
    }
  }, [optionsMarcas, optionsEmpresasTree]);

  const aplicarSelecaoInicial = (grupos) => {
    // Lê direto do detalhe da promoção (o state do hook ainda pode não ter sido atualizado neste momento)
    const empresasPromocao = extrairIds(detalhePromocao, 'IDEMPRESA');
    const marcasPromocao = extrairIds(detalhePromocao, 'IDGRUPOEMPRESARIAL');

    const selecao = {};
    const empresasFinal = new Set();
    const marcasFinal = [];

    grupos.forEach(grupo => {
      const idGrupo = Number(grupo.key.replace('grupo_', ''));
      const filhos = grupo.children || [];
      let filhosMarcados = filhos.filter(filho => empresasPromocao.includes(Number(filho.data?.IDEMPRESA)));

      // Marca vinculada à promoção sem nenhuma empresa dela informada: considera todas as empresas da marca
      if (filhosMarcados.length === 0 && marcasPromocao.includes(idGrupo)) {
        filhosMarcados = filhos;
      }
      if (filhosMarcados.length === 0) return;

      filhosMarcados.forEach(filho => {
        selecao[filho.key] = { checked: true, partialChecked: false };
        empresasFinal.add(Number(filho.data?.IDEMPRESA));
      });

      const todosFilhos = filhosMarcados.length === filhos.length;
      selecao[grupo.key] = { checked: todosFilhos, partialChecked: !todosFilhos };
      if (todosFilhos) marcasFinal.push(idGrupo);
    });

    if (grupos.length > 0 && grupos.every(grupo => selecao[grupo.key]?.checked)) {
      selecao.todas = { checked: true, partialChecked: false };
    }

    setSelectedNodesOrigem(selecao);
    setMarcaSelecionada(marcasFinal);
    setEmpresaSelecionada(Array.from(empresasFinal));
  };

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

  useEffect(() => {
    console.log(marcaSelecionada, 'marca')
    console.log(empresaSelecionada, 'empresa')
  }, [marcaSelecionada, empresaSelecionada]);

  const handleClick = () => {
    setActionEditarVisivel(false)
    setActionCriarVisivel(true)
  }

  return (
    <Fragment>
      <ActionMainProdutoClube
        linkComponentAnterior={["Home"]}
        linkComponent={["Editar Promoção"]}
        title="Editar Promoção"

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

        ButtonTypePedido={ButtonType}
        linkPedido={"Retornar"}
        onButtonClickPedido={handleClick}
        corPedido={'danger'}
        IconPedido={IoMdReturnLeft}


        ButtonTypeRetornar={ButtonType}
        linkRetornar={"Baixar Planilha"}
        onButtonClickRetornar={downloadPlanilhaModelo}
        corRetornar={"success"}
        IconRetornar={FaDownload}
      />

      <ActionListaProdutos
        dadosProdutosPromocao={dadosProdutosPromocao}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}