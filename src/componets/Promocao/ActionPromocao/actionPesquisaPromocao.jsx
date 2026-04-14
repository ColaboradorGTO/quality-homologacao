import React, { Fragment, useCallback, useEffect, useMemo } from "react"
import { ButtonType } from "../../Buttons/ButtonType";
import { ActionMainPromocao } from "../../Actions/ActionMainPromocao";
import { InputFieldAction } from "../../Buttons/InputAction";
import { InputSelectActionPromocao } from "../../Inputs/InputSelectActionPromocao";
import { useCreatePromocaoAtiva } from "./hook/useCreatePromocaoAtiva";
import { MultSelectAction } from "../../Select/MultSelectAction";
import { GrFormView, GrView } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { ActionCadastrarPromocaoModal } from "./ActionCadastrarPromocao/actionCadastrarPromocaoModal";
import { ActionProdutoDestinoModal } from "../ActionPromocoesAtivas/ActionProdutosDestino/actionProdutoDestinoModal";
import { ActionProdutoOrigemModal } from '../ActionPromocoesAtivas/ActionProdutosOrigem/actionProdutoOrigemModal'
import { ActionProdutoModalPromocaoSelecionado } from "../ActionPromocoesAtivas/ActionProdutosDaPromocaoSelecionado/actionProdutoModalPromocaoSelecionado";
import { ActionProdutoModalPromocaoSelecionadoDestino } from "../ActionPromocoesAtivas/ActionProdutosDaPromocaoSelecionado/actionProdutoModalPromocaoSelecionaDestino";
import { ActionDocumentacaoAtualizar } from "../ActionPromocoesAtivas/ActionDocumentacao/documentacaoAtualizar";
import { ActionProdutoModalPromocaoSelecionadoCSVOrigem } from "../ActionPromocoesAtivas/ActionProdutosDaPromocaoSelecionado/actionProdutoModalPromocaoSelecionadoCSVOrigem";
import { ActionDocumentacaoCriar } from "../ActionPromocoesAtivas/ActionDocumentacao/documentacaoCriar";
import { useState } from "react";
import { MenuTreeSelect } from "../../Inputs/menuTreeSelect";
import { InputFieldActionRadio } from "../../Buttons/InputActionRadio";

import { FaDownload } from "react-icons/fa6";
import { get } from "../../../api/funcRequest";
import { useQuery } from "react-query";
import { ActionEstruturaProdutoOrigemModal } from "./ActionProdutosOrigem/actionEstruturaProdutoOrigemModal";
import { ActionEstruturaProdutoDestinoModal } from "./ActionProdutosDestino/actionEstruturaProdutoDestinoModal";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../utils/animationCarregamento"


export const ActionPesquisaPromocao = ({ }) => {

  const {
    mecanicaSelecionada,
    setMecanicaSelecionada,
    aplicacaoDestinoSelecionada,
    setAplicacaoDestinoSelecionada,
    tipoDescontoSelecionado,
    setTipoDescontoSelecionado,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    subGrupoSelecionado,
    setSubGrupoSelecionado,
    grupoSelecionado,
    setGrupoSelecionado,
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    qtdInicio,
    setQtdInicio,
    qtdFim,
    setQtdFim,
    vrDesconto,
    setVrDesconto,
    porcentoDesconto,
    setPorcentoDesconto,
    valorInicio,
    setValorInicio,
    valorFim,
    setValorFim,
    produtoOrigem,
    setProdutoOrigem,
    fileProdutoOrigem,
    setFileProdutoOrigem,
    produtoDestino,
    setProdutoDestino,
    fileProdutoDestino,
    setFileProdutoDestino,
    descricao,
    setDescricao,
    precoProduto,
    setPrecoProduto,
    dadosFornecedorProduto,
    dadosGrupo,
    dadosSubGrupo,
    optionsMarcas,
    optionsEmpresas,
    optionsMecanica,
    dadosMecanicas,
    mecanicaSelecionadaEdicao,
    setMecanicaSelecionadaEdicao,
    isEditandoMecanica,
    setIsEditandoMecanica,
    btnSalvar,
    setBtnSalvar,
    handleFileUpload,
    mostrarProdutosSelecionados,
    dadosPromocoesAtivas,
    modalVisivel,
    setModalVisivel,
    handleSalvarMecanica,
    mostrarProdutosPromocao,
    handlePesquisarProdutoDestino,
    handlePesquisarProdutoOrigem,
    modalProduto,
    setModalProduto,
    dadosProdutosPesquisa,
    modalProdutoDestino,
    setModalProdutoDestino,
    modalProdutoOrigem,
    setModalProdutoOrigem,
    modalProdutoDaPromocao,
    setModalProdutoDaPromocao,
    statusProdutoOrigem,
    setStatusProdutoOrigem,
    statusProdutoDestino,
    setStatusProdutoDestino,

    produtoDestinoSelecionado,
    setProdutoDestinoSelecionado,
    produtoOrigemSelecionado,
    setProdutoOrigemSelecionado,
    novoProdutoDestino,
    setNovoProdutoDestino,
    novoProdutoOrigem,
    setNovoProdutoOrigem,
    setModalPodutoSelecionadoDestino,
    setModalPodutoSelecionadoOrigem,
    modalPodutoSelecionadoDestino,
    modalPodutoSelecionadoOrigem,
    modalEmpresasPromocao,
    setModalEmpresasPromocao,
    refetchProdutosPromocoes,
    dadosEmpresasPromocoes,
    setDadosEmpresasPromocoes,
    mostrarProdutosSelecionadosOrigem,
    mostrarProdutosSelecionadosDestino,
    modalDocumentacao,
    setModalDocumentacao,
    modalPodutoSelecionadoDestinoCSV, setModalPodutoSelecionadoDestinoCSV,
    modalPodutoSelecionadoOrigemCSV, setModalPodutoSelecionadoOrigemCSV,
    isCheckedGrupo,
    setIsCheckedGrupo,
    isCheckedProduto,
    setIsCheckedProduto,
    isCheckedGrupoProduto,
    setIsCheckedGrupoProduto,
    subGrupoDestino,
    setSubGrupoDestino,
    subGrupoOrigem,
    setSubGrupoOrigem,
    onSubmit,
    downloadPlanilhaModelo,
    onSubmitEstrutura

  } = useCreatePromocaoAtiva({});


  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
  };

  const handleEmpresaChange = useCallback((selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setEmpresaSelecionada(values);
  }, [setEmpresaSelecionada]);

  const handleChangeSubGrupoDestino = useCallback((selectedOptions) => {
    const values = selectedOptions.map((option) => String(option.value));
    setSubGrupoDestino(values);
  }, [setSubGrupoDestino]);

  const handleChangeSubGrupoOrigem = useCallback((selectedOptions) => {
    const values = selectedOptions.map((option) => String(option.value));
    setSubGrupoOrigem(values);
  }, [setSubGrupoOrigem]);

  const handleChangeMecanica = useCallback((selectedValue) => {
    const selectedOption = dadosMecanicas.find(option => option.ID == selectedValue);

    if (selectedOption) {
      setMecanicaSelecionada(selectedOption.MECANICA);
      setMecanicaSelecionadaEdicao(selectedOption.DESCRICAO)
      setAplicacaoDestinoSelecionada(selectedOption.APLICACAODESTINO);
      setTipoDescontoSelecionado(selectedOption.TIPODESCONTO);
    }

  }, [dadosMecanicas, setMecanicaSelecionada, setAplicacaoDestinoSelecionada, setTipoDescontoSelecionado,]);

  const handleEditarMecanica = () => {
    const selectedOption = dadosMecanicas.find(option => option.ID == mecanicaSelecionada);

    if (selectedOption) {
      setMecanicaSelecionadaEdicao(selectedOption.DESCRICAO);
      setIsEditandoMecanica(false);
      setBtnSalvar(false);
    }
  };


  useEffect(() => {
    if (tipoDescontoSelecionado == 0) {
      setVrDesconto(0);
      setValorInicio(0);
      setPorcentoDesconto(0)
    } else if (tipoDescontoSelecionado == 1) {
      setPorcentoDesconto(0)
      setPrecoProduto(0);
      setValorInicio(0);
    } else if (tipoDescontoSelecionado == 2) {
      setVrDesconto(0);
      setPrecoProduto(0);
      setValorInicio(0);
    }

    if (mecanicaSelecionada == 1 && mecanicaSelecionadaEdicao !== "PROMOÇÃO POR EM UM PRODUTO // QUANTIDADE VALOR // VALOR FINAL") {
      setQtdInicio(0);
    }

  }, [mecanicaSelecionada, tipoDescontoSelecionado, mecanicaSelecionadaEdicao, setPrecoProduto, setVrDesconto, setValorInicio, setPorcentoDesconto]);


  const handleCadastrar = () => {
    onSubmit();
  }

  const handleCadastrarEstrutura = () => {
    onSubmitEstrutura();
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

  const handlePorcentoDesconto = (value) => {
    if (isNaN(value) || value == "" || typeof value !== "number") {
      setPorcentoDesconto(0);
      return;
    }
    const val = Math.max(0, Math.min(Number(value), 99));
    setPorcentoDesconto(val);
  }

  const mostrarDocumentacao = useCallback(() => {
    setModalDocumentacao(true);
  }, []);

  const [treeData, setTreeData] = useState([]);
  const [treeDataEstProd, setTreeDataEstProd] = useState([]);
  const [selectedNodesOrigem, setSelectedNodesOrigem] = useState({});
  const [selectedNodesDestino, setSelectedNodesDestino] = useState({});
  const [produtoSelecionadoEstProdDestino, setProdutoSelecionadoEstProdutoDestino] = useState([]);
  const [produtoSelecionadoEstProdOrigem, setProdutoSelecionadoEstProdutoOrigem] = useState([]);
  const [novoProdutoEstProdOrigem, setNovoProdutoEstProdOrigem] = useState([]);
  const [novoProdutoEstProdDestino, setNovoProdutoEstProdDestino] = useState([]);
  const [modalEstProdOrigem, setModalEstProdOrigem] = useState(false);
  const [modalEstProdDestino, setModalEstProdDestino] = useState(false);

  useEffect(() => {
    if (dadosSubGrupo.length) {
      // 1. Agrupar subgrupos por IDGRUPOESTRUTURA
      const gruposMap = new Map();

      dadosSubGrupo.forEach(subgrupo => {
        const grupoId = subgrupo.IDGRUPOESTRUTURA; // ID do grupo (não do subgrupo)
        const grupoDescricao = subgrupo.DSGRUPOESTRUTURA; // Nome do grupo

        // Se o grupo ainda não existe no Map, criar
        if (!gruposMap.has(grupoId)) {
          gruposMap.set(grupoId, {
            key: `grupo_${grupoId}`, // Chave única para o grupo com prefixo
            label: grupoDescricao,    // Nome do grupo
            children: [],             // Array dos subgrupos
          });
        }

        // Adicionar o subgrupo como filho do grupo
        gruposMap.get(grupoId).children.push({
          key: `subgrupo_${subgrupo.IDSUBGRUPOESTRUTURA}`, // Chave do subgrupo com prefixo
          label: subgrupo.DSSUBGRUPOESTRUTURA,              // Nome do subgrupo
          data: subgrupo // Opcional: dados completos do subgrupo
        });
      });

      // 2. Converter o Map em array para o TreeSelect
      const formattedTreeData = Array.from(gruposMap.values());
      setTreeData(formattedTreeData);

    }
  }, [dadosSubGrupo]);

  
  useEffect(() => {
    if (treeData.length && (grupoSelecionado.length || subGrupoDestino.length)) {
      const initialSelection = {};

      // Marcar grupos selecionados
      grupoSelecionado?.forEach(grupoId => {
        const chaveGrupo = `grupo_${grupoId}`;
        initialSelection[chaveGrupo] = true;
      });

      // Marcar subgrupos selecionados
      subGrupoDestino.forEach(subgrupoId => {
        const chaveSubgrupo = `subgrupo_${subgrupoId}`;
        initialSelection[chaveSubgrupo] = true;
      });

      setSelectedNodesOrigem(initialSelection);
      setSelectedNodesDestino(initialSelection);

    }
  }, [treeData]);

  const handleTreeSelectOrigemChange = (e) => {
    const selectedValue = e.value;
    setSelectedNodesOrigem(selectedValue);

    const selectedGrupo = [];
    const selectedSubGrupo = [];

    // Processar as chaves selecionadas
    Object.keys(selectedValue).forEach(key => {
      if (key.startsWith('grupo_')) {
        // Extrair o ID do grupo (remove o prefixo 'grupo_')
        const grupoId = key.replace('grupo_', '');
        selectedGrupo.push(grupoId);
      } else if (key.startsWith('subgrupo_')) {
        // Extrair o ID do subgrupo (remove o prefixo 'subgrupo_')
        const subgrupoId = Number(key.replace('subgrupo_', ''));
        selectedSubGrupo.push(subgrupoId);
      }
    });

    setGrupoSelecionado(selectedGrupo);
    setSubGrupoOrigem(selectedSubGrupo);
  };

  const handleTreeSelectDestinoChange = (e) => {
    const selectedValue = e.value;
    setSelectedNodesDestino(selectedValue);

    const selectedGrupo = [];
    const selectedSubGrupo = [];

    // Processar as chaves selecionadas
    Object.keys(selectedValue).forEach(key => {
      if (key.startsWith('grupo_')) {
        // Extrair o ID do grupo (remove o prefixo 'grupo_')
        const grupoId = key.replace('grupo_', '');
        selectedGrupo.push(grupoId);
      } else if (key.startsWith('subgrupo_')) {
        // Extrair o ID do subgrupo (remove o prefixo 'subgrupo_')
        const subgrupoId = Number(key.replace('subgrupo_', ''));
        selectedSubGrupo.push(subgrupoId);
      }
    });

    setGrupoSelecionado(selectedGrupo);
    setSubGrupoDestino(selectedSubGrupo);
  };

  const fetchProdutoSubGrupo = async () => {
    const urlBase = `/produto-subGrupo?idSubGrupo=${subGrupoDestino.join(',')}`;
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

  const { data: dadosProdutoSubGrupoDestino = [], error: errorProdutoSubGrupoDestino, isLoading: isLoadingProdutoSubGrupoDestino, refetch: refetchProdutoSubGrupoDestino } = useQuery(
    ['produto-subGrupo', subGrupoDestino],
    async () => fetchProdutoSubGrupo(),
    { enabled: Boolean(subGrupoDestino), staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: dadosProdutoSubGrupoOrigem = [], error: errorProdutoSubGrupoOrigem, isLoading: isLoadingProdutoSubGrupoOrigem, refetch: refetchProdutoSubGrupoOrigem } = useQuery(
    ['produto-subGrupo', subGrupoOrigem],
    async () => fetchProdutoSubGrupo(),
    { enabled: Boolean(subGrupoOrigem), staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const handleChangeGrupo = (e) => {
    const checked = e.checked;
    setIsCheckedGrupo(checked);
    if (checked) {
      setIsCheckedGrupoProduto(false);
      setIsCheckedProduto(false);
    }
  }

  const handleChangeProduto = (e) => {
    const checked = e.checked;
    setIsCheckedProduto(checked);
    if (checked) {
      setIsCheckedGrupo(false);
      setIsCheckedGrupoProduto(false);
    }
  }

  const handleChangeGrupoProduto = (e) => {
    const checked = e.checked;
    setIsCheckedGrupoProduto(checked);
    if (checked) {
      setIsCheckedGrupo(false);
      setIsCheckedProduto(false);
    }
  }

  const mostrarModalEstruturaDestino = () => {
    setModalEstProdDestino(true);
  }

  const mostrarModalEstruturaOrigem = () => {
    setModalEstProdOrigem(true);
  }

  return (
    <Fragment>
      <ActionMainPromocao
        linkComponentAnterior={["Home"]}
        linkComponent={["Cadastro de Promoções"]}
        title="Cadastro de Promoções"

        InputSelectMecanicaComponent={InputSelectActionPromocao}
        labelSelectMecanica={"Mecanica"}
        optionsMecanica={dadosMecanicas.map((item) => ({
          value: item.ID,
          label: `${item.ID} - ${item.DESCRICAO}`,
          APLICAODESTINO: item.APLICAODESTINO,
          TIPODESCONTO: item.TIPODESCONTO
        }))}
        defaultValueSelectMecanica={mecanicaSelecionada}
        onChangeSelectMecanica={(e) => handleChangeMecanica(e.value)}
        styleMecanica={customStyles}
        // valueSelectMecanica={mecanicaSelecionada}
        // readOnlyMecanica={mecanicaSelecionada === 0 ? true : false}

        InputFieldPrecoComponent={InputFieldAction}
        labelInputPreco={"Criar Nova Mecânica"}
        valueInputFieldPreco={mecanicaSelecionadaEdicao}
        onChangeInputFieldPreco={(e) => setMecanicaSelecionadaEdicao(e.target.value)}
        readOnlyPreco={isEditandoMecanica}

        ButtonTypeSalvarMecanica={ButtonType}
        linkNomeSalvarMecanica={"Salvar Mecânica"}
        onButtonClickSalvarMecanica={handleSalvarMecanica}
        corSalvarMecanica={btnSalvar ? "danger" : "success"}
        IconSalvarMecanica={IoIosSend}
        readOnlySalvarMecanica={btnSalvar}

        ButtonTypeEditarMecanica={ButtonType}
        linkNomeEditarMecanica={"Editar Mecânica"}
        onButtonClickEditarMecanica={handleEditarMecanica}
        corEditarMecanica={mecanicaSelecionada <= 0 ? "warning" : "info"}
        IconEditarMecanica={GrView}
        readOnlyEditarMecanica={mecanicaSelecionada <= 0}

        InputFieldQTDInicioComponent={InputFieldAction}
        labelInputQTDInicio={"QTD Aparti de"}
        valueInputFieldQTDInicio={qtdInicio}
        onChangeInputFieldQTDInicio={(e) => {
          let valor = e.target.value.replace(/,/g, '.');
          valor = valor.replace(/[^0-9.]/g, '');
          const parts = valor.split('.');
          if (parts.length > 2) {
            valor = parts[0] + '.' + parts.slice(1).join('');
          }

          if (valor.length > 1 && valor.startsWith('0') && !valor.startsWith('0.')) {
            valor = valor.replace(/^0+/, '');
          }
          setQtdInicio(valor);
        }}
        readOnlyQTDInicio={
          mecanicaSelecionada == 1 && mecanicaSelecionadaEdicao !== "PROMOÇÃO POR EM UM PRODUTO // QUANTIDADE VALOR // VALOR FINAL" 
            ? true 
            : false
        }
        // styleQTDInicio={styleQTDInicio}

        InputFieldQTDFimComponent={InputFieldAction}
        labelInputQTDFim={"Vr Apartir de"}
        valueInputFieldQTDFim={valorInicio}
        onChangeInputFieldQTDFim={(e) => {
          let valor = e.target.value.replace(/,/g, '.');
          valor = valor.replace(/[^0-9.]/g, '');
          const parts = valor.split('.');
          if (parts.length > 2) {
            valor = parts[0] + '.' + parts.slice(1).join('');
          }

          if (valor.length > 1 && valor.startsWith('0') && !valor.startsWith('0.')) {
            valor = valor.replace(/^0+/, '');
          }
          setValorInicio(Number(valor));
        }}
        readOnlyQTDFim={mecanicaSelecionada == 1 ? false : true}

        InputFieldDescontoComponent1={InputFieldAction}
        labelInputFieldDesconto1={"Vr Desconto "}
        valueInputFieldDesconto1={vrDesconto}
        onChangeInputFieldDesconto1={(e) => {
          let valor = e.target.value.replace(/,/g, '.');
          valor = valor.replace(/[^0-9.]/g, '');
          const parts = valor.split('.');
          if (parts.length > 2) {
            valor = parts[0] + '.' + parts.slice(1).join('');
          }

          if (valor.length > 1 && valor.startsWith('0') && !valor.startsWith('0.')) {
            valor = valor.replace(/^0+/, '');
          }
          setVrDesconto(Number(valor));
        }}
        readOnlyDesconto1={tipoDescontoSelecionado == 1 ? false : true}
        // styleDesconto1={styleDesconto1}


        InputFieldDescontoComponent2={InputFieldAction}
        labelInputFieldDesconto2={"Desconto %"}
        valueInputFieldDesconto2={porcentoDesconto}
        onChangeInputFieldDesconto2={(e) => handlePorcentoDesconto(Number(e.target.value))}
        readOnlyDesconto2={tipoDescontoSelecionado == 2 ? false : true}
        // styleDesconto2={styleDesconto2}

        InputFieldVrInicio={InputFieldAction}
        labelInputFieldVrInicio={"Vr Desconto Final"}
        valueInputFieldVrInicio={precoProduto}
        onChangeInputFieldVrInicio={(e) => {
          let valor = e.target.value.replace(/,/g, '.');

          valor = valor.replace(/[^0-9.]/g, '');
          const firstDotIndex = valor.indexOf('.');
          if (firstDotIndex !== -1) {
            valor =
              valor.substring(0, firstDotIndex + 1) +
              valor.substring(firstDotIndex + 1).replace(/\./g, '');
          }

          if (
            valor.length > 1 &&
            valor.startsWith('0') &&
            !valor.startsWith('0.')
          ) {
            valor = valor.replace(/^0+/, '');
            if (valor === '') valor = '0';
          }
          setPrecoProduto(valor);
        }}
        readOnlyVrInicio={tipoDescontoSelecionado == 0 ? false : true}

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


        InputSelectMarcasComponent={InputSelectActionPromocao}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          { value: "all", label: "Selecionar Todas" },
          ...(Array.isArray(optionsMarcas)
            ? optionsMarcas.map((marca) => ({
              value: marca.IDGRUPOEMPRESARIAL,
              label: marca.DSGRUPOEMPRESARIAL
            }))
            : [])
        ]}
        onChangeSelectMarcas={(e) => {
          if (e.value === "all") {
            const allValues = optionsMarcas?.map((marca) => marca.IDGRUPOEMPRESARIAL);
            setMarcaSelecionada(allValues);
          } else {
            setMarcaSelecionada(e.value);
          }
        }}
        defaultValueSelectMarca={marcaSelecionada}
        // valueSelectMarca={marcaSelecionada}

        InputSelectEmpresaComponentAync={MultSelectAction}
        labelSelectEmpresaAsync={"Empresa"}
        optionsEmpresasAsync={[
          { value: "all", label: "Selecionar Todas" },
          ...empresasFiltradas?.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA
          }))
        ]}
        onChangeSelectEmpresaAsync={(selectedOptions) => {
          if (selectedOptions.some((option) => option.value === "all")) {

            const allValues = empresasFiltradas.map((empresa) => empresa.IDEMPRESA);
            setEmpresaSelecionada(allValues);
          } else {
            handleEmpresaChange(selectedOptions);
          }
        }}
        valueSelectEmpresaAsync={
          empresasFiltradas
            .filter(empresa => Array.isArray(empresaSelecionada) ? empresaSelecionada.includes(empresa.IDEMPRESA) : empresaSelecionada === empresa.IDEMPRESA)
            .map(empresa => ({
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA
            }))
        }

        InputSelectSubGrupoOrigemComponentAync={MultSelectAction}
        labelSelectSubGrupoOrigemAsync={"Sub Grupo Origem"}
        optionsSubGrupoOrigemAsync={[
          { value: "all", label: "Selecionar Todas" },
          ...(dadosGrupo?.map((item) => ({
            value: item.IDSUBGRUPOESTRUTURA,
            label:  `${item.IDSUBGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA} - ${item.TPSECAO} `
          })) || [])
        ]}

        valueSelectSubGrupoOrigemAsync={
          Array.isArray(subGrupoOrigem) && Array.isArray(dadosGrupo)
            ? dadosGrupo
                .filter(item => subGrupoOrigem.includes(String(item.IDSUBGRUPOESTRUTURA)))
                .map(item => ({
                  value: item.IDSUBGRUPOESTRUTURA,
                  label: `${item.IDSUBGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA} - ${item.TPSECAO} `
                }))
            : []
        }
        onChangeSelectSubGrupoOrigemAsync={(e) => {
          if (e.some((option) => option.value === "all")) {
            const allValues = dadosGrupo.map((grupo) => String(grupo.IDSUBGRUPOESTRUTURA));
            setSubGrupoOrigem(allValues);
          } else {            
            handleChangeSubGrupoOrigem(e);
          }
        }}

        MenuTreeSelectOrigemComponent={MenuTreeSelect}
        valueTreeSelectOrigem={selectedNodesOrigem}
        onChangeTreeSelectOrigem={handleTreeSelectOrigemChange}
        optionsTreeSelectOrigem={treeData}
        placeholderTreeSelectOrigem={"Selecione"}

        InputSelectSubGrupoDestinoComponentAync={MultSelectAction}
        labelSelectSubGrupoDestinoAsync={"Sub Grupo Destino"}
        optionsSubGrupoDestinoAsync={[
          { value: "all", label: "Selecionar Todas" },
          ...(dadosGrupo?.map((item) => ({
            value: item.IDSUBGRUPOESTRUTURA,
            label:  `${item.IDSUBGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA} - ${item.TPSECAO} `
          })) || [])
        ]}

        valueSelectSubGrupoDestinoAsync={
          Array.isArray(subGrupoDestino) && Array.isArray(dadosGrupo)
            ? dadosGrupo
                .filter(item => subGrupoDestino.includes(String(item.IDSUBGRUPOESTRUTURA)))
                .map(item => ({
                  value: item.IDSUBGRUPOESTRUTURA,
                  label: `${item.IDSUBGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA} - ${item.TPSECAO} `
                }))
            : []
        }
        onChangeSelectSubGrupoDestinoAsync={(e) => {
          if (e.some((option) => option.value === "all")) {
            const allValues = dadosGrupo.map((grupo) => String(grupo.IDSUBGRUPOESTRUTURA));
            setSubGrupoDestino(allValues);
          } else {            
            handleChangeSubGrupoDestino(e);
          }
        }}

        MenuTreeSelectDestinoComponent={MenuTreeSelect}
        valueTreeSelectDestino={selectedNodesDestino}
        onChangeTreeSelectDestino={handleTreeSelectDestinoChange}
        optionsTreeSelectDestino={treeData}
        placeholderTreeSelectDestino={"Selecione"}
    
        MenuTreeSelectOrigemComponentEstProd={MenuTreeSelect}
        valueTreeSelectOrigemEstProd={selectedNodesOrigem}
        onChangeTreeSelectOrigemEstProd={handleTreeSelectOrigemChange}
        optionsTreeSelectOrigemEstProd={treeData}
        // placeholderTreeSelectOrigemEstProd
        labelSelectSubGrupoOrigemAsyncEstProd={"Sub Grupo Origem"}
        
        ButtonTypeProdutoEstruturaOrigem={ButtonType}
        linkNomeProdutoEstruturaOrigem={"Visualizar Estrutura / Produto Origem"}
        onButtonClickProdutoEstruturaOrigem={mostrarModalEstruturaOrigem}
        corProdutoEstruturaOrigem={"warning"}
        IconProdutoEstruturaOrigem={GrView}

        MenuTreeSelectDestinoComponentEstProd={MenuTreeSelect}
        valueTreeSelectDestinoEstProd={selectedNodesDestino}
        onChangeTreeSelectDestinoEstProd={handleTreeSelectDestinoChange}
        optionsTreeSelectDestinoEstProd={treeData}
        placeholderTreeSelectDestinoEstProd
        labelSelectSubGrupoDestinoAsyncEstProd={"Sub Grupo Destino"}

        ButtonTypeProdutoEstruturaDestino={ButtonType}
        linkNomeProdutoEstruturaDestino={"Visualizar Estrutura / Produto Destino"}
        onButtonClickProdutoEstruturaDestino={mostrarModalEstruturaDestino}
        corProdutoEstruturaDestino={"info"}
        IconProdutoEstruturaDestino={GrView}


        InputGrupoEstrutura={InputFieldActionRadio}
        labelInputGrupoEstrutura={"Estrutura Mercadológica"}
        valueInputGrupoEstrutura={isCheckedGrupo}
        onChangeInputGrupoEstrutura={handleChangeGrupo}

        InputGrupoEstruturaProduto={InputFieldActionRadio}
        labelInputGrupoEstruturaProduto={"Estrutura / Produto"}
        valueInputGrupoEstruturaProduto={isCheckedGrupoProduto}
        onChangeInputGrupoEstruturaProduto={handleChangeGrupoProduto}

        InputProduto={InputFieldActionRadio}
        labelInputProduto={"Por Produtos"}
        valueInputProduto={isCheckedProduto}
        onChangeInputProduto={handleChangeProduto}

        styleProduto={{ display: isCheckedProduto ? 'block' : 'none' }}
        styleEstrutura={{ display: isCheckedGrupo ? 'block' : 'none' }}
        styleEstruturaProduto={{ display: isCheckedGrupoProduto ? 'block' : 'none' }}

        InputFieldProdutoOigem={InputFieldAction}
        labelInputFieldProdutoOigem={"Produto Origem"}
        valueInputFieldProdutoOigem={produtoOrigem}
        onChangeInputFieldProdutoOigem={(e) => setProdutoOrigem(e.target.value)}
        readOnlyProdutoOigem={fileProdutoOrigem.length > 0 ? true : false}

        ButtonTypeProdutoPesquisadoOrigem={ButtonType}
        linkNomeProdutoPesquisadoOrigem={"Visualizar Produto Pesquisado Origem"}
        onButtonClickProdutoPesquisadoOrigem={handlePesquisarProdutoOrigem}
        corProdutoPesquisadoOrigem={"warning"}
        IconProdutoPesquisadoOrigem={GrView}

        InputFileProdutoOigem={InputFieldAction}
        labelInputFileProdutoOigem={"Produto Origem"}
        acceptFileProdutoOigem=".csv, .xls, .xlsx"
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


        InputFieldProdutoDestino={InputFieldAction}
        labelInputFieldProdutoDestino={"Produto Destino"}
        valueInputFieldProdutoDestino={produtoDestino}
        onChangeInputFieldProdutoDestino={(e) => setProdutoDestino(e.target.value)}
        readOnlyProdutoDestino={fileProdutoDestino.length > 0 ? true : false}

        ButtonTypeProdutoPesquisadoDestino={ButtonType}
        linkNomeProdutoPesquisadoDestino={"Visualizar Produto Pesquisado Destino"}
        onButtonClickProdutoPesquisadoDestino={handlePesquisarProdutoDestino}
        corProdutoPesquisadoDestino={"secondary"}
        IconProdutoPesquisadoDestino={GrView}

        InputFileProdutoDestino={InputFieldAction}
        labelInputFileProdutoDestino={"Produto Destino"}
        acceptFileProdutoDestino=".csv, .xls, .xlsx"
        onChangeInputFileProdutoDestino={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0], false);
            setProdutoDestino('')
          } else {
            setFileProdutoDestino([]);
          }
        }}
        readOnlyFileProdutoDestino={produtoDestino.length > 0 ? true : false}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Visualizar Produtos Destino"}
        onButtonClickCadastro={() => {
          mostrarProdutosSelecionadosDestino('destino');
          setProdutoDestino('');
        }}
        corCadastro={"success"}
        IconCadastro={GrView}


        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Cadastrar Promoção"}
        onButtonClickSearch={handleCadastrar}
        corSearch={"primary"}
        IconSearch={IoIosSend}
        styleButtonSearch={isCheckedProduto ? false : true}

        ButtonTypePedido={ButtonType}
        linkPedido={"Cadastrar Promoção Mercadologica"}
        onButtonClickPedido={handleCadastrarEstrutura}
        corPedido={"info"}
        IconPedido={IoIosSend}
        disabledBTBPedido={isCheckedGrupo ? false : true}

        ButtonTypeTXT={ButtonType}
        linkTXT={"Documentação"}
        onButtonClickTXT={mostrarDocumentacao}
        corTXT={"warning"}
        IconTXT={GrFormView}

        ButtonTypeRetornar={ButtonType}
        linkRetornar={"Baixar Planilha"}
        onButtonClickRetornar={downloadPlanilhaModelo}
        corRetornar={"success"}
        IconRetornar={FaDownload}
      />

      <ActionCadastrarPromocaoModal
        dadosPromocoesAtivas={dadosPromocoesAtivas}
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
      />


      <ActionProdutoDestinoModal
        show={modalProdutoDestino}
        handleClose={() => setModalProdutoDestino(false)}
        dadosProdutosPesquisa={dadosProdutosPesquisa}
        novoProdutoDestino={novoProdutoDestino}
        setNovoProdutoDestino={setNovoProdutoDestino}
        statusProdutoDestino={statusProdutoDestino}
        setStatusProdutoDestino={setStatusProdutoDestino}
        setProdutoDestino={setProdutoDestino}
      />

      <ActionProdutoOrigemModal
        show={modalProdutoOrigem}
        handleClose={() => setModalProdutoOrigem(false)}
        dadosProdutosPesquisa={dadosProdutosPesquisa}
        novoProdutoOrigem={novoProdutoOrigem}
        setNovoProdutoOrigem={setNovoProdutoOrigem}
        statusProdutoOrigem={statusProdutoOrigem}
        setStatusProdutoOrigem={setStatusProdutoOrigem}
        setProdutoOrigem={setProdutoOrigem}
      />

      <ActionProdutoDestinoModal
        show={modalProduto}
        handleClose={() => setModalProduto(false)}
        dadosProdutosPesquisa={dadosProdutosPesquisa}
      />


      {/* <ActionProdutoModalPromocaoSelecionado */}
      <ActionProdutoModalPromocaoSelecionadoCSVOrigem
        show={modalPodutoSelecionadoOrigem}
        handleClose={() => setModalPodutoSelecionadoOrigem(false)}
        produtoOrigemSelecionado={produtoOrigemSelecionado}
        setProdutoOrigemSelecionado={setProdutoOrigemSelecionado}
        novoProdutoOrigem={novoProdutoOrigem}
        setNovoProdutoOrigem={setNovoProdutoOrigem}
        fileProdutoOrigem={fileProdutoOrigem}
        setFileProdutoOrigem={setFileProdutoOrigem}

      />

      <ActionProdutoModalPromocaoSelecionadoDestino
        show={modalPodutoSelecionadoDestino}
        handleClose={() => setModalPodutoSelecionadoDestino(false)}
        produtoDestinoSelecionado={produtoDestinoSelecionado}
        setProdutoDestinoSelecionado={setProdutoDestinoSelecionado}
        novoProdutoDestino={novoProdutoDestino}
        setNovoProdutoDestino={setNovoProdutoDestino}
        fileProdutoDestino={fileProdutoDestino}
        setFileProdutoDestino={setFileProdutoDestino}
      />


      <ActionEstruturaProdutoOrigemModal
        show={modalEstProdOrigem}
        handleClose={() => setModalEstProdOrigem(false)}
        dadosProdutoSubGrupoOrigem={dadosProdutoSubGrupoOrigem}
        produtoSelecionadoEstProdOrigem={produtoSelecionadoEstProdOrigem}
        setProdutoSelecionadoEstProdutoOrigem={setProdutoSelecionadoEstProdutoOrigem}
        novoProdutoEstProdOrigem={novoProdutoEstProdOrigem}
        setNovoProdutoEstProdOrigem={setNovoProdutoEstProdOrigem}
      />  

      <ActionEstruturaProdutoDestinoModal 
        show={modalEstProdDestino}
        handleClose={() => setModalEstProdDestino(false)}
        dadosProdutoSubGrupoDestino={dadosProdutoSubGrupoDestino}
        produtoSelecionadoEstProdDestino={produtoSelecionadoEstProdDestino}
        setProdutoSelecionadoEstProdutoDestino={setProdutoSelecionadoEstProdutoDestino}
        novoProdutoEstProdDestino={novoProdutoEstProdDestino}
        setNovoProdutoEstProdDestino={setNovoProdutoEstProdDestino}
      />
      <ActionDocumentacaoCriar
        show={modalDocumentacao}
        handleClose={() => setModalDocumentacao(false)}
      />
    </Fragment>
  )
}
