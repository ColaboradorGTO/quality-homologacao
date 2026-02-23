import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const ActionListaRotatividade = ({ dadosRotatividade }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Vendas Digital',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº','Empresa', 'Fornecedor', 'Grupo', 'Grade', 'Cod Produto', 'Produto', 'Data', 'Inicial', 'Ent. Transf.', 'Ent Dev', 'Saída Transf.', 'Saída Venda', 'Saldo']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.PN,
        item.GRUPOPRODUTO,
        item.NOMEGRUPO,
        item.NUCODBARRAS,
        item.DSNOME,
        item.DTMOVIMENTACAO,
        item.QTDINICIAL,
        item.QTDENTRADATRANSAFERENCIA,
        item.QTDENTRADADEVOLUCAO,
        item.QTDSAIDATRANSFERENCIA,
        item.QTDSAIDAVENDA,
        item.QTDSALDO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_digital.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº','Empresa', 'Fornecedor', 'Grupo', 'Grade', 'Cod Produto', 'Produto', 'Data', 'Inicial', 'Ent. Transf.', 'Ent Dev', 'Saída Transf.', 'Saída Venda', 'Saldo'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 250, caption: 'Fornecedor' },
      { wpx: 100, caption: 'Grupo' },
      { wpx: 200, caption: 'Grade' },
      { wpx: 200, caption: 'Cod Produto' },
      { wpx: 250, caption: 'Produto' },
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'Inicial' },
      { wpx: 100, caption: 'Ent. Transf.' },
      { wpx: 100, caption: 'Ent Dev' },
      { wpx: 100, caption: 'Saída Transf.' },
      { wpx: 100, caption: 'Saída Venda' },
      { wpx: 100, caption: 'Saldo' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Vendas Digital');
    XLSX.writeFile(workbook, 'rotatividade.xlsx');
  };

  const dados = dadosRotatividade.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      PN: item.PN,
      GRUPOPRODUTO: item.GRUPOPRODUTO,
      NOMEGRUPO: item.NOMEGRUPO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      DTMOVIMENTACAO: item.DTMOVIMENTACAO,
      QTDINICIAL: item.QTDINICIAL,
      QTDENTRADATRANSAFERENCIA: item.QTDENTRADATRANSAFERENCIA,
      QTDENTRADADEVOLUCAO: item.QTDENTRADADEVOLUCAO,
      QTDSAIDATRANSFERENCIA: item.QTDSAIDATRANSFERENCIA,
      QTDSAIDAVENDA: item.QTDSAIDAVENDA,
      QTDSALDO: item.QTDSALDO,
    }
  });

  const colunasRotatividade = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ width: '220px', margin: '0px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'PN',
      header: 'Fornecedor',
      body: row => <p style={{ width: '250px', margin: '0px', fontWeight: 600 }}>{row.PN}</p>,
      sortable: true,
    },
    {
      field: 'GRUPOPRODUTO',
      header: 'Grupo',
      body: row => <th>{row.GRUPOPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NOMEGRUPO',
      header: 'Grade',
      body: row => <p style={{ width: '170px', margin: '0px', fontWeight: 600 }}>{row.NOMEGRUPO}</p>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cod Produto',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{ width: '250px', margin: '0px', fontWeight: 600 }}>{row.DSNOME}</p>,
      sortable: true,
    },
    {
      field: 'DTMOVIMENTACAO',
      header: 'Data',
      body: row => <p style={{ width: '100px', margin: '0px', fontWeight: 600 }}>{row.DTMOVIMENTACAO}</p>,
      sortable: true,
    },
    {
      field: 'QTDINICIAL',
      header: 'Inicial',
      body: row => <th>{row.QTDINICIAL}</th>,
      sortable: true,
    },
    {
      field: 'QTDENTRADATRANSAFERENCIA',
      header: 'Ent. Transf.',
      body: row => <th>{row.QTDENTRADATRANSAFERENCIA}</th>,
      sortable: true,
    },
    {
      field: 'QTDENTRADADEVOLUCAO',
      header: 'Ent. Dev',
      body: row => <th>{row.QTDENTRADADEVOLUCAO}</th>,
      sortable: true,
    },
    {
      field: 'QTDSAIDATRANSFERENCIA',
      header: 'Saída Transf.',
      body: row => <th>{row.QTDSAIDATRANSFERENCIA}</th>,
      sortable: true,
    },
    {
      field: 'QTDSAIDAVENDA',
      header: 'Saída Venda',
      body: row => <th>{row.QTDSAIDAVENDA}</th>,
      sortable: true,
    },
    {
      field: 'QTDSALDO',
      header: 'Saldo',
      body: row => <th>{row.QTDSALDO}</th>,
      sortable: true,
    },

  ]

  return (

    <Fragment>

      <div className="panel" >
        <div className="panel-hdr">
          <h2>Rotatividade por Período</h2>
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
            size="small"
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
            {colunasRotatividade.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
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
