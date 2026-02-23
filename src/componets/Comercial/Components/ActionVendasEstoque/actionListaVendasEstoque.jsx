import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const ActionListaVendasEstoque = ({ dadosEstoqueAtual }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Estoque',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['N°', 'Grade', 'Produto', 'Referência', 'QTD Venda', 'Estoque/Venda', 'Pç Compra', 'Pç Venda', 'MarkUp']],
      body: dados.map(item => [
        item.contador,
        item.NOMEGRUPO,
        item.DSNOME,
        item.NUCODBARRAS,
        item.QTDSAIDAVENDA,
        item.QTDSALDO,
        formatMoeda(item.PRECOCUSTO),
        formatMoeda(item.PRECO_VENDA),
        item.MarkUp,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_estoque.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['N°', 'Grade', 'Produto', 'Referência', 'QTD Venda', 'Estoque/Venda', 'Pç Compra', 'Pç Venda', 'MarkUp'];
    worksheet['!cols'] = [
      { wpx: 700, caption: 'Nº' },
      { wpx: 100, caption: 'Grade' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 100, caption: 'Referência' },
      { wpx: 100, caption: 'QTD Venda' },
      { wpx: 100, caption: 'Estoque/Venda' },
      { wpx: 100, caption: 'Pç Compra' },
      { wpx: 100, caption: 'Pç Venda' },
      { wpx: 100, caption: 'MarkUp' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Estoque');
    XLSX.writeFile(workbook, 'vendas_estoque.xlsx');
  };

  const dados = dadosEstoqueAtual.map((item, index) => {
    let contador = index + 1;
    let MarkUp = 0;
    return {
      contador,
      NOMEGRUPO: item.NOMEGRUPO,
      DSNOME: item.DSNOME,
      NUCODBARRAS: item.NUCODBARRAS,
      QTDSAIDAVENDA: item.QTDSAIDAVENDA,
      QTDSALDO: item.QTDSALDO,
      PRECOCUSTO: item.PRECOCUSTO,
      PRECO_VENDA: item.PRECO_VENDA,
      MarkUp, 
    }
  })

  const colunasEstoque = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th >{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOMEGRUPO',
      header: 'Grade',
      body: row => <th >{row.NOMEGRUPO}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th >{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Referência',
      body: row => <th >{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'QTDSAIDAVENDA',
      header: 'QTD Venda',
      body: row => <th >{row.QTDSAIDAVENDA}</th>,
      sortable: true,
    },
    {
      field: 'QTDSALDO',
      header: 'Estoqeu/Venda',
      body: row => <th >{row.QTDSALDO}</th>,
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'Pç Compra',
      body: row => <th >{formatMoeda(row.PRECOCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Pç Venda',
      body: row => <th >{formatMoeda(row.PRECO_VENDA)}</th>,
      sortable: true,
    },
    {
      field: 'MarkUp',
      header: 'MarkUp',
      body: row => <th >{row.MarkUp}</th>,
      sortable: true,
    }

  ]

  return (

    <Fragment>

      <div className="panel" >
        <div className="panel-hdr">
          <h2>Vendas Estoque</h2>
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
            title="Vendas Estoque"
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
            {colunasEstoque.map(coluna => (
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
    </Fragment >
  )
}

