import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../Tables/headerTable";
import { get } from "../../../../../api/funcRequest";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { toFloat } from "../../../../../utils/toFloat";

export const ActionListaNotasNFE = ({ dadosCriarDevolucao }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
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
      head: [['Nº', 'Produto', 'Referência', 'NCM', 'Vr. Unitário', 'QTD Nota', 'QTD Devolução', 'Vr. Total']],
      body: dados.map(item => [
        item.contador,
        item.XPROD,
        item.CPROD,
        item.NCM,
        item.VUNCOM,
        item.QCOM,
        item.QCOM,
        item.VPROD
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_pedido.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Produto', 'Referência', 'NCM', 'Vr. Unitário', 'QTD Nota', 'QTD Devolução', 'Vr. Total']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Referência' },
      { wpx: 100, caption: 'NCM' },
      { wpx: 100, caption: 'Vr. Unitário' },
      { wpx: 100, caption: 'QTD Nota' },
      { wpx: 100, caption: 'QTD Devolução' },
      { wpx: 100, caption: 'Vr. Total' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Pedido');
    XLSX.writeFile(workbook, 'produtos_pedido.xlsx');
  };


  const dados = dadosCriarDevolucao?.data.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDPRODUTO: item.IDPRODUTO,
      XPROD: item.XPROD,
      CPROD: item.CPROD,
      NCM: item.NCM,
      EMPDESTINO: item.EMPDESTINO,
      VUNCOM: formatMoeda(item.VUNCOM),
      QCOM: toFloat(item.QCOM),
      VPROD: formatMoeda(item.VPROD),
    }
  })

  const colunasUnidadeMedida = [
    {
      field: 'Linha',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'XPROD',
      header: 'Produto',
      body: row => {
        return (
          <th>{row.XPROD}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'CPROD',
      header: 'Referência',
      body: row => {
        return (
          <th>{row.CPROD}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NCM',
      header: 'NCM',
      body: row => {
        return (
          <th>{row.NCM}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'VUNCOM',
      header: 'Vr. Unitário',
      body: row => {
        return (
          <th>{row.VUNCOM}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'QCOM',
      header: 'QTD Nota',
      body: row => {
        return (
          <th>{row.QCOM}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'QCOM',
      header: 'QTD Devolução',
      body: row => {
        return (
          <th>{row.QCOM}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'VPROD',
      header: 'Vr. Total',
      body: row => {
        return (
          <th>{row.VPROD}</th>
        )
      },
      sortable: true,
    },
  ]


  return (
    <Fragment>
      <div className="panel" style={{width: '100%', marginTop: '2rem'}}>
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
        <div className="card" ref={dataTableRef}>
          <DataTable
            title="Produtos da Nota"
            value={dados}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            size="small"
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
            {colunasUnidadeMedida.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )
}