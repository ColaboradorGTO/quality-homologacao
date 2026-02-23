import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaVendasPeriodoLoja = ({ dadosVendasPeriodo }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);



  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Vendas Período',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Data', 'QTD', 'Vr Total', 'Desconto', 'Vr NF']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DATAEMISSAO,
        toFloat(item.QTD),
        formatMoeda(item.VALORPROD),
        formatMoeda(item.VALORDESCONTO),
        formatMoeda(item.VALORNF),

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_periodo.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Data', 'QTD', 'Vr Total', 'Desconto', 'Vr NF'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'QTD' },
      { wpx: 100, caption: 'Vr Total' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Vr NF' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Vendas Período');
    XLSX.writeFile(workbook, 'vendas_periodo.xlsx');
  };

  const calcularTotalQTDProduto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.QTD)
    }
    return total;
  }

  const calcularTotalValorProduto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.VALORPROD)
    }
    return total;
  }

  const calcularTotalValorDesconto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.VALORDESCONTO)
    }
    return total;
  }

  const calcularTotalValorNF = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.VALORNF)
    }
    return total;
  }

  const dados = dadosVendasPeriodo.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DATAEMISSAO: item.DATAEMISSAO,
      QTD: toFloat(item.QTD),
      VALORPROD: toFloat(item.VALORPROD),
      VALORDESCONTO: toFloat(item.VALORDESCONTO),
      VALORNF: toFloat(item.VALORNF),
    }
  })

  const colunasVendas = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
      footer: 'Total',
    },
    {
      field: 'DATAEMISSAO',
      header: 'Data',
      body: row => <th>{row.DATAEMISSAO}</th>,
      sortable: true,

    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th>{row.QTD}</th>,
      sortable: true,
      footer: calcularTotalQTDProduto()
    },
    {
      field: 'VALORPROD',
      header: 'Vr Total',
      body: row => <th>{formatMoeda(row.VALORPROD)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorProduto())
    },
    {
      field: 'VALORDESCONTO',
      header: 'Desconto',
      body: row => <th>{formatMoeda(row.VALORDESCONTO)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorDesconto())
    },
    {
      field: 'VALORNF',
      header: 'Vr NF',
      body: row => <th>{formatMoeda(row.VALORNF)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorNF())
    },
  ]

  return (

    <Fragment>

      <div className="panel" >
        <div className="panel-hdr">
          <h2>Vendas Período</h2>
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
            title="Vendas por Período"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment >
  )
}

