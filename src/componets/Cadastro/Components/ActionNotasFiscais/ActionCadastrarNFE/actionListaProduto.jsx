import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../Tables/headerTable";
import { get } from "../../../../../api/funcRequest";

export const ActionListaNotasNFE = ({ dadosNfePedido }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Pedido',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Produto', 'Produto', 'Cód.Barras', 'Quantidade', 'Depósito', 'Vr. Unitário', 'Vr. Total']],
      body: dados.map(item => [
        item.contador,
        item.IDPRODUTO,
        item.DSPRODUTO,
        item.NUCODBARRAS,
        item.QTD,
        item.EMPDESTINO,
        item.VRUNITARIO,
        item.VRTOTALPROD
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_pedido.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Produto', 'Produto', 'Cód.Barras', 'Quantidade', 'Depósito', 'Vr. Unitário', 'Vr. Total']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cód.Barras' },
      { wpx: 100, caption: 'Quantidade' },
      { wpx: 100, caption: 'Depósito' },
      { wpx: 100, caption: 'Vr. Unitário' },
      { wpx: 100, caption: 'Vr. Total' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Pedido');
    XLSX.writeFile(workbook, 'produtos_pedido.xlsx');
  };


  const dados = dadosNfePedido?.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDPRODUTO: item.IDPRODUTO,
      DSPRODUTO: item.DSPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      QTD: item.QTD,
      EMPDESTINO: item.EMPDESTINO,
      VRUNITARIO: item.VRUNITARIO,
      VRTOTALPROD: item.VRTOTALPROD,
    }
  })

  const colunasUnidadeMedida = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'ID Produto',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => {
        return (
          <th>{row.DSPRODUTO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód.Barras',
      body: row => {
        return (
          <th>{row.NUCODBARRAS}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Quantidade',
      body: row => {
        return (
          <th>{row.QTD}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'EMPDESTINO',
      header: 'Depósito',
      body: row => {
        return (
          <th>{row.EMPDESTINO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'VRUNITARIO',
      header: 'Vr. Unitário',
      body: row => {
        return (
          <th>{row.VRUNITARIO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'VRTOTALPROD',
      header: 'Vr. Total',
      body: row => {
        return (
          <th>{row.VRTOTALPROD}</th>
        )
      },
      sortable: true,
    },
  ]


  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>LISTA DOS PRODUTOS DA NOTA</h2>
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
        <div className="card mb-4" ref={dataTableRef}>
          <DataTable
            title="Notas Fiscais"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasUnidadeMedida.map(coluna => (
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