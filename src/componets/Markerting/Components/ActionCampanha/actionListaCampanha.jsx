import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaCampanha = ({ dadosListaCampanha }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Campanhas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Descrição', 'Data Início', 'Data Fim', 'Loja', 'Desconto (%)']],
      body: dados.map(item => [
        item.contador,
        item.DSCAMPANHA,
        item.DTINICIO,
        item.DTFINAL,
        item.NOFANTASIA,
        formatarPorcentagem(toFloat(item.VRPERCDESCONTO)),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_campanha.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Descrição', 'Data Início', 'Data Fim', 'Loja', 'Desconto (%)'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Data Início' },
      { wpx: 100, caption: 'Data Fim' },
      { wpx: 250, caption: 'Loja' },
      { wpx: 100, caption: 'Desconto (%)' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Campanha');
    XLSX.writeFile(workbook, 'lista_campanha.xlsx');
  };


  const dados = dadosListaCampanha.map((item, index) => {
    let contador = index + 1
    
    return {
      contador,
      DSCAMPANHA: item.DSCAMPANHA,
      DTINICIO: item.DTINICIO,
      DTFINAL: item.DTFINAL,
      NOFANTASIA: item.NOFANTASIA,
      VRPERCDESCONTO: item.VRPERCDESCONTO,

    }
  });

  const colunasListaCamapanha = [
    {
      field: 'contador',
      header: 'ID',
      body: row => <th style={{ color: 'blue' }}> {row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSCAMPANHA',
      header: 'Descrição',
      body: row => <th style={{ color: 'blue' }}> {row.DSCAMPANHA}</th>,
      sortable: true,
    },
    {
      field: 'DTINICIO',
      header: 'Data Início',
      body: row => <th style={{ color: 'blue' }}> {row.DTINICIO}</th>,
      sortable: true,
    },
    {
      field: 'DTFINAL',
      header: 'Data Fim',
      body: row => <th style={{ color: 'blue' }}> {row.DTFINAL}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th style={{ color: 'blue' }}> {row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'VRPERCDESCONTO',
      header: 'Desconto (%)',
      body: row => <th style={{ color: 'blue' }}> {formatarPorcentagem(toFloat(row.VRPERCDESCONTO))} </th>,
      sortable: true,
    },


  ]



  return (

    <Fragment>

      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>
            Lista de Campanhas Loja

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
            title="Lista de Campanhas"
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
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasListaCamapanha.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment >
  )
}