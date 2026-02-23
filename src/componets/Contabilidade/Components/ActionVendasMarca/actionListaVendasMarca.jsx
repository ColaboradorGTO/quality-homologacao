import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasMarca = ({ dadosVendasMarca }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Por Marca',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['#', 'Empresa', 'Data Emissão', 'QTD Total Produto', 'Venda Bruta', 'Desconto', 'Venda Bruta - Desconto']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DATAEMISSAO,
        parseFloat(item.QTD),
        formatMoeda(item.VALORPROD),
        formatMoeda(item.VALORDESCONTO),
        formatMoeda(item.VALORNF),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_por_marcas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['#', 'Empresa', 'Data Emissão', 'QTD Total Produto', 'Venda Bruta', 'Desconto', 'Venda Bruta - Desconto'];
    worksheet['!cols'] = [
      { wpx: 100, caption: '#' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 200, caption: 'Data Emissão' },
      { wpx: 100, caption: 'QTD Total Produto' },
      { wpx: 100, caption: 'Venda Bruta' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Venda Bruta - Desconto' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Por Marca');
    XLSX.writeFile(workbook, 'vendas_por_marcas.xlsx');
  };


  const dados = dadosVendasMarca.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DATAEMISSAO: item.DATAEMISSAO,
      QTD: toFloat(item.QTD),
      VALORPROD: toFloat(item.VALORPROD),
      VALORDESCONTO: toFloat(item.VALORDESCONTO),
      VALORNF: toFloat(item.VALORNF),
      IDEMPRESA: item.IDEMPRESA,
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
      footer: '',
    },
    {
      field: 'DATAEMISSAO',
      header: 'Data Emissão',
      body: row => <th>{row.DATAEMISSAO}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'QTD Total Produto',
      body: row => <th>{toFloat(row.QTD)}</th>,
      sortable: true,
      footer: '',
    },
    {
      field: 'VALORPROD',
      header: 'Venda Bruta',
      body: row => <th>{formatMoeda(row.VALORPROD)}</th>,
      sortable: true,
      footer: '',
    },
    {
      field: 'VALORDESCONTO',
      header: 'Desconto',
      body: row => <th>{formatMoeda(row.VALORDESCONTO)}</th>,
      sortable: true,
      footer: '',
    },
    {
      field: 'VALORNF',
      header: 'Venda Bruta ( - Desc)',
      body: row => <th>{formatMoeda(row.VALORNF)}</th>,
      sortable: true,
      footer: '',
    },
  ]



  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">

          <h3>Lista de Vendas Por Marca</h3>
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
            title="Vendas produtos por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
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

