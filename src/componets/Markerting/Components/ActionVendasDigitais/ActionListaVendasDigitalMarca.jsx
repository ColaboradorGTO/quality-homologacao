import { Fragment, useRef, useState } from "react"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasDigitalMarca = ({ dadosVendasMarca }) => {
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Digitais',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Loja',  'QTD Produtos', 'Valor Vendido']],
      body: dados.map(item => [
        item.NOFANTASIA,
        item.QTDTOTAL,
        formatMoeda(item.VRTOTALVENDA),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_digitais.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Loja',  'QTD Produtos', 'Valor Vendido'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'QTD Produtos' },
      { wpx: 100, caption: 'Valor Vendido' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Digitais');
    XLSX.writeFile(workbook, 'vendas_digitais.xlsx');
  };


  const dados = dadosVendasMarca.map((item) => {

    return {
      NOFANTASIA: item.NOFANTASIA,
      QTDTOTAL: toFloat(item.QTDTOTAL),
      VRTOTALVENDA: toFloat(item.VRTOTALVENDA),
      
    }
  });

  const calcularTotalVendas = () => {
    return dados.reduce((acc, item) => acc + toFloat(item.VRTOTALVENDA), 0);
  }

  const calcularTotalProdutos = () => {
    return dados.reduce((acc, item) => acc + toFloat(item.QTDTOTAL), 0);
  }


  const colunasVendas = [
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th>{row.NOFANTASIA}</th>,
      footer: 'Total',
      sortable: true,
    },

    {
      field: 'QTDTOTAL',
      header: 'QTD Produtos',
      body: row => <th>{toFloat(row.QTDTOTAL)}</th>,
      footer: calcularTotalProdutos(),
      sortable: true,
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Valor Vendido',
      body: row => <th>{formatMoeda(row.VRTOTALVENDA)}</th>,
      footer: formatMoeda(calcularTotalVendas()),
      sortable: true,
    },

  ]


  return (

    <Fragment>
      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>
            Lista de Vendas  Por Marca
            
          </h2>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
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
    </Fragment>
  )
}