import { Fragment, useEffect, useState } from "react"
import makeAnimated from 'react-select/animated';
import { AiOutlineSearch } from "react-icons/ai"
import { get } from "../../../api/funcRequest";
import { ActionMain } from "../../Actions/actionMain";
import { InputField } from "../../Buttons/Input";
import { InputSelectAction } from "../../Inputs/InputSelectAction";
import { MultSelectAction } from "../../Select/MultSelectAction";
import { ButtonType } from "../../Buttons/ButtonType";



export const ActionPesquisaVendasPeriodo = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaConsolidadaVisivel, setTabelaConsolidadaVisivel] = useState(false);
  const [tabelaSaldoVisivel, setTabelaSaldoVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState(null)
  const [grupoSelecionado, setGrupoSelecionado] = useState([])
  const [gradeSelecionado, setGradeSelecionado] = useState([])
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState([])
  const [ufSelecionado, setUFSelecionado] = useState('')
  const [produtoPesquisado, setProdutoPesquisado] = useState('')
  const [optionsEmpresas, setOptionsEmpresas] = useState([])
  const [optionsMarcas, setOptionsMarcas] = useState([])
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [dadosFornecedor, setDadosFornecedor] = useState([])
  const [dadosGrupos, setDadosGrupos] = useState([])
  const [dadoGrade, setDadosGrade] = useState([])
  const [dadosVendasPeriodo, setDadosVendasPeriodo] = useState([])
  const [dadosVendasConsolidadas, setDadosVendasConsolidadas] = useState([])
  const [dadosVendasSaldo, setDadosVendasSaldo] = useState([])

  const animatedComponents = makeAnimated();

  useEffect(() => {
    if(getGrupoEmpresas) {

      getListaEmpresas(marcaSelecionada);
    }
    getGrupoEmpresas();
    getListaFornecedor();
    getListaGrupo();
    getListaGrade(grupoSelecionado)
  }, [grupoSelecionado, marcaSelecionada]);

  const getListaEmpresas = async () => {
    if(marcaSelecionada) {

      try {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        if (response.data && response.data.length > 0) {
          setOptionsEmpresas(response.data);
        }
        return response.data;
      } catch (error) {
  
      }
    }
  }
  const getGrupoEmpresas = async () => {
    try {

      const response = await get(`/listaGrupoEmpresas`,)
      if (response.data) {
        setOptionsMarcas(response.data)
        // console.log(response.data, 'response.data')
      }

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const getListaFornecedor = async () => {
    
    try {
      const response = await get(`/listaFornecedorProduto?idMarca=`)
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
      const response = await get(`/listaGrupoProduto`)
      if (response.data) { 
        setDadosGrupos(response.data)
        console.log(response.data, 'response.data')
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

  const getListaVendasPeriodo = async () => {

    try {
      const response = await get(`vendasProdutos?page=1&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&produtoPesquisado=${produtoPesquisado}&ufPesquisa=${ufSelecionado}&idFornecedor=${fornecedorSelecionado}&idGrupoGrade=${grupoSelecionado}&idGrade=${gradeSelecionado}`)
      if(response.data) {
        setDadosVendasPeriodo(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar dados da venda por período: ', error)
    }
  }

  const getListaVendasConsolidadas = async () => {
    try {
      const response = await get(`vendasProdutosConsolidado?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&produtoPesquisado=${produtoPesquisado}&ufPesquisa=${ufSelecionado}&idFornecedor=${fornecedorSelecionado}&idGrupoGrade=${grupoSelecionado}&idGrade=${gradeSelecionado}`)
      if(response.data) {
        setDadosVendasConsolidadas(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar dados das vendas consolidadas: ', error)
    }
  }

  const getListaVendasSaldo = async () => {
    try {
      const response = await get(`movimentacaoSaldo?dataInicio=${dataPesquisaInicio}&dataFim=${dataPesquisaFim}&idGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&produtoPesquisado=${produtoPesquisado}&ufPesquisa=${ufSelecionado}&idFornecedor=${fornecedorSelecionado}&idGrupoGrade=${grupoSelecionado}&idGrade=${gradeSelecionado}`)
      if(response.data) {
        setDadosVendasSaldo(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar dados das vendas saldo: ', error)
    }
  }


  const handleEmpresaChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setEmpresaSelecionada(values);
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
    if(!isNaN(selectedSubGrupo)){
      setGradeSelecionado(selectedSubGrupo);
    }
  }

  const handleFornecedorChange = (e) => {
    const selectedFornecedor = e.value;
    if(!isNaN(selectedFornecedor)){
      setFornecedorSelecionado(selectedFornecedor);
    }
  }

  const handleSelectUF = (e) => {
    const selectedUF = e.value;
    setUFSelecionado(selectedUF);
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      setTabelaConsolidadaVisivel(false)
      setTabelaSaldoVisivel(false)
      getListaVendasPeriodo(dataPesquisaInicio, dataPesquisaFim, marcaSelecionada, empresaSelecionada)
    }
  }

  const handleClickConsolidado = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaConsolidadaVisivel(true)
      setTabelaVisivel(false)
      setTabelaSaldoVisivel(false)
      getListaVendasConsolidadas()
    }
  }

  const handleClickSaldo = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaSaldoVisivel(true)
      setTabelaVisivel(false)
      setTabelaConsolidadaVisivel(false)
      getListaVendasSaldo()
    }
  }


  const optionsUF = [
    { value: 'DF', label: 'DF' },
    { value: 'GO', label: 'GO' },
  ]

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatórios Vendas"]}
        title="Vendas por Período"
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

        InputSelectGradeComponent={InputSelectAction}
        optionsGrades={[
          {value: '', label: 'Selecione uma Grade'},
          ...dadoGrade.map((grade) => ({
          value: grade.NOMEGRUPO,
          label: grade.NOMEGRUPO,
          }))
        ]}
        labelSelectGrade={"Por Grade"}
        valueSelectGrade={gradeSelecionado}
        onChangeSelectGrade={handleGradeChange}

        InputSelectFornecedorComponent={InputSelectAction}
        optionsFornecedores={[
          {value: '', label: 'Selecione um Fornecedor'},
          ...dadosFornecedor.map((fornecedor) => ({
          value: fornecedor.ID_FORNECEDOR,
          label: `${fornecedor.ID_FORNECEDOR} ${fornecedor.FORNECEDOR}`,
          }))
        ]}
        labelSelectFornecedor={"Por Fornecedor"}
        valueSelectFornecedor={fornecedorSelecionado}
        onChangeSelectFornecedor={handleFornecedorChange}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras / Nome Produto"}
        valueInputFieldCodBarra={produtoPesquisado}
        onChangeInputFieldCodBarra={e => setProdutoPesquisado(e.target.value)}


        InputSelectUFComponent={InputSelectAction}
        optionsSelectUF={optionsUF.map((item) => ({
          value: item.value,
          label: item.label,
        }))}   
        labelSelectUF={"UF"}
        valueSelectUF={ufSelecionado}
        onChangeSelectUF={handleSelectUF}

        
        MultSelectGrupoComponent={MultSelectAction}
        labelMultSelectGrupo={"Empresa"}
        optionsMultSelectGrupo={optionsEmpresas.map((item) => {
          return {
            value: item.IDEMPRESA,
            label: item.NOFANTASIA,

          }
        })}
        // valueMultSelectGrupo={empresaSelecionada}
        defaultValueMultSelectGrupo={[empresaSelecionada]}
        onChangeMultSelectGrupo={handleEmpresaChange}
        animatedComponentsGrupo={animatedComponents}
        isMultiSelectGrupo

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
        linkNomeSearch={"Por Loja"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
        
        ButtonTypeCadastro={ButtonType}
        linkNome={"Por Produto"}
        onButtonClickCadastro={handleClickConsolidado}
        IconCadastro={AiOutlineSearch}
        corCadastro={"warning"}
        
        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Por Saldo"}
        onButtonClickCancelar={handleClickSaldo}
        IconCancelar={AiOutlineSearch}
        corCancelar={"danger"}
      />

        {tabelaVisivel && (
          <div className="card">
         
          </div>

        )}

        {tabelaConsolidadaVisivel && (
          <div className="card">
            
          </div>
        )}

        {tabelaSaldoVisivel && (
          <div className="card">
            
          </div>
        )}
        

    </Fragment >
  )
}

