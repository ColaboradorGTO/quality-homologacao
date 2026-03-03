import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaProdutos = ({ dadosProdutos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Produtos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Dt. Pedido', 'Nº Pedido', 'Id. Fornecedor', 'Fornecedor', 'Fabricante', 'Id. Prod', 'Produto', 'Cód. Barras', 'Qtd. Pedido', 'Id. Filial', 'Filial', 'PV. Pedido', 'PV. Filial', 'QTD Estoque', 'UM']],
      body: dados.map(item => [
        item.contador,
        item.DTPEDIDO,
        item.IDRESUMOPEDIDO,
        item.IDFORNECEDOR,
        item.NOFORNECEDOR,
        item.NOFABRICANTE,
        item.IDPRODUTO,
        item.DSPRODUTO,
        item.NUCODBARRAS,
        toFloat(item.QTDPRODUTOPEDIDO),
        item.IDEMPRESA,
        item.NOFILIAL,
        formatMoeda(item.VRVENDAPEDIDO),
        formatMoeda(item.PRECOVENDA),
        toFloat(item.QTDESTOQUE),
        item.UM,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Dt. Pedido', 'Nº Pedido', 'Id. Fornecedor', 'Fornecedor', 'Fabricante', 'Id. Prod', 'Produto', 'Cód. Barras', 'Qtd. Pedido', 'Id. Filial', 'Filial', 'PV. Pedido', 'PV. Filial', 'QTD Estoque', 'UM'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 200, caption: 'Dt. Pedido' },
      { wpx: 80, caption: 'Nº Pedido' },
      { wpx: 80, caption: 'Id. Fornecedor' },
      { wpx: 200, caption: 'Fornecedor' },
      { wpx: 150, caption: 'Fabricante' },
      { wpx: 80, caption: 'Id. Prod' },
      { wpx: 250, caption: 'Produto' },
      { wpx: 120, caption: 'Cód. Barras' },
      { wpx: 80, caption: 'Qtd. Pedido' },
      { wpx: 80, caption: 'Id. Filial' },
      { wpx: 200, caption: 'Filial' },
      { wpx: 100, caption: 'PV. Pedido' },
      { wpx: 100, caption: 'PV. Filial' },
      { wpx: 100, caption: 'QTD Estoque' },
      { wpx: 80, caption: 'UM' },
     
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Produtos');
    XLSX.writeFile(workbook, 'lista_produtos.xlsx');
  };

  const dados = dadosProdutos.map((item, index) => {
    let contador = index + 1;
    
    
    return {
      contador,
      IDRESUMOPEDIDO: item.IDRESUMOPEDIDO,
      DTPEDIDO: item.DTPEDIDO,
      IDFORNECEDOR: item.IDFORNECEDOR,
      NOFORNECEDOR: item.NOFORNECEDOR,
      NOFABRICANTE: item.NOFABRICANTE,
      IDPRODUTO: item.IDPRODUTO,
      DSPRODUTO: item.DSPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      QTDPRODUTOPEDIDO: toFloat(item.QTDPRODUTOPEDIDO),
      IDEMPRESA: item.IDEMPRESA,
      NOFILIAL: item.NOFILIAL,
      VRVENDAPEDIDO: item.VRVENDAPEDIDO,
      PRECOVENDA: item.PRECOVENDA,
      QTDESTOQUE: toFloat(item.QTDESTOQUE),
      UM: item.UM,
    }
  });

  const colunasListaProdEtiquetas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'DTPEDIDO',
      header: 'Dt. Pedido',
      body: row => <th>{row.DTPEDIDO}</th>,
      sortable: true
    },
    {
      field: 'IDRESUMOPEDIDO',
      header: 'Nº Pedido',
      body: row => <th>{row.IDRESUMOPEDIDO}</th>,
      sortable: true
    },
    {
      field: 'IDFORNECEDOR',
      header: 'Id. Fornecedor',
      body: row => <th>{row.IDFORNECEDOR}</th>,
      sortable: true
    },
    {
      field: 'NOFORNECEDOR',
      header: 'Fornecedor',
      body: row => <p style={{width: '200px', margin: 0, padding:0,}}>{row.NOFORNECEDOR}</p>,
      sortable: true
    },
    {
      field: 'NOFABRICANTE',
      header: 'Fabricante',
      body: row => <th>{row.NOFABRICANTE}</th>,
      sortable: true
    },
    {
      field: 'IDPRODUTO',
      header: 'Id. Prod',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: (row) => <p style={{width: '200px', margin: 0, padding:0,}}>{row.DSPRODUTO}</p>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'QTDPRODUTOPEDIDO',
      header: 'Qtd. Pedido',
      body: row => <th>{row.QTDPRODUTOPEDIDO}</th>,
      sortable: true
    },
    {
      field: 'IDEMPRESA',
      header: 'Id. Filial',
      body: row => <th>{row.IDEMPRESA}</th>,
      sortable: true
    },
    {
      field: 'NOFILIAL',
      header: 'Filial',
      body: row => <p style={{width: '200px', margin: 0, padding:0,}}>{row.NOFILIAL}</p>,
      sortable: true
    },
    {
      field: 'VRVENDAPEDIDO',
      header: 'PV. Pedido',
      body: row => {
         if(row.VRVENDAPEDIDO !== row.PRECOVENDA) {
          return <th style={{ color: '#2196F3' }}>{formatMoeda(row.VRVENDAPEDIDO)}</th>
        } else {
          return <th style={{ color: '#fd3995' }}>{formatMoeda(row.VRVENDAPEDIDO)}</th>
        }
      },
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'PV. Filial',
      body: row => {
        if(row.VRVENDAPEDIDO !== row.PRECOVENDA) {
          return <th style={{ color: '#2196F3' }}>{formatMoeda(row.PRECOVENDA)}</th>
        } else {
          return <th style={{ color: '#fd3995' }}>{formatMoeda(row.PRECOVENDA)}</th>
        }
      },
      sortable: true
    },
    {
      field: 'QTDESTOQUE',
      header: 'QTD Estoque',
      body: row => <th>{toFloat(row.QTDESTOQUE)}</th>,
      sortable: true
    },
    {
      field: 'UM',
      header: 'UM',
      body: row => <th>{row.UM}</th>,
      sortable: true
    },
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Produtos </h2>
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
            title="Lista de Produtos"
            value={dados}
            globalFilterValue={globalFilterValue}
            size="small"
            selectionMode={'single'}
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
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

            {colunasListaProdEtiquetas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', fontWeight: 600 }}

              />
            ))}
          </DataTable>
        </div>
      </div>


    </Fragment>
  )
}