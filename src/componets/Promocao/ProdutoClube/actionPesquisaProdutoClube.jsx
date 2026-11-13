import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { ButtonType } from "../../Buttons/ButtonType";
import { InputFieldAction } from "../../Buttons/InputAction";
import { InputSelectActionPromocao } from "../../Inputs/InputSelectActionPromocao";
import { MultSelectAction } from "../../Select/MultSelectAction";
import { GrFormView, GrView } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { get } from "../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../utils/animationCarregamento"
import { useCreateProdutoClube } from "./hooks/useCreateProdutoClube";
import { ActionMainProdutoClube } from "../../Actions/ActionMainProdutoClube";
import { ActionModalProduto } from "./ActionModalProduto/actionModalProduto";

export const ActionPesquisaProdutoClube = ({ usuarioLogado, menuFilhoAtual }) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNodesOrigem, setSelectedNodesOrigem] = useState({});
  const [selectedNodesDestino, setSelectedNodesDestino] = useState({});


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id && menuFilhoAtual?.ID), staleTime: 5 * 60 * 1000, }
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
    optionsMarcas,
    optionsEmpresas,
    handleFileUpload,
    mostrarProdutosSelecionadosOrigem,
    produtosOrigemDetalhados,
    handleRemoverProdutoOrigem,
    modalPodutoSelecionadoOrigem,
    setModalPodutoSelecionadoOrigem,
    onSubmit,
    downloadPlanilhaModelo,

  } = useCreateProdutoClube({usuarioLogado, optionsModulos});


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


  const fetchProdutoSubGrupoDestino = async () => {
    const urlBase = `/produto-subGrupo?idSubGrupo=`;
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
    ['produto-subGrupo', false],
    async () => fetchProdutoSubGrupoDestino(),
    { enabled: false, staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );


  console.log(empresasFiltradas, 'empresasFiltradas')

  return (
    <Fragment>
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
        linkNomeSearch={"Cadastrar Por Produto"}
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

      <ActionModalProduto 
        show={modalPodutoSelecionadoOrigem}
        handleClose={() => setModalPodutoSelecionadoOrigem(false)}
        produtosOrigemDetalhados={produtosOrigemDetalhados}
        handleRemoverProdutoOrigem={handleRemoverProdutoOrigem}
      />

    </Fragment>
  )
}

// 1120