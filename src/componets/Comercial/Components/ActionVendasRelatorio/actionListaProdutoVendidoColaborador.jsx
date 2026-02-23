import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useRef } from "react";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaProdutoVendidoColaborador = ({ dadosColaboradorProdutosVendidos }) => {
  const [rowSelection, setRowSelection] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
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
    documentTitle: 'Produtos Vendidos Colaborador',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa',  'Operador', 'CPF', 'Cod. Barras', 'Produto', 'QTD', 'Valor Unitário', 'Valor Total']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.NOFUNCIONARIO,
        item.NUCPF,
        item.NUCODBARRAS,
        item.DSNOME,
        item.QTD,
        formatMoeda(item.VALOR_UNITARIO),
        formatMoeda(item.VALOR_TOTAL),

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_vendidos_colaborador.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa',  'Operador', 'CPF', 'Cod. Barras', 'Produto', 'QTD', 'Valor Unitário', 'Valor Total']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 100, caption: 'QTD' },
      { wpx: 100, caption: 'Valor Unitário' },
      { wpx: 100, caption: 'Valor Total' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Vendidos Colaborador');
    XLSX.writeFile(workbook, 'produtos_vendidos_colaborador.xlsx');
  };

  const dados = dadosColaboradorProdutosVendidos.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUCPF: item.NUCPF,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      QTD: item.QTD,
      VALOR_UNITARIO: item.VALOR_UNITARIO,
      VALOR_TOTAL: item.VALOR_TOTAL,

    }
  })

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
    return dados.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalPagina = (field) => {
    const dadosFiltrados = filtrarDados(dados, globalFilterValue);
    const firstIndex = first;
    const lastIndex = first + rows;
    const dataPaginada = dadosFiltrados.slice(firstIndex, lastIndex);
    return dataPaginada.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalValorTotalColaboradorPorPagina = () => {
    const totalPagina = calcularTotalPagina('VALOR_TOTAL');
    const totalGeral = calcularTotalGeral('VALOR_TOTAL');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalValorUnitarioColaboradorPorPagina = () => {
    const totalPagina = calcularTotalPagina('VALOR_UNITARIO');
    const totalGeral = calcularTotalGeral('VALOR_UNITARIO');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalQuantidadeProdutoColaboradoPorPagina = () => {
    const totalPagina = calcularTotalPagina('QTD');
    const totalGeral = calcularTotalGeral('QTD');

    if (globalFilterValue) {
      return `${totalPagina} (${totalGeral} total)`;
    }
    return `${totalPagina} (${totalGeral} total)`;
  }

  const colunasListaColaborador = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ width: '200px', margin: '0px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <p style={{ width: '200px', margin: '0px', fontWeight: 600 }}>{row.NOFUNCIONARIO}</p>,
      sortable: true,
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => <th>{row.NUCPF}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{ width: '200px', margin: '0px', fontWeight: 600 }}>{row.DSNOME}</p>,
      sortable: true,
    },

    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th>{row.QTD}</th>,
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalQuantidadeProdutoColaboradoPorPagina()}</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VALOR_UNITARIO',
      header: 'Valor Unitário',
      body: row => <th>{formatMoeda(row.VALOR_UNITARIO)}</th>,
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalValorUnitarioColaboradorPorPagina()}</p>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VALOR_TOTAL',
      header: 'Valor Total',
      body: row => <th>{formatMoeda(row.VALOR_TOTAL)}</th>,
      footer: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalValorTotalColaboradorPorPagina()}</p>
          </div>
        )
      },
      sortable: true,
    },
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Produtos Vendidos por Colaborador</h2>
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
            title="Produtos Vendidos por Colaborador"
            value={dados}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            first={first}
            rows={rows}
            onPage={onPageChange}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasListaColaborador.map(coluna => (
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