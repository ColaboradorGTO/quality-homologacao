import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const ActionListaVendasMarca = ({ dadosVendasMarca }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Vendas Marca',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'QTD Total Produto', 'Venda Bruta', 'Desconto', 'Venda Bruta ( - Desc)', 'Voucher', 'Venda Líquida']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        toFloat(item.QTD),
        formatMoeda(item.valorProduto),
        formatMoeda(item.valorDesconto),
        formatMoeda(item.VRTOTALLIQUIDO),
        formatMoeda(item.voucher),
        formatMoeda(item.valorLiquido),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_marca.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'QTD Total Produto', 'Venda Bruta', 'Desconto', 'Venda Bruta ( - Desc)', 'Voucher', 'Venda Líquida'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'QTD Total Produto' },
      { wpx: 100, caption: 'Venda Bruta' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Venda Bruta ( - Desc)' },
      { wpx: 100, caption: 'Voucher' },
      { wpx: 100, caption: 'Venda Líquida' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Vendas Marca');
    XLSX.writeFile(workbook, 'vendas_marca.xlsx');
  };


  const calcularTotalQtdProduto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.QTD);
    }
    return total;
  }

  const calcularTotalValorBruto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.valorProduto);
    }
    return total;
  }

  const calcularTotalValorDesconto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.valorDesconto);
    }
    return total;
  }

  const calcularTotalVendaBrutaDesconto = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.VRTOTALLIQUIDO);
    }
    return total;
  }

  const calcularTotalVoucher = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.voucher);
    }
    return total;
  }

  const calcularTotalValorLiquido = () => {
    let total = 0;
    for (let venda of dados) {
      total += toFloat(venda.valorLiquido);
    }
    return total;
  }

  const dados = dadosVendasMarca.map((item, index) => {
    let contador = index + 1;
    const valorProduto = toFloat(item.vendaMarca.VRTOTALLIQUIDO) + toFloat(item.valorDesconto);
    const valorLiquido = toFloat(item.valorPago) - toFloat(item.voucher);
    return {
      contador,
      NOFANTASIA: item.vendaMarca.NOFANTASIA,
      QTD: toFloat(item.vendaMarca.QTD),
      valorProduto: valorProduto,
      valorDesconto: toFloat(item.valorDesconto),
      VRTOTALLIQUIDO: toFloat(item.vendaMarca.VRTOTALLIQUIDO),
      voucher: toFloat(item.voucher),
      valorLiquido: valorLiquido,

      valorPago: item.valorPago,
    };
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
      footer: 'Total',
    },
    {
      field: 'QTD',
      header: 'QTD Total Produto',
      body: row => <th>{row.QTD}</th>,
      sortable: true,
      footer: calcularTotalQtdProduto(),
    },
    {
      field: 'valorProduto',
      header: 'Venda Bruta',
      body: row => <th>{formatMoeda(row.valorProduto)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorBruto()),
    },
    {
      field: 'valorDesconto',
      header: 'Desconto',
      body: row => <th>{formatMoeda(row.valorDesconto)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorDesconto()),
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Venda Bruta ( - Desc)',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalVendaBrutaDesconto()),
    },
    {
      field: 'voucher',
      header: 'Voucher',
      body: row => <th>{formatMoeda(row.voucher)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalVoucher()),
    },
    {
      field: 'valorLiquido',
      header: 'Venda Líquida',
      body: row => <th>{formatMoeda(row.valorLiquido)}</th>,
      sortable: true,
      footer: formatMoeda(calcularTotalValorLiquido()),
    },
  ]



  return (

    <Fragment>

      <div className="panel" >
        <div className="panel-hdr">
          <h2>Vendas por Marcas e Período</h2>
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
            title="Vendas por Marcas e Período"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}

          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )
}