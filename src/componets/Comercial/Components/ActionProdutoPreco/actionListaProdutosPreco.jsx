import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaProductoPreco = ({ dadosProdutos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Preços',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['N°', 'Cód Barras', 'Descrição', 'Preço Antigo', 'Preço Novo']],
      body: dados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSNOME,
        item.PRECOANTIGO,
        item.PRECOVENDA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_precos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['N°', 'Cód Barras', 'Descrição', 'Preço Antigo', 'Preço Novo'];
    worksheet['!cols'] = [
      { wpx: 700, caption: 'Nº' },
      { wpx: 100, caption: 'Cód Barras' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Preço Antigo' },
      { wpx: 100, caption: 'Preço Novo' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Preços');
    XLSX.writeFile(workbook, 'produtos_precos.xlsx');
  };

  const dados = dadosProdutos.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PRECOANTIGO: toFloat(item.PRECOANTIGO),
      PRECOVENDA: toFloat(item.PRECOVENDA),
    }
  });

  const colunasProdutos = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'PRECOANTIGO',
      header: 'Preço Antigo',
      body: row => <th>{formatMoeda(row.PRECOANTIGO)}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'Preço Novo',
      body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true,
    },
  ]

  return (

    <Fragment>

      <div className="panel" >
        <div className="panel-hdr">
          <h2>Produtos Preços</h2>
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
            title="Produtos Preços"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 30, 40, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}


          >
            {colunasProdutos.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}

