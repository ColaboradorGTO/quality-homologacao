import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { dataFormatada } from "../../../../utils/dataFormatada";

export const ActionListaExtratoMovimentoBonificacao = ({
  dadosExtratoBonificacao,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Mov Bonificação',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['DT Lançamento', 'Funcionario', 'Tipo Movimento', 'Cod. Venda', 'Valor Anterior (R$)', 'Valor Mov (R$)', 'Saldo(R$)', 'Observação']],
      body: dados.map(item => [
        dataFormatada(item.DTMOVIMENTO),
        item.IDFUNCIONARIO,
        item.TIPOMOVIMENTO,
        item.IDVENDA,
        formatMoeda(item.VRANTERIOR),
        formatMoeda(item.VRMOVIMENTO),
        formatMoeda(item.VRATUAL),
        item.OBSERVACAO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('movimento_bonificacao.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['DT Lançamento', 'Funcionario', 'Tipo Movimento', 'Cod. Venda', 'Valor Anterior (R$)', 'Valor Mov (R$)', 'Saldo(R$)', 'Observação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'DT Lançamento' },
      { wpx: 100, caption: 'Funcionario' },
      { wpx: 100, caption: 'Tipo Movimento' },
      { wpx: 100, caption: 'Cod. Venda' },
      { wpx: 100, caption: 'Valor Anterior (R$)' },
      { wpx: 100, caption: 'Valor Mov (R$)' },
      { wpx: 100, caption: 'Saldo(R$)' },
      { wpx: 100, caption: 'Observação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Mov Bonificação');
    XLSX.writeFile(workbook, 'movimento_bonificacao.xlsx');
  };

  const dados = dadosExtratoBonificacao.map((item) => {

    return {
      DTMOVIMENTO: item.DTMOVIMENTO,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      TIPOMOVIMENTO: item.TIPOMOVIMENTO,
      IDVENDA: item.IDVENDA,
      VRANTERIOR: item.VRANTERIOR,
      VRMOVIMENTO: item.VRMOVIMENTO,
      VRATUAL: toFloat(item.VRATUAL),
      OBSERVACAO: item.OBSERVACAO,

    }
  })

  const colunasExtratoBonificacao = [
    {
      field: 'DTMOVIMENTO',
      header: 'Dt Lançamento',
      body: row => <th>{row.DTMOVIMENTO}</th>,
      sortable: true,
    },
    {
      field: 'IDFUNCIONARIO',
      header: 'Funcionário',
      body: row => <th>{row.IDFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'TIPOMOVIMENTO',
      header: 'Tipo Movimento',
      body: row => <th>{row.TIPOMOVIMENTO}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Cod. Venda',
      body: row => <th>{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'VRANTERIOR',
      header: 'Valor Anterior(R$)',
      body: row => <th>{formatMoeda(row.VRANTERIOR)}</th>,
      sortable: true,
    },
    {
      field: 'VRMOVIMENTO',
      header: 'Valor Movimento(R$)',
      body: row => <th>{formatMoeda(row.VRMOVIMENTO)}</th>,
      sortable: true,
    },
    {
      field: 'VRATUAL',
      header: 'Saldo(R$)',
      body: row => <th>{formatMoeda(row.VRATUAL)}</th>,
      sortable: true,
    },
    {
      field: 'OBSERVACAO',
      header: 'Observação',
      body: row => <th>{row.OBSERVACAO}</th>,
      sortable: true,
    },
  ]


  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <table id="" class="table table-bordered  table-responsive-lg table-striped " width="100%">
            <tbody >
              <tr class="table-primary">
                <td colspan="3" style={{ textAlign: "right", fontSize: "12px" }}><b>Saldo Atual</b></td>
                <td></td>
                <td></td>
                <td></td>
                <td style={{ textAlign: "right", fontSize: "12px" }}><b> {formatMoeda(toFloat(dados[0]?.VRATUAL)) ? formatMoeda(toFloat(dados[0]?.VRATUAL)) : '0, 00'}</b></td>
                <td colspan="2"></td>
              </tr>
              <tr>
                <td colspan="9"></td>
              </tr>
              <tr>
                <td colspan="9"></td>
              </tr>
            </tbody>

          </table>
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
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortField="VRTOTALPAGO"
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
            {colunasExtratoBonificacao.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
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
