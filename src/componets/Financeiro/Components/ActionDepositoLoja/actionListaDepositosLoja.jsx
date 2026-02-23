import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";


export const ActionListaDepositosLoja = ({ dadosListaDepositosLoja }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Depósitos por Lojas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data Mov.', 'Data Dep.', 'Conta Banco', 'Valor Depósito', 'Histórico', 'Nº Doc Depósito']],
      body: dados.map(item => [
        item.DTMOVIMENTOCAIXA,
        item.DTDEPOSITO,
        item.DSCONTABANCO,
        item.VRDEPOSITO,
        item.DSHISTORIO,
        item.NUDOCDEPOSITO,
        item.STCANCELADO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('depositos_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Data Mov.', 'Data Dep.', 'Conta Banco', 'Valor Depósito', 'Histórico', 'Nº Doc Depósito', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Data Mov.' },
      { wpx: 200, caption: 'Data Dep.' },
      { wpx: 200, caption: 'Conta Banco' },
      { wpx: 200, caption: 'Valor Depósito' },
      { wpx: 200, caption: 'Histórico' },
      { wpx: 200, caption: 'Nº Doc Depósito' },
      { wpx: 200, caption: 'Situação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Depósitos por Lojas');
    XLSX.writeFile(workbook, 'depositos_loja.xlsx');
  };

  const dados = dadosListaDepositosLoja.map((item, index) => {

    return {
      DTMOVIMENTOCAIXA: item.DTMOVIMENTOCAIXA,
      DTDEPOSITO: item.DTDEPOSITO,
      DSCONTABANCO: item.DSCONTABANCO,
      VRDEPOSITO: item.VRDEPOSITO,
      DSHISTORIO: item.DSHISTORIO,
      NUDOCDEPOSITO: item.NUDOCDEPOSITO,

      STCANCELADO: item.STCANCELADO,
      STCONFERIDO: item.STCONFERIDO,
    }
  })


  const calcularTotalDeposito = () => {
    return dadosListaDepositosLoja
      .filter(deposito => deposito.STCANCELADO === 'False')
      .reduce((total, deposito) =>
        total + parseFloat(deposito.VRDEPOSITO || 0), 0
      );
  };

  const colunasDepositosLoja = [
    {
      field: 'DTMOVIMENTOCAIXA',
      header: 'Data Movimento',
      body: row => <th style={{ color: 'blue' }}>{row.DTMOVIMENTOCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'DTDEPOSITO',
      header: 'Data Depósito',
      body: row => <th style={{ color: 'blue' }}>{row.DTDEPOSITO}</th>,
      sortable: true,
    },
    {
      field: 'DSCONTABANCO',
      header: 'Conta Banco',
      body: row => <th style={{ color: 'blue' }}>{row.DSCONTABANCO}</th>,
      footer: <p>Total de Depósitos</p>,
      sortable: true,
    },
    {
      field: 'VRDEPOSITO',
      header: 'Valor Depósito',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRDEPOSITO)}</th>,
      footer: <p>{formatMoeda(calcularTotalDeposito())}</p>,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => <th style={{ color: 'blue' }}>{row.DSHISTORIO}</th>,
      sortable: true,
    },
    {
      field: 'NUDOCDEPOSITO',
      header: 'Nº Doc Depósito',
      body: row => <th style={{ color: 'blue' }}>{row.NUDOCDEPOSITO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => {
        if (row.STCONFERIDO == 'False' || row.STCONFERIDO == null || row.STCONFERIDO == '') {
          if (row.STCANCELADO == 'False') {
            return <th style={{ color: 'blue' }}>Ativo</th>
          } else {
            return <th style={{ color: 'red' }}>Cancelado</th>
          }
        } else {
          return <th style={{ color: 'green' }}>Conferido</th>
        }
      },
      sortable: true,
    }
  ]

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total de Depósitos" colSpan={3} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalDeposito())} colSpan={3} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />

        <Column footer={""} colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
      </Row>
    </ColumnGroup>
  )

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Depósitos por Loja</h2>
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
            title="Depósitos apor Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            footerColumnGroup={footerGroup}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasDepositosLoja.map(coluna => (
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