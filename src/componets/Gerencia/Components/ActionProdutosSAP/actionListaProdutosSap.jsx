import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada, dataHoraFormatada } from '../../../../utils/dataFormatada';
import { formatMoeda } from '../../../../utils/formatMoeda';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaProdutosSap = ({ dadosProdutos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef()

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Sap',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['contador', 'Cod. Barras', 'Descrição', 'Data Alteração', 'Venda PDV', 'Venda Sap']],
      body: dados.map(item => [item.contador, item.CODIGO_BARRAS, item.DESCRICAO_ITEM, dataFormatada(item.DATA_ULTIMA_ALTERACAO_PDV), formatMoeda(item.PRECO_VENDA_PDV), formatMoeda(item.PRECO_VENDA_SAP)]),
      autoPrint: true,
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_sap.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['contador', 'Cod. Barras', 'Descrição', 'Data Alteração', 'Venda PDV', 'Venda Sap'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 300, caption: 'Descrição' },
      { wpx: 200, caption: 'Data Alteração' },
      { wpx: 100, caption: 'Venda PDV' },
      { wpx: 100, caption: 'Venda Sap' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos Sap");
    XLSX.writeFile(workbook, 'produtos_sap.xlsx');
  };

  const dados = Array.isArray(dadosProdutos) ? dadosProdutos.map((item, index) => {
    let contador = index + 1;
    return {

      contador,
      CODIGO_BARRAS: item.CODIGO_BARRAS,
      DESCRICAO_ITEM: item.DESCRICAO_ITEM,
      DATA_ULTIMA_ALTERACAO_PDV: item.DATA_ULTIMA_ALTERACAO_PDV,
      PRECO_VENDA_PDV: item.PRECO_VENDA_PDV,
      PRECO_VENDA_SAP: item.PRECO_VENDA_SAP,

    }
  }) : [];

  const colunasProdutos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'CODIGO_BARRAS',
      header: 'Cód. Barras',
      body: row => <th>{parseFloat(row.CODIGO_BARRAS)}</th>,
      sortable: true,
    },
    {
      field: 'DESCRICAO_ITEM',
      header: 'Descrição',
      body: row => <th>{row.DESCRICAO_ITEM}</th>,
      sortable: true,
    },
    {
      field: 'DATA_ULTIMA_ALTERACAO_PDV',
      header: 'Data Alteração',
      body: row => <th>{dataHoraFormatada(row.DATA_ULTIMA_ALTERACAO_PDV)}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA_PDV',
      header: 'Venda PDV',
      body: row => <th>{formatMoeda(row.PRECO_VENDA_PDV)}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA_SAP',
      header: 'Venda Sap',
      body: row => <th>{formatMoeda(row.PRECO_VENDA_SAP)}</th>,
      sortable: true,
    },
  ]

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Produtos SAP</h2>
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
            title="Produtos SAP"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
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
            {colunasProdutos.map(coluna => (
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