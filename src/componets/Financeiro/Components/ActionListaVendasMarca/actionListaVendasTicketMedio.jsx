import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasTicketMedio = ({ dadosListaVendasMarca }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Período - Ticket Médio',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['IDEMPRESA', 'Loja', 'QTD Clientes', 'Total Vendas', 'Ticket Médio']],
      body: dadosVendasMarca.map(item => [
        item.IDEMPRESA,
        item.NOFANTASIA,
        parseFloat(item.QTDVENDA),
        formatMoeda(item.valorDisponivelBrutoVoucherTiketM),
        formatMoeda(item.valorTiketMedio)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_ticket_medio.pdf');

  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendasMarcaExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Loja', 'QTD Clientes', 'Total Vendas', 'Ticket Médio'];
    worksheet['!cols'] = [
      { wpx: 30, caption: 'ID', },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'QTD Clientes' },
      { wpx: 150, caption: 'Total Vendas' },
      { wpx: 100, caption: 'Ticket Médio' },];


    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Ticket Médio');
    XLSX.writeFile(workbook, 'vendas_ticket_medio.xlsx');
  };

  const calcularTotalClientesTiketMedio = (item) => {
    let total = 0;
    for (let vendas of dadosVendasMarca) {
      total += toFloat(vendas.QTDVENDA);
    }
    return total;
  }

  const calcularTotalVendasTiketMedio = (item) => {
    let total = 0;
    for (let vendas of dadosVendasMarca) {
      total += toFloat(vendas.valorDisponivelBrutoVoucherTiketM);
    }
    return total;
  }

  const calcularTotalTicketMedio = () => {
    const totalVendas = calcularTotalVendasTiketMedio();
    const totalClientes = calcularTotalClientesTiketMedio();
    return totalVendas / totalClientes;
  }
  const calcularValorDisponivelBrutoVoucherTiketM = (item) => {

    return (
      toFloat(item.VRTOTALPAGO) - toFloat(item.VOUCHER)
    )
  }

  const dadosVendasMarcaExcel = dadosListaVendasMarca.map((item, index) => {
    const valorDisponivelBrutoVoucherTiketM = calcularValorDisponivelBrutoVoucherTiketM(item);
    const valorTiketMedio = valorDisponivelBrutoVoucherTiketM / parseFloat(item.QTDVENDA);
    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      QTDVENDA: parseFloat(item.QTDVENDA),

      valorDisponivelBrutoVoucherTiketM: formatMoeda(valorDisponivelBrutoVoucherTiketM),
      valorTiketMedio: formatMoeda(valorTiketMedio),
    }
  })

  const dadosVendasMarca = dadosListaVendasMarca.map((item, index) => {
    const valorDisponivelBrutoVoucherTiketM = calcularValorDisponivelBrutoVoucherTiketM(item);
    const valorTiketMedio = valorDisponivelBrutoVoucherTiketM / parseFloat(item.QTDVENDA);

    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      QTDVENDA: item.QTDVENDA,

      valorDisponivelBrutoVoucherTiketM: valorDisponivelBrutoVoucherTiketM,
      valorTiketMedio: toFloat(valorTiketMedio),
    }
  })
  const colunasVendasTicketMedio = [
    {
      field: 'IDEMPRESA',
      header: '#',
      body: row => <th>{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th>{row.NOFANTASIA}</th>,
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'QTDVENDA',
      header: 'QTD Clientes',
      body: (row) => {
        return (
          <div >
            <th style={{ color: 'green' }}>

              {toFloat(row.QTDVENDA)}
            </th>
          </div>
        )
      },
      footer: calcularTotalClientesTiketMedio(),
      sortable: true,
    },
    {
      field: 'valorDisponivelBrutoVoucherTiketM',
      header: 'Total Vendas',
      body: (row) => {
        return (
          <div >
            <th style={{ color: 'blue' }}>

              {formatMoeda(row.valorDisponivelBrutoVoucherTiketM)}
            </th>
          </div>
        )
      },
      footer: formatMoeda(calcularTotalVendasTiketMedio()),
      sortable: true,
    },
    {
      field: 'valorTiketMedio',
      header: 'Ticket Médio',
      body: (row) => {
        return (
          <div >
            <th style={{ color: 'blue' }}>
              {formatMoeda(row.valorTiketMedio)}

            </th>
          </div>
        )
      },
      footer: formatMoeda(calcularTotalTicketMedio()),
      sortable: true,
    }
  ]

  return (

    <Fragment>
      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>
            Lista de Vendas Por Período - Ticket Médio

            <span className="fw-300">
              Por Marca
            </span>
          </h2>
        </div>
        <div style={{ marginBottom: "1rem" }}>
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
            title="Vendas por Loja"
            value={dadosVendasMarca}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dadosVendasMarca.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasTicketMedio.map(coluna => (
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

    </Fragment>
  )
}
