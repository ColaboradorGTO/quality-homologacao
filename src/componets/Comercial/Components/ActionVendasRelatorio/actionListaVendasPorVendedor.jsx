import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasPorVendedor  = ({dadosVendasVendedor}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  
  const onPageChange = (event) => {
      setFirst(event.first);
      setRows(event.rows);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Vendedor',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Matrícula', 'Funcionário', 'QTD Vendas', 'QTD Produtos', 'Valor Total Vendas', 'Valor Total Venda Liq', 'Valor Total Custo' ]],
      body: dadosListaVendedorVendas.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.VENDEDOR_MATRICULA,
        item.VENDEDOR_NOME,
        item.QTD_VENDAS,
        item.QTD_PRODUTOS,
        formatMoeda(item.VRTOTALVENDA),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.valorTotalVendaLiquida),
        formatMoeda(item.PRECO_COMPRA)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_vendedor.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaVendedorVendas);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Matrícula', 'Funcionário', 'QTD Vendas', 'QTD Produtos', 'Valor Total Vendas', 'Valor Total Venda Liq', 'Valor Total Custo' ]
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 100, caption: 'Funcionário' },
      { wpx: 100, caption: 'QTD Vendas' },
      { wpx: 100, caption: 'QTD Produtos' },
      { wpx: 100, caption: 'Valor Total Vendas' },
      { wpx: 100, caption: 'Valor Total Venda Liq' },
      { wpx: 100, caption: 'Valor Total Custo' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
  };


  const calcularValorTotalVendaLiquida = (item) => {
    
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRRECVOUCHER)
  }


  const dadosListaVendedorVendas = dadosVendasVendedor.map((item, index) => {
    let contador = index + 1;
    const valorTotalVendaLiquida = calcularValorTotalVendaLiquida(item);
    
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      VENDEDOR_MATRICULA: item.VENDEDOR_MATRICULA,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      QTD_VENDAS: item.QTD_VENDAS,
      QTD_PRODUTOS: item.QTD_PRODUTOS,
      VRTOTALVENDA: item.VRTOTALVENDA,
      VRRECVOUCHER: item.VRRECVOUCHER,
      valorTotalVendaLiquida: valorTotalVendaLiquida,
      PRECO_COMPRA: item.PRECO_COMPRA,
    }
  });
  
  const filtrarDados = (dados, filtro) => {
    if (!filtro) return dados;
    
    return dados.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(filtro.toLowerCase());
      });
    });
  };

  const calcularTotalGeral = (field) => {
    return dadosListaVendedorVendas.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalPagina = (field) => {
    const dadosFiltrados = filtrarDados(dadosListaVendedorVendas, globalFilterValue);
    const firstIndex = first;
    const lastIndex = first + rows;
    const dataPaginada = dadosFiltrados.slice(firstIndex, lastIndex);
    return dataPaginada.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalValorCustoPorPagina = () => {
    const totalPagina = calcularTotalPagina('PRECO_COMPRA');
    const totalGeral = calcularTotalGeral('PRECO_COMPRA');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalVendaLiquidaVendasVendedorPorPagina = () => {
    const totalPagina = calcularTotalPagina('valorTotalVendaLiquida');
    const totalGeral = calcularTotalGeral('valorTotalVendaLiquida');
    
    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalValorVoucherPorPagina = () => {
    const totalPagina = calcularTotalPagina('VRRECVOUCHER');
    const totalGeral = calcularTotalGeral('VRRECVOUCHER');
    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalVendaBrutaVendasVendedorPorPagina = () => {
    const totalPagina = calcularTotalPagina('VRTOTALVENDA');
    const totalGeral = calcularTotalGeral('VRTOTALVENDA');
    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalQuantidadeProdutosPorPagina = () => {
    const totalPagina = calcularTotalPagina('QTD_PRODUTOS');
    const totalGeral = calcularTotalGeral('QTD_PRODUTOS');
    if (globalFilterValue) {
      return `${totalPagina} (${totalGeral} total)`;
    }
    return `${totalPagina} (${totalGeral} total)`;
  }

  const calcularTotalQuantidadeVendasPorPagina = () => {
    const totalPagina = calcularTotalPagina('QTD_VENDAS');
    const totalGeral = calcularTotalGeral('QTD_VENDAS');
    if (globalFilterValue) {
      return `${totalPagina} (${totalGeral} total)`;
    }
    return `${totalPagina} (${totalGeral} total)`;
  }


  const colunasVendasVendedor = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{margin: '0px', width: '200px', fontWeight: 600}}>{row.NOFANTASIA}</p>,
      sortable: true
    },
    {
      field: 'VENDEDOR_MATRICULA',
      header: 'Matrícula',
      body: row => <th>{row.VENDEDOR_MATRICULA}</th>,
      sortable: true
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Funcionário',
      body: row => <p style={{margin: '0px', width: '200px', fontWeight: 600}}>{row.VENDEDOR_NOME}</p>,
      sortable: true
    },
    {
      field: 'QTD_VENDAS',
      header: 'Quantidade Vendas',
      body: row => <th>{row.QTD_VENDAS}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalQuantidadeVendasPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'QTD_PRODUTOS',
      header: 'Quantidade Produtos',
      body: row => <th>{row.QTD_PRODUTOS}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalQuantidadeProdutosPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Venda Bruta',
      body: row => <th>{formatMoeda(row.VRTOTALVENDA)}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalVendaBrutaVendasVendedorPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Valor Total Vouchers',
      body: row => <th>{formatMoeda(row.VRRECVOUCHER)}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalValorVoucherPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'valorTotalVendaLiquida',
      header: 'Total Venda Líquida',
      body: row => <th>{formatMoeda(row.valorTotalVendaLiquida)}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalVendaLiquidaVendasVendedorPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'PRECO_COMPRA',
      header: 'Total Custo',
      body: row => <th>{formatMoeda(row.PRECO_COMPRA)}</th>,
      footer: () => {
        return(
          <div>          
            <th style={{ fontWeight: 600, }}>{calcularTotalValorCustoPorPagina()}</th>
          </div>
        )
      },
      sortable: true
    }
  ]
 

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas por Vendedor</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Vendas por Vendedor"
            value={dadosListaVendedorVendas}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            onPage={onPageChange}
            first={first}
            rows={rows}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaVendedorVendas.length]}
            totalRecords={dadosListaVendedorVendas.length}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasVendedor.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem'}}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )

}