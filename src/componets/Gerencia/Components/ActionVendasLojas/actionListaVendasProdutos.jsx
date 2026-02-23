import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasProdutos = ({ dadosVendasLojaProdutos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Produtos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto', 'Cód. Barras', 'Grupo', 'Sub Grupo', 'Marca', 'Qtd']],
      body: dadosExcel.map(item => [
        item.DSNOME,
        item.NUCODBARRAS,
        item.GRUPO,
        item.SUBGRUPO,
        item.MARCA,
        item.QTD,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas-por-produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Cód. Barras', 'Grupo', 'Sub Grupo', 'Marca', 'Qtd'];
    worksheet['!cols'] = [
      { wpx: 300, caption: 'Produto' },
      { wpx: 150, caption: 'Cód. Barras' },
      { wpx: 150, caption: 'Grupo' },
      { wpx: 150, caption: 'Sub Grupo' },
      { wpx: 150, caption: 'Marca' },
      { wpx: 150, caption: 'Qtd' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Produtos');
    XLSX.writeFile(workbook, 'vendas-por-produtos.xlsx');
  };

  const dadosExcel = dadosVendasLojaProdutos.map((item) => {

    return {
      DSNOME: item.vendaMarca?.DSNOME,
      NUCODBARRAS: item.vendaMarca?.NUCODBARRAS,
      GRUPO: item.vendaMarca?.GRUPO,
      SUBGRUPO: item.vendaMarca?.SUBGRUPO,
      MARCA: item.vendaMarca?.MARCA,
      QTD: item.vendaMarca?.QTD,
    }
  });
  const dados = dadosVendasLojaProdutos.map((item) => {

    return {
      NUCODBARRAS: item.vendaMarca?.NUCODBARRAS,
      GRUPO: item.vendaMarca?.GRUPO,
      SUBGRUPO: item.vendaMarca?.SUBGRUPO,
      MARCA: item.vendaMarca?.MARCA,
      QTD: item.vendaMarca?.QTD,
      IDVENDA: item.vendaMarca?.IDVENDA,
      DSNOME: item.vendaMarca?.DSNOME,
      TOTAL: item.vendaMarca?.TOTAL,

    }
  });


  const colunasVendasProdutos = [
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true

    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'GRUPO',
      header: 'Grupo',
      body: row => <th>{row.GRUPO}</th>,
      sortable: true
    },
    {
      field: 'SUBGRUPO',
      header: 'Sub Grupo',
      body: row => <th>{row.SUBGRUPO}</th>,
      sortable: true
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => <th>{row.MARCA}</th>,
      sortable: true
    },
    {
      field: 'QTD',
      header: 'Qtd',
      body: row => <th>{row.QTD}</th>,
      sortable: true
    }
  ]

  const HeaderTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2" style={{ alignContent: 'center' }}>
        <span className="font-bold">
          {`${rowData.IDVENDA} -> Total Produtos Vendidos -> ${rowData.TOTAL}`}
        </span>
      </div>
    );
  };

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas Por Produto</h2>
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
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginator={true}
            rows={10}
            sortOrder={-1}
            rowsPerPageOptions={[25, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            rowGroupMode="subheader"
            groupRowsBy="IDVENDA"
            sortMode="single"
            scrollable
            rowGroupHeaderTemplate={HeaderTemplate}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasProdutos.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', }}
                bodyStyle={{ backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>


    </Fragment >
  )
}
