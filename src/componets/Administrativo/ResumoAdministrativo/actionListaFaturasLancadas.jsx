import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toFloat } from "../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";

export const ActionListaFaturasLancada = ({ dadosDetalheFaturaLancadas }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Faturas Canceladas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Data Recebimento', 'Nº Movimento', 'Caixa', 'Cod. Autorização', 'Valor', 'Recebedor', 'Situação']],
      body: dadosFaturaDetalhe.map(item => [
        item.contador,
        item.DTPROCESSAMENTO,
        item.IDMOVIMENTOCAIXAWEB,
        item.DSCAIXA,
        item.NUCODAUTORIZACAO,
        formatMoeda(item.VRRECEBIDO),
        item.NOFUNCIONARIO,
        item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('faturas_canceladas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosFaturaDetalhe.map(item => ({
      'Nº': item.contador,
      'Data Recebimento': item.DTPROCESSAMENTO,
      'Nº Movimento': item.IDMOVIMENTOCAIXAWEB,
      'Caixa': item.DSCAIXA,
      'Cod. Autorização': item.NUCODAUTORIZACAO,
      'Valor': formatMoeda(item.VRRECEBIDO),
      'Recebedor': item.NOFUNCIONARIO,
      'Situação': item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data Recebimento', 'Nº Movimento', 'Caixa', 'Cod. Autorização', 'Valor', 'Recebedor', 'Situação']
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Data Recebimento' },
      { wpx: 100, caption: 'Nº Movimento' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Cod. Autorização' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 250, caption: 'Recebedor' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas Canceladas');
    XLSX.writeFile(workbook, 'faturas_canceladas.xlsx');
  };

  const dadosFaturaDetalhe = dadosDetalheFaturaLancadas.map((item, index) => {
    let contador = index + 1;
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      contador,
      DTPROCESSAMENTO: item.DTPROCESSAMENTO,
      IDMOVIMENTOCAIXAWEB: parseFloat(item.IDMOVIMENTOCAIXAWEB),
      DSCAIXA: item.DSCAIXA + ' - ' + item.IDCAIXAWEB,
      NUCODAUTORIZACAO: toFloat(item.NUCODAUTORIZACAO),
      VRRECEBIDO: toFloat(item.VRRECEBIDO),
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      STCANCELADO: item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
      TOTALVENDAPROD: toFloat(item.TOTALVENDAPROD),
      IDDETALHEFATURA: item.IDDETALHEFATURA,
      vrTotalFaturaLoja
    };
  });

  const calcularTotalValorRecebido = () => {
    let total = 0;
    for (let resultado of dadosFaturaDetalhe) {
      total += parseFloat(resultado.VRRECEBIDO);
    }
    return total;
  }
  const colunaFaturaLoja = [
    {
      field: 'contador',
      header: '*',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
      width: "5%"
    },
    {
      field: 'DTPROCESSAMENTO',
      header: 'Data Recebimento',
      body: row => <th style={{ color: 'blue' }}>{row.DTPROCESSAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXAWEB',
      header: 'Nº Movimento',
      body: row => <th style={{ color: 'blue' }}>{row.IDMOVIMENTOCAIXAWEB}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXA',
      header: 'Caixa',
      body: row => <th style={{ color: 'blue' }}>{row.IDCAIXAWEB + row.DSCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'NUCODAUTORIZACAO',
      header: 'Cod. Autorização',
      body: row => <th style={{ color: 'blue' }}>{row.NUCODAUTORIZACAO}</th>,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRRECEBIDO',
      header: 'Valor',
      body: row => <th style={{ color: 'green' }}>{formatMoeda(row.VRRECEBIDO)}</th>,
      footer: formatMoeda(calcularTotalValorRecebido()),
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Recebedor',
      body: row => <th style={{ color: 'blue' }}>{row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCANCELADO == 'False' ? 'blue' : 'red' }}>
          {row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}

        </th>
      ),
      sortable: true,
    },

  ]


  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Lançamentos " colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalValorRecebido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={""} colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>
      <div className="panel" >

        <header className="panel-hdr" >
          <h2 >
            Lista de Faturas Lançadas
          </h2>
        </header>

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
            value={dadosFaturaDetalhe}
            globalFilter={globalFilterValue}
            size="small"
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosFaturaDetalhe.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaFaturaLoja.map(coluna => (
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