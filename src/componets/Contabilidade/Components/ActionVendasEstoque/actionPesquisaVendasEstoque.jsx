import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { MultSelectAction } from "../../../Select/MultSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaVendasEstoque } from "./actionListaVendasEstoque";

export const ActionPesquisaVendasEstoque = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosEstoqueAtual, setDadosEstoqueAtual] = useState([]);
  const [dadosGrupos, setDadosGrupos] = useState([]);
  const [optionsMarcas, setOptionsMarcas] = useState([]);
  const [dadosFornecedor, setDadosFornecedor] = useState([]);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [produtoPesquisado, setProdutoPesquisado] = useState('');
  const [grupoGradeSelecionado, setGrupoGradeSelecionado] = useState('');
  const [gradeSelecionado, setGradeSelecionado] = useState(null);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [dadoGrade, setDadosGrade] = useState([])

  useEffect(() => {
    getListaFornecedor();
    getListaGrupo();
    getListaGrade();
    getGrupoEmpresas();
  
  }, [])

  const getListaFornecedor = async () => {  
    try {
      const response = await get(`/listaFornecedorProduto`)
      if (response.data) { 
        setDadosFornecedor(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const getListaGrupo = async () => {   
    try {
      const response = await get(`/grupoProdutoSap`)
      if (response.data) { 
        setDadosGrupos(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
    
  }
  
  const getListaGrade = async () => {
    try {
      const response = await get(`/listaGrade?idGrupo=${grupoSelecionado}`)
      if (response.data) { 
        setDadosGrade(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
    
  }

  const getGrupoEmpresas = async () => {
    try {
      const response = await get(`/listaGrupoEmpresas`,)
      if (response.data) {
        setOptionsMarcas(response.data)
      }
    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }


  const getListaEstoqueAtual = async () => {
    try {
      const response = await get(`/vendasEstoqueComercial?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idGrupoEmpresarial=${grupoSelecionado}&produtoPesquisado=${produtoPesquisado}&idFornecedor=${fornecedorSelecionado}&idGrupoGrade=${grupoGradeSelecionado}&idGrade=${gradeSelecionado}`)
      if (response.data) {
        setDadosEstoqueAtual(response.data)
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }    
  }


  const handleSelectMarcas = (e) => {
    const selectedId = Number(e.value);
    if (!isNaN(selectedId)) {
      setMarcaSelecionada(selectedId);
    }
  }

  const handleGrupoChange = (e) => {
    const selectedGrupo = e.value;
    if(!isNaN(selectedGrupo)){
      setGrupoSelecionado(selectedGrupo);
    }
 
  }

  const handleGradeChange = (e) => {
    const selectedSubGrupo = e.value;
    if(selectedSubGrupo){
      setGradeSelecionado(selectedSubGrupo);
    }
  }

  const handleFornecedorChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setFornecedorSelecionado(values);
  };
  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      getListaEstoqueAtual()
    } 

  }

  const optionsEmpresas = [
    { value: '1', label: 'Empresa 1' },
    { value: '2', label: 'Empresa 2' },
  ]
  return (

    <Fragment>             

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Vendas"]}
        title="Vendas Estoque"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)} 

        InputSelectGrupoComponent={InputSelectAction}
        optionsGrupos={[
          {value: '', label: 'Selecione um Grupo'},
          ...dadosGrupos.map((item) => ({
            value: item.IDGRUPO,
            label: item.GRUPOPRODUTO,
          }))
        ]}
        labelSelectGrupo={"Por Grupo"}
        valueSelectGrupo={grupoSelecionado}
        onChangeSelectGrupo={handleGrupoChange}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={[
          {value: '', label: 'Selecione uma Grade'},
          ...dadoGrade.map((grade) => ({
            value: grade.NOMEGRUPO,
            label: grade.NOMEGRUPO,
          }))
        ]}
        labelSelectSubGrupo={"Por Grade"}
        valueSelectSubGrupo={gradeSelecionado}
        onChangeSelectSubGrupo={handleGradeChange}

        MultSelectFornecedorComponent={MultSelectAction}
        optionsMultSelectFornecedor={[
          {value: '', label: 'Selecione um Fornecedor'},
          ...dadosFornecedor.map((fornecedor) => ({
          value: fornecedor.ID_FORNECEDOR,
          label: `${fornecedor.ID_FORNECEDOR} ${fornecedor.FORNECEDOR}`,
          }))
        ]}
        labelMultSelectFornecedor={"Por Fornecedor"}
        valueMultSelectFornecedor={fornecedorSelecionado}
        onChangeMultSelectFornecedor={handleFornecedorChange}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        valueInputFieldCodBarra={produtoPesquisado}
        onChangeInputFieldCodBarra={e => setProdutoPesquisado(e.target.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marcas"}
        optionsMarcas={[
          { value: null, label: 'Selecione uma Marca' },          
          ...optionsMarcas.map((empresa) => ({
          value: empresa.IDGRUPOEMPRESARIAL,
          label: empresa.GRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarcas}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel &&
        <ActionListaVendasEstoque dadosEstoqueAtual={dadosEstoqueAtual} />
      }
   
    </Fragment >
  )
}

