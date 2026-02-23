import React, { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaVendasMarca = ({dadosVendasMarca}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Marcas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['IDEMPRESA', 'Loja', 'QTD Clientes', 'Total Vendas', 'Ticket Médio']],
      body: dados.map(item => [
        item.IDEMPRESA,
        item.NOFANTASIA,
        item.QTDVENDA,
        formatMoeda(item.vrDisponivelBrutoVoucher),
        formatMoeda(item.totalTicketM),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_marca.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['IDEMPRESA', 'Loja', 'QTD Clientes', 'Total Vendas', 'Ticket Médio'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'IDEMPRESA' }, 
      { wpx: 200, caption: 'Loja' }, 
      { wpx: 100, caption: 'QTD Clientes' }, 
      { wpx: 100, caption: 'Total Vendas' }, 
      { wpx: 100, caption: 'Ticket Médio' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Marcas');
    XLSX.writeFile(workbook, 'vendas_marca.xlsx');
  };

  const calcularValorDisponivelBrutoVoucher = (item) => {
    return (
      toFloat(item.VRTOTALPAGO) -
      toFloat(item.VOUCHER)
    );
  }

  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
  };

  const calcularTotalQtdProduto = () => {
    const total = calcularTotal('QTDVENDA');
    return total;
  }

  const calcularTotalVoucher = () => {
    const total = calcularTotal('vrDisponivelBrutoVoucher');
    return total;
  }

  const calcularTotalTicketMedio = () => {
    const total = calcularTotal('QTDVENDA');
    const totalVoucher = calcularTotal('vrDisponivelBrutoVoucher');
    const totalTicketMedio = totalVoucher / total;
    return formatMoeda(totalTicketMedio);
  }

  const dados = dadosVendasMarca.map((item) => {
    const vrDisponivelBrutoVoucher = toFloat(item.VRTOTALPAGO) - toFloat(item.VOUCHER);
    const valorTicketM = (vrDisponivelBrutoVoucher / parseFloat(item.QTDVENDA));
    const totalTicketM = (vrDisponivelBrutoVoucher / parseFloat(item.QTDVENDA));
  
    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      QTDVENDA: parseFloat(item.QTDVENDA),
      vrDisponivelBrutoVoucher: vrDisponivelBrutoVoucher,
      valorTicketM: toFloat(valorTicketM),

      VRTOTALPAGO: parseFloat(item.VRTOTALPAGO),
      VOUCHER: parseFloat(item.VOUCHER),
      totalTicketM: toFloat(totalTicketM),
    };
  });

  const colunasVendas = [
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
      body: row => <th>{toFloat(row.QTDVENDA)}</th>,
      footer: calcularTotalQtdProduto(),
      sortable: true,
    },
    {
      field: 'vrDisponivelBrutoVoucher',
      header: 'Total Vendas',
      body: row => <th>{formatMoeda(row.vrDisponivelBrutoVoucher)}</th>,
      footer: formatMoeda(calcularTotalVoucher()),
      sortable: true,
    },
    {
      field: 'valorTicketM',
      header: 'Ticket Médio',
      body: row => <th>{formatMoeda(row.valorTicketM)}</th>,
      footer: row =>  calcularTotalTicketMedio(),
      sortable: true,
    },
  ];


  return (

      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas por Loja</h2>
        </div>
        <Fragment>
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
              title="Vendas por Loja"
              value={dados}
              globalFilter={globalFilterValue}
              size="small"
              sortOrder={-1}
              // paginator={true}
              // rows={10}
              // rowsPerPageOptions={[5, 10, 20, 50]}
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

        </Fragment>
      </div>
  )
}

