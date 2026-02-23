import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat} from '../../../../utils/toFloat';

export const ActionListaProductoPreco = ({ dadosProdutos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

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
      head: [['Nº', 'Cód Barras', 'Descrição', 'ICMS_DF(%)', 'ICMS_GO(%)', 'Data Alteração', 'Venda PDV']],
      body: dados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSNOME,
        item.PERC_ICMS_DF,
        item.PERC_ICMS_GO,
        item.DTULTALTERACAO,
        formatMoeda(item.PRECOVENDA),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_precos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Cód Barras', 'Descrição', 'ICMS_DF(%)', 'ICMS_GO(%)', 'Data Alteração', 'Venda PDV'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Cód Barras' },
      { wpx: 300, caption: 'Descrição' },
      { wpx: 100, caption: 'ICMS_DF(%)' },
      { wpx: 100, caption: 'ICMS_GO(%)' },
      { wpx: 200, caption: 'Data Alteração' },
      { wpx: 100, caption: 'Venda PDV' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Preços');
    XLSX.writeFile(workbook, 'produtos_precos.xlsx');
  };

  const dados = dadosProdutos?.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PERC_ICMS_DF: item.PERC_ICMS_DF,
      PERC_ICMS_GO: item.PERC_ICMS_GO,
      DTULTALTERACAO: item.DTULTALTERACAO,
      PRECOVENDA: formatMoeda(item.PRECOVENDA),
    }
  });

  const colunasProdutos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th> {row.contador} </th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th> {row.NUCODBARRAS} </th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th> {row.DSNOME} </th>,
      sortable: true,
    },
    {
      field: 'PERC_ICMS_DF',
      header: 'ICMS_DF(%)',
      body: row => <th>{row.PERC_ICMS_DF}</th>,
      sortable: true,
    },
    {
      field: 'PERC_ICMS_GO',
      header: 'ICMS_GO(%)',
      body: row => <th>{row.PERC_ICMS_GO}</th>,
      sortable: true,
    },
    {
      field: 'DTULTALTERACAO',
      header: 'Data Alteração',
      body: row => <th>{row.DTULTALTERACAO}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'Venda PDV',
      body: row => <th>{row.PRECOVENDA}</th>,
      sortable: true,
    },
  ]

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">

          <h3>Lista de Produtos - Preços</h3>
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
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
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
            {colunasProdutos.map(coluna => (

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

    </Fragment>
  )
}