import { Fragment, useState, useRef, } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const ActionListaProdutosQuality = ({ dadosProdutosQuality }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size, setSize] = useState('small');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Quality',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'NUCODBARRAS', 'DSNOME', 'DTULTALTERACAO', 'PRECO_VENDA']],
      body: dados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSNOME,
        item.DTULTALTERACAO,
        item.PRECO_VENDA
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produto_quality.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'NUCODBARRAS', 'DSNOME', 'DTULTALTERACAO', 'PRECO_VENDA'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'NUCODBARRAS' },
      { wpx: 200, caption: 'DSNOME' },
      { wpx: 100, caption: 'DTULTALTERACAO' },
      { wpx: 100, caption: 'PRECO_VENDA' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Quality');
    XLSX.writeFile(workbook, 'produto_quality.xlsx');
  };

  const dados = dadosProdutosQuality.map((item, index) => {
    let contador = index + 1;
    return {

      contador,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      DTULTALTERACAO: item.DTULTALTERACAO,
      PRECO_VENDA: item.PRECO_VENDA,

    }
  });

  const colunasQuality = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{parseFloat(row.NUCODBARRAS)}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'DTULTALTERACAO',
      header: 'Data Alteração',
      body: row => <th>{row.DTULTALTERACAO}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Venda PDV',
      body: row => <th>{formatMoeda(row.PRECO_VENDA)}</th>,
      sortable: true,
    },
  ]

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Produtos Quality</h2>
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
            title="Lista de Produtos Quality"
            value={dados}
            size={size}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            globalFilterValue={globalFilterValue}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasQuality.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}

              />
            ))}

          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}