import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { toFloat } from "../../../../utils/toFloat";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionListaProdutosCriados = ({ dadosListaProdutosCriados }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();
  
  
    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
  
    const handlePrint = useReactToPrint({
      content: () => dataTableRef.current,
      documentTitle: 'Produtos Criados',
    });
  
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Nº', 'Data Pedido', 'Nº Pedido',  'Cod Barras', 'Produto', 'NCM', 'TM', 'QTD', 'Vr. Custo', 'Vr. Venda', 'Total Venda', 'Estoque Ideal']],
        body: dados.map(item => [
          item.contador,
          dataFormatada(item.DTCADASTRO),
          item.IDRESUMOPEDIDO,
          item.CODBARRAS,
          item.DSPRODUTO,
          toFloat(item.NUNCM),
          item.DSTAMANHO,
          toFloat(item.QTDPRODUTO),
          formatMoeda(item.VRCUSTO),
          formatMoeda(item.VRVENDA),
          formatMoeda(item.VRTOTALCUSTO),
          toFloat(item.QTDESTOQUEIDEAL),
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('produtos_criados.pdf');
    };
  
    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      const header = ['Nº', 'Data Pedido', 'Nº Pedido',  'Cod Barras', 'Produto', 'NCM', 'TM', 'QTD', 'Vr. Custo', 'Vr. Venda', 'Total Venda', 'Estoque Ideal'];
      worksheet['!cols'] = [
        { wpx: 50, caption: 'Nº' },
        { wpx: 200, caption: 'Data Pedido' },
        { wpx: 70, caption: 'Nº Pedido' },
        { wpx: 100, caption: 'Cod Barras' },
        { wpx: 250, caption: 'Produto' },
        { wpx: 100, caption: 'NCM' },
        { wpx: 50, caption: 'TM' },
        { wpx: 50, caption: 'QTD' },
        { wpx: 70, caption: 'Vr. Custo' },
        { wpx: 70, caption: 'Vr. Venda' },
        { wpx: 70, caption: 'Total Venda' },
        { wpx: 70, caption: 'Estoque Ideal' },
  
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Criados');
      XLSX.writeFile(workbook, 'produtos_criados.xlsx');
    };

  const dados = dadosListaProdutosCriados.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DTCADASTRO: item.DTCADASTRO,
      IDRESUMOPEDIDO: item.IDRESUMOPEDIDO,
      CODBARRAS: item.CODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      NUNCM: toFloat(item.NUNCM),
      DSTAMANHO: item.DSTAMANHO,
      QTDPRODUTO: toFloat(item.QTDPRODUTO),
      VRCUSTO: toFloat(item.VRCUSTO),
      VRVENDA: toFloat(item.VRVENDA),
      VRTOTALCUSTO: toFloat(item.VRTOTALCUSTO),
      QTDESTOQUEIDEAL: toFloat(item.QTDESTOQUEIDEAL),
     
    }
  });

  const colunasProdutosCriado = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DTCADASTRO',
      header: 'DT. Pedido',
      body: row => <th>{dataFormatada(row.DTCADASTRO)}</th>,
      sortable: true,
    },
    {
      field: 'IDRESUMOPEDIDO',
      header: 'Nº Pedido',
      body: row => <th>{row.IDRESUMOPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'CODBARRAS',
      header: 'Código de Barras',
      body: row => <th>{row.CODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUNCM',
      header: 'NCM',
      body: row => <th>{row.NUNCM}</th>,
      sortable: true,
    },
    {
      field: 'DSTAMANHO',
      header: 'TM',
      body: row => <th>{row.DSTAMANHO}</th>,
      sortable: true,
    },
    {
      field: 'QTDPRODUTO',
      header: 'QTD',
      body: row => row.QTDPRODUTO,
      sortable: true,
    },
    {
      field: 'VRCUSTO',
      header: 'Vr. Custo',
      body: row => <th>{formatMoeda(row.VRCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'VRVENDA',
      header: 'Vr. Venda',
      body: row => <th>{formatMoeda(row.VRVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALCUSTO',
      header: 'Total Venda',
      body: row => <th>{formatMoeda(row.VRTOTALCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'QTDESTOQUEIDEAL',
      header: 'Estoque Ideal',
      body: row => <th>{row.QTDESTOQUEIDEAL}</th>,
      sortable: true,
    },
    
  ]

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Produtos Criados</h2>
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
        <div className="card"ref={dataTableRef}>
          <DataTable
            title="Vendas por Loja"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 100, 500, 1000, dados.length]}
            sortOrder={-1}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasProdutosCriado.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.688rem' }}

              />
            ))}
          </DataTable>
        </div>

      </div>
    </Fragment>
  )
}