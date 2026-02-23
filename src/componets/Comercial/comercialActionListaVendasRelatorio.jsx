import { Fragment, useEffect, useRef, useState } from "react"
import { ActionMain } from "../Actions/actionMain"
import { InputSelectAction } from "../Inputs/InputSelectAction"
import { ButtonSearch } from "../Buttons/ButtonSearch"
import { InputField } from "../Buttons/Input"
import { ButtonType } from "../Buttons/ButtonType"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from "../../api/funcRequest"
import { MultSelectAction } from "../Select/MultSelectAction"
import { formatMoeda } from "../../utils/formatMoeda"
import { dataFormatada } from "../../utils/dataFormatada"
import { AiOutlineSearch } from "react-icons/ai"
import { Paginator } from 'primereact/paginator';



export const ComercialActionListVendasRelatorioGeral  = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [empresaSelecionada, setEmpresaSelecionada] = useState([])
  const [marcaSelecionada, setMarcaSelecionada] = useState([])
  const [marcaProdutoSelecionada, setMarcaProdutoSelecionada] = useState([])
  const [grupoSelecionado, setGrupoSelecionado] = useState([])
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState([])
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState([])
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState([])
  const [produtoPesquisado, setProdutoPesquisado] = useState('')
  const [optionsEmpresas, setOptionsEmpresas] = useState([])
  const [optionsMarcas, setOptionsMarcas] = useState([])
  const [dadosGrupos, setDadosGrupos] = useState([])
  const [dadosSubGrupos, setDadosSubGrupos] = useState([])
  const [dadosFornecedor, setDadosFornecedor] = useState([])
  const [dadosColaborador, setDadosColaborador] = useState([])
  const [dadosMarcaProduto, setDadosMarcaProduto] = useState([])
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [ufSelecionado, setUFSelecionado] = useState([]);
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [dadosCustosLojas, setDadosCustosLojas] = useState([]);
  const [ totalClientes, setTotalClientes] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10); 
  const [totalRecords, setTotalRecords] = useState(0);
  const dataTableRef = useRef(null);
  const [rowSelection, setRowSelection] = useState(null);


  useEffect(() => {
    getListaEmpresas();
    getListaMarca();
    getListaGrupo();
    getListaSubGrupos();
    getListaFornecedor();
    getListaColaboradores();
    getListaMarcaProduto();
  }, []);

  const getListaMarca = async () => {
    try {
      const response = await get(`/marcasLista`,)
      if (response.data) {
        setOptionsMarcas(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar marcas: ', error)
    }
  }

  const getListaEmpresas = async () => {
    try {
      const response = await get(`/listaEmpresaComercial`);
      if (response.data && response.data.length > 0) {
        setOptionsEmpresas(response.data);
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
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar grupos: ', error)
    }
    
  }

  const getListaSubGrupos = async () => {
    try {
      const response = await get(`/listaSubGrupoProduto?idGrupo=${grupoSelecionado}`)
      if (response.data) { 
        setDadosSubGrupos(response.data)
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar sub grupos: ', error)
    }
    
  }

  const getListaFornecedor = async (marcaSelecionada = '') => {
    try {
      const response = await get(`/listaFornecedorProduto?idMarca=`)
      if (response.data) { 
        setDadosFornecedor(response.data)
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar lista de fornecedores: ', error)
    }
  }

  const getListaColaboradores = async (empresaSelecionada = '') => {
    try {
      const response = await get(`/funcionarioRelatorio?idEmpresa=${empresaSelecionada}`)
      if (response.data) { 
        setDadosColaborador(response.data)
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar lista de colaboradores: ', error)
    }
  }
  const getListaMarcaProduto = async (subGrupoSelecionado = '') => {
    try {
      const response = await get(`/listaMarcaProduto?idSubGrupo=${subGrupoSelecionado}`)
      if (response.data) { 
        setDadosMarcaProduto(response.data)
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar marcas de produtos: ', error)
    }
  }

  // Inicio Lista Vendas por custo de lojas
  const getListaVendasCustoLojas = async (page, pageSize, empresaSelecionada = '') => {
    const startIndex = page * pageSize;
    
    try {
      dataFormatada(dataPesquisaInicio)
      dataFormatada(dataPesquisaFim)
      console.log(empresaSelecionada, 'empresaSelecionada')
      const response = await get(`/custoPorLoja?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idGrupoEmpresarial=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&descricaoProduto=${descricaoProduto}&ufPesquisa=${ufSelecionado}&idFornecedor=${fornecedorSelecionado}&idGrupo=${grupoSelecionado}&idGrade=${subGrupoSelecionado}&idMarcaProduto=${produtoPesquisado}`)
      if (response.data) {
        setDadosCustosLojas(response.data);
        setTotalRecords(response.data.length);
      }
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar vendas por custo de lojas: ', error)
    }
  }

  useEffect(() => {
    getListaVendasCustoLojas(first / rows, rows)
  }, [first, rows])

  const calcularTotalVlLiquido = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRRECVOUCHER)
  }

  const calcularTotalMackup = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) / toFloat(item.VRCUSTOTOTAL)
  }

  const calcularSomaTotalLucro = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRCUSTOTOTAL)
  }

  const calcularTotalQtdClientes = () => {
    let total = 0;
    for (let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.QTD_CLIENTE);
    }
    return total;
  }

  const calcularTotalQtdClientesPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage; 
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex)
   
    for (let item of dataPaginada) {
      total += parseFloat(item.QTD_CLIENTE);
    }
    return total
    
  }


  const calcularTotalQtdProdutos = () => {
    let total = 0;
    for(let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.QTD_PRODUTO);
    }
    return total;
  }

  const calcularTotalQtdProdutosPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex)
    for(let item of dataPaginada) {
      total += parseFloat(item.QTD_PRODUTO);
    }
    return total;
  }

  const calcularTotalVendaBruta = () => {
    let total = 0;
    for(let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.VRTOTALVENDA)
    }
    return total;
  }

  const calcularTotalVendaBrutaPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex)
    for(let item of dataPaginada) {
      total += parseFloat(item.VRTOTALVENDA);
    }
    return total;
  }

  const calcularTotalLucro = () => {
    let total = 0;
    for (let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.valorTotalLucro)
    }
    return total;
  }

  const calcularTotalLucroPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex)
    for(let item of dataPaginada) {
      total += parseFloat(item.valorTotalLucro);
    }
    return total;
  }

  const calcularTotalVendaLiquida = () => {
    let total = 0;
    for (let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.valorTotalLiquido)
    }
    return total;
  }

  const calcularTotalVendaLiquidaPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex)
    for(let item of dataPaginada) {
      total += parseFloat(item.valorTotalLiquido);
    }
    return total;
  }

  const calcularTotalProjecaoMes = () => {
    let total = 0;
    for (let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.VRTOTALVENDA)
    }
    return total;
  }

  const calcularTotalProjecaoMesPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex )
    for(let item of dataPaginada) {
      total += parseFloat(item.VRTOTALVENDA);
    }
    return total;
  }
  const calcularTotalCustoTotalPorPagina = () => {
    let total = 0;
    const firstIndex = page * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    const dataPaginada = dadosListaVendasCustosLojas.slice(firstIndex, lastIndex )
    for(let item of dataPaginada) {
      total += parseFloat(item.VRCUSTOTOTAL);
    }
    return total;
  }

  const calcularTotalCustoTotal = () => {
    let total = 0;
    for(let dados of dadosListaVendasCustosLojas) {
      total += parseFloat(dados.VRCUSTOTOTAL);
    }
    return total;
  }

 

  const dadosListaVendasCustosLojas = dadosCustosLojas.map((item, index) => {
    let contador = index + 1;
    const valorTotalLiquido = calcularTotalVlLiquido(item);
    const valorTotalMackup = calcularTotalMackup(item);
    const valorTotalLucro = calcularSomaTotalLucro(item);
    return {
      NOFANTASIA: item.NOFANTASIA,
      QTD_CLIENTE: item.QTD_CLIENTE,
      QTD_PRODUTO: item.QTD_PRODUTO,
     
      VRRECVOUCHER: item.VRRECVOUCHER,
      VALORDESCONTO: item.VALORDESCONTO,
      VRCUSTOTOTAL: item.VRCUSTOTOTAL,
      VRTOTALVENDA: item.VRTOTALVENDA,

      valorTotalLiquido: valorTotalLiquido,
      valorTotalMackup: valorTotalMackup,
      valorTotalLucro: valorTotalLucro,
      contador
    }
  })
 
  const colunasVendasCustosLojas = [
    {field: 'contador', header: 'Nº', body: row => row.contador, sortable: true},
    {
      field: 'NOFANTASIA', 
      header: 'Loja', 
      body: row => row.NOFANTASIA, 
      sortable: true },
    { 
      field: 'QTD_CLIENTE',
      header: 'Qtd. Clientes',
      body: row => row.QTD_CLIENTE,
   
      footer: (row) => {
        return(
          <div>          
            {/* <p style={{ fontWeight: 600, }}>Total Linha: {row.QTD_CLIENTE}</p> */}
            <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdClientesPorPagina()}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdClientes()}</p>
          </div>
        )
      }, 
      sortable: true 
    },
    { field: 'QTD_PRODUTO',
      header: 'Qtd. Produtos',
      body: row => row.QTD_PRODUTO,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdProdutosPorPagina()}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {calcularTotalQtdProdutos()}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRTOTALVENDA',
      header: 'Venda Bruta (- Desc)',
      body: row => formatMoeda(row.VRTOTALVENDA),
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBrutaPorPagina())}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaBruta())}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalLiquido', 
      header: 'Venda Líq (- Voucher)', 
      body: row => formatMoeda(row.valorTotalLiquido),
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquidaPorPagina())}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalVendaLiquida())}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRTOTALVENDA',
      header: 'Projeção Mês',
      body: row => formatMoeda(row.VRTOTALVENDA),
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalProjecaoMesPorPagina())}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalProjecaoMes())}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'VRCUSTOTOTAL',
      header: 'Custo Total',
      body: row => formatMoeda(row.VRCUSTOTOTAL),
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalCustoTotalPorPagina())}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalCustoTotal())}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalLucro',
      header: 'Lucro Total',
      body: row => formatMoeda(row.valorTotalLucro),
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>Total: { formatMoeda(calcularTotalLucroPorPagina())}</p>
            <hr/>
            <p style={{ fontWeight: 600, }}>Total: {formatMoeda(calcularTotalLucro())}</p>
          </div>
        )
      },
      sortable: true 
    },
    { field: 'valorTotalMackup', 
      header: 'Mackup', 
      body: row => row.valorTotalMackup, 
      sortable: true 
    },
  ]

  // Fim Lista Vendas por custo de lojas

  const handleSelectMarca = (e) => {
    const selectedId = Number(e.target.value);
   
    if (!isNaN(selectedId)) {
      setMarcaSelecionada(selectedId);
    }
  };

  const handleEmpresaChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setEmpresaSelecionada(values);
  }
  
  const handleGrupoChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setGrupoSelecionado(values);
  }
 
  const handleSubGrupoChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setSubGrupoSelecionado(values);
  }
  
  const handleFornecedorChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setFornecedorSelecionado(values);
  }

  const handleFuncionarioChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setFuncionarioSelecionado(values);
  }

  const handleChangeMarcaProduto = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    setMarcaProdutoSelecionada(values);
  }

  const handleSelectUF = (e) => {
    const selectedUF = e.target.value;
    setUFSelecionado(selectedUF);
  }


  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      getListaVendasCustoLojas()
    }

  }


  const optionsUF = [
    { value: 'DF', label: 'DF' },
    { value: 'GO', label: 'GO' },
  ]
  
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatórios Vendas"]}
        title="Relatórios Vendas"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)} 
       

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


        InputSelectUFComponent={InputSelectAction}
        optionsSelectUF={optionsUF.map((item) => ({
          value: item.value,
          label: item.label,
        }))}   
        labelSelectUF={"UF"}
        valueSelectUF={ufSelecionado}
        onChangeSelectUF={handleSelectUF}


        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Por Marca"}
        optionsMarcas={[
          { value: null, label: 'Selecione uma Marca' },          
          ...optionsMarcas.map((empresa) => ({
          value: empresa.IDGRUPOEMPRESARIAL,
          label: empresa.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

  
        MultSelectEmpresaComponent={MultSelectAction}
        optionsMultSelectEmpresa={[
          { value: null, label: 'Selecione uma loja' },
            ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelMultSelectEmpresa={"Empresa"}
        valueMultSelectEmpresa={empresaSelecionada}
        onChangeMultSelectEmpresa={handleEmpresaChange}

        MultSelectGrupoComponent={MultSelectAction}
        optionsMultSelectGrupo={[
          {value: '', label: 'Selecione um Grupo'},
          ...dadosGrupos.map((item) => ({
            value: item.ID_GRUPO,
            label: item.GRUPO,
          }))
        ]}
        labelMultSelectGrupo={"Por Grupo"}
        valueMultSelectGrupo={grupoSelecionado}
        onChangeMultSelectGrupo={handleGrupoChange}

        MultSelectSubGrupoComponent={MultSelectAction}
        optionsMultSelectSubGrupo={[
          {value: '', label: 'Selecione um SubGrupo'},
          ...dadosSubGrupos.map((item) => ({
            value: item.ID_GRUPO,
            label: item.ESTRUTURA,
          }))
        ]}
        labelMultSelectSubGrupo={"SubGrupo"}
        valueMultSelectSubGrupoo={subGrupoSelecionado}
        onChangeMultSelectSubGrupo={handleSubGrupoChange}

        MultSelectMarcaComponent={MultSelectAction}
        labelMultSelectMarca={"Marcas"}
        optionsMultSelectMarca={dadosMarcaProduto.map((item) => {
          return {
            value: item.ID_MARCA,
            label: item.MARCA,

          }
        })}
        valueMultSelectMarca={marcaProdutoSelecionada}
        onChangeMultSelectMarca={handleChangeMarcaProduto}

        MultSelectFuncionarioComponent={MultSelectAction}
        labelMultSelectFuncionario={"Funcionário"}
        optionsMultSelectFuncionario={[
          {value: '', label: 'Selecione um Funcionário'},
          ...dadosColaborador.map((item) => ({
            value: item.IDFUNCIONARIO,
            label: item.NOFUNCIONARIO,
          }))
        ]}
        valueMultSelectFuncionario={funcionarioSelecionado}
        onChangeMultSelectFuncionario={handleFuncionarioChange}

        ButtonSearchComponent={ButtonSearch}
        linkNomeSearch={"Custo Por Loja "}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}

        ButtonTypeLoja={ButtonType}
        linkNomeLoja={"Posicionamento Estoque"}
        onButtonClickLoja

        ButtonTypeVendasVendedor={ButtonType}
        linkNomeVendasVendedor={"Vendas Por Vendedor"}
        onButtonClickVendasVendedor

        ButtonTypeProdutoVendidos={ButtonType}
        linkNomeProdutoVendido={"Vendas Por Estrutura"}
        onButtonClickProdutoVendido
        iconProdutoVendido={AiOutlineSearch}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Produtos Mais Vendidos"}
        onButtonClickVendasEstrutura
        iconVendasEstrutura={AiOutlineSearch}

        ButtonTypeSaldo={ButtonType}
        linkNomeSaldo={"Colaborador Produtos Vendidos"}
        onButtonClickSaldo
        iconTypeSaldo={AiOutlineSearch}
      />
      {tabelaVisivel && ( 
        <div className="card">

        <DataTable
          ref={dataTableRef}
          title="Vendas por Loja"
          value={dadosListaVendasCustosLojas}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator
          rowsPerPageOptions={[10, 20, 30]}
          first={first}
          rows={rows}
          selectionMode="single"
          selection={rowSelection}
          onSelectionChange={(e) => setRowSelection(e.value)}
          totalRecords={totalRecords}
          onPage={onPageChange}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasVendasCustosLojas.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}                          
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
              footerStyle={{ color: '', backgroundColor: "", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>


      </div>
      )}

    </Fragment>
  )
}