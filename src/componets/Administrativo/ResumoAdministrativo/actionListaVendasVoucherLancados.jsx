import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import { toFloat } from "../../../utils/toFloat";

export const ActionListaVendasVoucherLancado = ({ dadosDetalheVoucher }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vouchers Lançados',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Voucher', 'Data', 'Valor', 'Loja Recebido', 'Caixa Recebido', 'Data Recebido', 'Situação']],
      body: dadosVoucherDetalhe.map(item => [
        item.contador,
        item.DSCAIXAORIGEM ? 'CAIXA WEB' : 'CAIXA WEB',
        item.NUVOUCHER,
        item.DTINVOUCHER,
        item.VRVOUCHER,
        item.NOFANTASIA,
        item.DSCAIXADESTINO ? 'CAIXA WEB' : 'CAIXA WEB',
        item.DTOUTVOUCHER,
        item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vouchers_lancados.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVoucherDetalhe.map(item => ({
      'Nº': item.contador,
      'Caixa': item.DSCAIXAORIGEM ? 'CAIXA WEB' : 'CAIXA WEB',
      'Nº Voucher': item.NUVOUCHER,
      'Data': item.DTINVOUCHER,
      'Valor': formatMoeda(item.VRVOUCHER),
      'Pago a': item.NOFANTASIA,
      'Historíco': item.DSCAIXADESTINO ? 'CAIXA WEB' : 'CAIXA WEB',
      'Nota Fiscal': item.DTOUTVOUCHER,
      'Situação': item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Voucher', 'Data', 'Valor', 'Loja Recebido', 'Caixa Recebido', 'Data Recebido', 'Situação']
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Voucher' },
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 200, caption: 'Loja Recebido' },
      { wpx: 100, caption: 'Caixa Recebido' },
      { wpx: 100, caption: 'Data Recebido' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vouchers Lançados');
    XLSX.writeFile(workbook, 'vouchers_lancados.xlsx');
  };

  const dadosVoucherDetalhe = dadosDetalheVoucher.map((item, index) => {
    let contador = index + 1;
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      IDVOUCHER: item.IDVOUCHER,
      DTINVOUCHER: item.DTINVOUCHER,
      DTOUTVOUCHER: item.DTOUTVOUCHER,
      DSCAIXAORIGEM: item.DSCAIXAORIGEM ? 'CAIXA WEB' : 'CAIXA WEB',
      DSCAIXADESTINO: item.DSCAIXADESTINO ? 'CAIXA WEB' : 'CAIXA WEB',
      NUVOUCHER: item.NUVOUCHER,
      VRVOUCHER: item.VRVOUCHER,
      NOFANTASIA: item.NOFANTASIA,

      STATIVO: item.STATIVO,
      STCANCELADO: item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
      contador,
      vrTotalFaturaLoja
    };
  });
  const colunaVoucherLancado = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXAORIGEM',
      header: 'Caixa ',
      body: row => <th style={{ color: 'blue' }}>{row.DSCAIXAORIGEM}</th>,
      sortable: true,
    },
    {
      field: 'NUVOUCHER',
      header: 'Nº Voucher ',
      body: row => <th style={{ color: 'blue' }}>{row.NUVOUCHER}</th>,
      sortable: true,
    },
    {
      field: 'DTINVOUCHER',
      header: 'Data',
      body: row => <th style={{ color: 'blue' }}>{row.DTINVOUCHER}</th>,
      sortable: true,
    },
    {
      field: 'VRVOUCHER',
      header: 'Valor',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja Recebido',
      body: row => <th style={{ color: 'blue' }}>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXADESTINO',
      header: 'Caixa Recebido',
      body: row => <th style={{ color: 'blue' }}>{row.DSCAIXADESTINO}</th>,
      sortable: true,
    },
    {
      field: 'DTOUTVOUCHER',
      header: 'Data Recebido',
      body: row => <th style={{ color: 'blue' }}>{row.DTOUTVOUCHER}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCANCELADO == 'Ativo' ? 'blue' : 'red' }}>
          {row.STCANCELADO}

        </th>
      ),
      sortable: true,
    },

  ]
  const calcularTotal = (field) => {
    return dadosVoucherDetalhe.reduce((total, item) => total + toFloat(item[field]), 0);
  };
  const calcularVrVoucher = () => {
    const total = calcularTotal('VRVOUCHER');
    return total;
  }

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Lançamentos " colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularVrVoucher())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={""} colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
      </Row>
    </ColumnGroup>
  )


  return (
    <Fragment>
      <div className="panel" >

        <header className="panel-hdr" >
          <h2 >
            Lista de Voucher Lançados
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
            title="Voucher Lançados"
            globalFilter={globalFilterValue}
            value={dadosVoucherDetalhe}
            size="small"
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosVoucherDetalhe.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaVoucherLancado.map(coluna => (
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