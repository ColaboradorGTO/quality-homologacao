import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputFieldAction } from "../../../Buttons/InputAction";
import { InputSelectActionPromocao } from "../../../Inputs/InputSelectActionPromocao";
import { MultSelectAction } from "../../../Select/MultSelectAction";
import { GrFormView, GrView } from "react-icons/gr";
import { IoIosSend, IoMdReturnLeft } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { ActionMainProdutoClube } from "../../../Actions/ActionMainProdutoClube";
import { FaSearch } from "react-icons/fa";
import { ActionListaProdutos } from "./actionListaProdutos";
import { useEditeProdutoClube } from "../hooks/useEditeProdutoClube";

export const ActionEditarProdutoClube = ({detalhePromocao, usuarioLogado, optionsModulos, setActionEditarVisivel,setActionCriarVisivel }) => {
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null)
  
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
    onSubmit,
    downloadPlanilhaModelo,

  } = useEditeProdutoClube({detalhePromocao, usuarioLogado, optionsModulos});

  

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

        {/*  Criar um button para retornar a actionPesquisaListaProdutoClube */}

      <ActionListaProdutos
        dadosProdutosPromocao={dadosProdutosPromocao}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado} 
      />
    </Fragment>
  )
}

// 1120