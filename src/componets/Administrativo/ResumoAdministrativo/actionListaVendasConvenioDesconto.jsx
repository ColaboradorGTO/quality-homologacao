import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../utils/formatMoeda";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";

export const ActionListaVendasConvenioDesconto = ({ dadosVendasConvenioDesconto }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Desconto em Folha',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'Valor Bruto', 'Desconto', 'Valor Líquido', 'Situação']],
      body: dadosConvenioVendasDesconto.map(item => [
        item.contador,
        item.IDCAIXAWEB,
        item.IDVENDA,
        item.NFE_INFNFE_IDE_NNF,
        item.DTHORAFECHAMENTO,
        item.NOFUNCIONARIO,
        item.NOCONVENIADO,
        item.CPFCONVENIADO,
        formatMoeda(item.VRBRUTOPAGO),
        formatMoeda(item.VRDESPAGO),
        formatMoeda(item.VRLIQPAGO),
        item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('desconto_em_folha.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosConvenioVendasDesconto.map(item => ({
      'Nº': item.contador,
      'Caixa': item.DSCAIXAORIGEM ? 'CAIXA WEB' : 'CAIXA WEB',
      'Nº Venda': item.IDVENDA,
      'NFCe': item.NFE_INFNFE_IDE_NNF,
      'Abertura': item.DTHORAFECHAMENTO,
      'Operador': item.NOFUNCIONARIO,
      'Conveniado': item.NOCONVENIADO,
      'Valor Bruto': formatMoeda(item.VRBRUTOPAGO),
      'Desconto': formatMoeda(item.VRDESPAGO),
      'Valor Líquido': formatMoeda(item.VRLIQPAGO),
      'Situação': item.STCANCELADO
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'Valor Bruto', 'Desconto', 'Valor Líquido', 'Situação']
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'NFCe' },
      { wpx: 100, caption: 'Abertura' },
      { wpx: 250, caption: 'Operador' },
      { wpx: 250, caption: 'Conveniado' },
      { wpx: 100, caption: 'Valor Bruto' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Valor Líquido' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Desconto em Folha');
    XLSX.writeFile(workbook, 'desconto_em_folha.xlsx');
  };

  const dadosConvenioVendasDesconto = dadosVendasConvenioDesconto.map((item, index) => {
    let contador = index + 1;
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      IDCAIXAWEB: item.IDCAIXAWEB + ' - ' + item.DSCAIXA,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,

      VRBRUTOPAGO: item.VRBRUTOPAGO,
      VRDESPAGO: item.VRDESPAGO,
      VRLIQPAGO: item.VRLIQPAGO,
      STCANCELADO: item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
      contador,
      vrTotalFaturaLoja
    };
  });

  const calcularTotalVrBruto = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDesconto) {
      total += parseFloat(dados.VRBRUTOPAGO);
    }
    return total;
  }

  const calcularTotalVrDesconto = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDesconto) {
      total += parseFloat(dados.VRDESPAGO);
    }
    return total;
  }

  const calcularTotalVrLiq = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDesconto) {
      total += parseFloat(dados.VRLIQPAGO);
    }
    return total;
  }

  const colunaVendasConvenioDesconto = [
    {
      header: 'Nº',
      body: row => <th> {row.contador}</th>,
      sortable: true,
      width: "5%"
    },
    {
      header: 'Caixa ',
      body: row => <th> {row.IDCAIXAWEB}</th>,
      sortable: true,
    },
    {
      header: 'Nº Venda ',
      body: row => <th> {row.IDVENDA}</th>,
      sortable: true,
    },
    {
      header: 'NFCe ',
      body: row => <th> {row.NFE_INFNFE_IDE_NNF}</th>,
      sortable: true,
    },
    {
      header: 'Abertura',
      body: row => <th> {row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      header: 'Operador',
      body: row => <th> {row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      header: 'Conveniado',
      body: row => <th> {row.NOCONVENIADO}</th>,
      sortable: true,
    },
    {
      header: 'Convênio',
      body: row => <th> {row.CPFCONVENIADO}</th>,
      sortable: true,
    },
    {
      header: 'Valor Bruto',
      body: row => <th> {formatMoeda(row.VRBRUTOPAGO)}</th>,
      sortable: true,
    },
    {
      header: 'Desconto',
      body: row => <th> {formatMoeda(row.VRDESPAGO)}</th>,
      sortable: true,
    },
    {
      header: 'Valor Liq',
      body: row => <th> {formatMoeda(row.VRLIQPAGO)}</th>,
      sortable: true,
    },
    {
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCANCELADO == 'Ativo' ? 'blue' : 'red' }}>
          {row.STCANCELADO}

        </th>
      ),
      sortable: true,
    },

  ]



  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total Vendas Convenio " colSpan={8} footerStyle={{ textAlign: 'center', color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrBruto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrLiq())} colSpan={2} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
      </Row>


    </ColumnGroup>
  )

  return (
    <Fragment>
      <div className="panel" >

        <header className="panel-hdr" >
          <h2>
            Lista de Vendas Convênio Desconto em Folha
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
            title="Desconto em Folha"
            value={dadosConvenioVendasDesconto}
            globalFilter={globalFilterValue}
            size="small"
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosConvenioVendasDesconto.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaVendasConvenioDesconto.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                // footer={coluna.footer}
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