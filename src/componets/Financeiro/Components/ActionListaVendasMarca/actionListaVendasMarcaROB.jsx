import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionListaVendasMarcaROB = ({ dadosListaVendasMarcaROB }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Período ROB',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Grupo', 'Receita Bruta (R$)', 'Desconto (R$)', 'Voucher (R$)', 'ICMS (R$)', 'PIS (R$)', 'COFINS (R$)', 'Receita Líquida (R$)', 'Custo Produto (R$)', 'Lucro Bruto (R$)']],
      body: dadosVendasMarcaROB.map(item => [
        item.DSGRUPOEMPRESARIAL,
        formatMoeda(item.valorVendaBrutaROB),
        formatMoeda(item.valorDesconto),
        formatMoeda(item.voucher),
        formatMoeda(item.valorICMS),
        formatMoeda(item.totalPis),
        formatMoeda(item.totalCofins),
        formatMoeda(item.valorTotalReceitaLiquida),
        formatMoeda(item.TOTALCUSTO),
        formatMoeda(item.valorTotalLucroBruto),

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_periodo_rob.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendasMarcaExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Grupo', 'Receita Bruta (R$)', 'Desconto (R$)', 'Voucher (R$)', 'ICMS (R$)', 'PIS (R$)', 'COFINS (R$)', 'Receita Líquida (R$)', 'Custo Produto (R$)', 'Lucro Bruto (R$)'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Grupo', },
      { wpx: 100, caption: 'Receita Bruta (R$)' },
      { wpx: 100, caption: 'Desconto (R$)' },
      { wpx: 100, caption: 'Voucher (R$)' },
      { wpx: 150, caption: 'ICMS (R$)' },
      { wpx: 100, caption: 'PIS (R$)' },
      { wpx: 100, caption: 'COFINS (R$)' },
      { wpx: 100, caption: 'Receita Líquida (R$)' },
      { wpx: 100, caption: 'Custo Produto (R$)' },
      { wpx: 100, caption: 'Lucro Bruto (R$)' },

    ];


    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Período ROB');
    XLSX.writeFile(workbook, 'vendas_periodo_rob.xlsx');
  };


  const calcularTotalPis = (item) => {
    return (
      ((toFloat(item.valorPago) - toFloat(item.valorICMS)) * 1.65) / 100
    )
  }

  const calcularTotalCofins = (item) => {
    return (
      ((toFloat(item.valorPago) - toFloat(item.valorICMS)) * 7.60) / 100
    )
  }

  const calcularValorVendaBrutaROB = (item) => {
    return (
      (toFloat(item.valorPago) + toFloat(item.valorDesconto))
    )
  }

  const dadosVendasMarcaExcel = dadosListaVendasMarcaROB.map((item, index) => {
    const totalPis = calcularTotalPis(item);
    const totalCofins = calcularTotalCofins(item);
    const valorTotalReceitaLiquida = parseFloat(item.valorPago) - (parseFloat(item.voucher) + parseFloat(totalPis) + parseFloat(totalCofins) + parseFloat(item.valorICMS));
    const valorTotalLucroBruto = parseFloat(valorTotalReceitaLiquida) - parseFloat(item.vendaMarca.TOTALCUSTO);
    const valorVendaBrutaROB = calcularValorVendaBrutaROB(item);

    return {
      DSGRUPOEMPRESARIAL: item.vendaMarca.DSGRUPOEMPRESARIAL,
      valorVendaBrutaROB: formatMoeda(valorVendaBrutaROB),
      valorDesconto: formatMoeda(item.valorDesconto),
      voucher: formatMoeda(item.voucher.vrTotalVoucher),
      valorICMS: formatMoeda(item.valorICMS.vrTotalICMS),
      totalPis: formatMoeda(totalPis),
      totalCofins: formatMoeda(totalCofins),
      valorTotalReceitaLiquida: formatMoeda(valorTotalReceitaLiquida),
      TOTALCUSTO: formatMoeda(item.vendaMarca.TOTALCUSTO),
      valorTotalLucroBruto: formatMoeda(valorTotalLucroBruto),
    }
  })

  const dadosVendasMarcaROB = dadosListaVendasMarcaROB.map((item, index) => {
    const totalPis = calcularTotalPis(item);
    const totalCofins = calcularTotalCofins(item);
    const valorVendaBrutaROB = calcularValorVendaBrutaROB(item);
    const valorTotalReceitaLiquida = parseFloat(item.valorPago) - (parseFloat(item.voucher) + parseFloat(totalPis) + parseFloat(totalCofins) + parseFloat(item.valorICMS));
    const valorTotalLucroBruto = parseFloat(valorTotalReceitaLiquida) - parseFloat(item.vendaMarca.TOTALCUSTO);

    return {
      IDGRUPOEMPRESARIAL: item.vendaMarca.IDGRUPOEMPRESARIAL,
      DSGRUPOEMPRESARIAL: item.vendaMarca.DSGRUPOEMPRESARIAL,
      QTD: item.vendaMarca.QTD,
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,
      TOTALCUSTO: item.vendaMarca.TOTALCUSTO,

      valorPago: item.valorPago,
      voucher: item.voucher,
      valorDesconto: item.valorDesconto,
      valorICMS: item.valorICMS,

      totalPis: totalPis,
      totalCofins: totalCofins,
      valorVendaBrutaROB: valorVendaBrutaROB,
      valorTotalReceitaLiquida: valorTotalReceitaLiquida,
      valorTotalLucroBruto: valorTotalLucroBruto,

    }
  })

  const colunasVendasMarcaROB = [
    {
      field: 'DSGRUPOEMPRESARIAL',
      header: 'Grupo',
      body: (row) => <p style={{ color: 'blue', fontWeight: 600, width: '150px', margin: '0' }}> {row.DSGRUPOEMPRESARIAL} </p>,
      sortable: true,
    },
    {
      field: 'valorVendaBrutaROB',
      header: 'Receita Bruta (R$)',
      body: (row) => <th style={{ color: 'green' }}> {formatMoeda(row.valorVendaBrutaROB)} </th>,
      sortable: true,
    },
    {
      field: 'valorDesconto',
      header: 'Desconto (R$)',
      body: (row) => <th style={{ color: 'red' }}> {formatMoeda(row.valorDesconto)}</th>,
      sortable: true,
    },
    {
      field: 'voucher',
      header: 'Voucher (R$)',
      body: (row) => <th style={{ color: 'red' }}> {formatMoeda(row.voucher)}</th>,
      sortable: true,
    },
    {
      field: 'valorICMS',
      header: 'ICMS (R$)',
      body: (row) => <th style={{ color: 'red' }}>  {formatMoeda(row.valorICMS)} </th>,
      sortable: true,
    },
    {
      field: 'totalPis',
      header: 'PIS (R$)',
      body: (row) => <th style={{ color: 'red' }}> {formatMoeda(row.totalPis)}</th>,
      sortable: true,
    },
    {
      field: 'totalCofins',
      header: 'COFINS (R$)',
      body: (row) => <th style={{ color: 'red' }}>  {formatMoeda(row.totalCofins)} </th>,
      sortable: true,
    },
    {
      field: 'valorTotalReceitaLiquida',
      header: 'Receita Líquida (R$)',
      body: (row) => <th style={{ color: 'blue' }}>  {formatMoeda(row.valorTotalReceitaLiquida)} </th>,
      sortable: true,
    },
    {
      field: 'TOTALCUSTO',
      header: 'Custo Produto (R$)',
      body: (row) => <th style={{ color: 'blue' }}>  {formatMoeda(row.TOTALCUSTO)} </th>,
      sortable: true,
    },
    {
      field: 'valorTotalLucroBruto',
      header: 'Lucro Bruto (R$)',
      body: (row) => <th style={{ color: 'blue' }}> {formatMoeda(row.valorTotalLucroBruto)}</th>,
      sortable: true,
    }
  ]

  return (

    <Fragment>

      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>
            Lista de Vendas Por Período - ROB Resultado Operacional Bruto

            <span className="fw-300">
              Por Marca
            </span>
          </h2>
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

            title="Vendas por Loja"
            value={dadosVendasMarcaROB}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasMarcaROB.map(coluna => (
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