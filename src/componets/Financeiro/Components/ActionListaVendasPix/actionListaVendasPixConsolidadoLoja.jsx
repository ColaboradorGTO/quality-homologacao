import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasPixConsolidadoLoja = ({ dadosFaturasPixConsolidadoLoja }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Fatura PIX Consolidada Lojas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Valor Fatura PIX']],
      body: dadosListaVendasPix.map(item => [
        item.contador,
        item.NOFANTASIA,
        formatMoeda(item.VRRECEBIDO),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('fatura_pix_consolidada_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaVendasPix);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fatura PIX Consolidada Lojas');
    XLSX.writeFile(workbook, 'fatura_pix_consolidada_loja.xlsx');
  };

  const calcularTotalValorPix = () => {
    let total = 0;
    for (let dados of dadosFaturasPixConsolidadoLoja) {
      total += parseFloat(dados.VRRECEBIDO);
    }
    return total;
  }

  const dadosListaVendasPix = Array.isArray(dadosFaturasPixConsolidadoLoja) ? dadosFaturasPixConsolidadoLoja.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      VRRECEBIDO: item.VRRECEBIDO,
    }
  }) : [];

  const colunasVendasPix = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{ color: 'blue' }}>{row.NOFANTASIA}</th>,
      footer: 'Total ',
      sortable: true,
    },

    {
      field: 'VRRECEBIDO',
      header: 'Valor Fatura PIX',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRRECEBIDO)}</th>,
      footer: formatMoeda(calcularTotalValorPix()),
      sortable: true,
    },


  ]

  return (

    <Fragment>

      <div className="row">
        <div className="col-xl-12">
          <div id="panel-1" className="panel">
            <div className="panel-hdr">
              <h2>
                Lista de Faturas Pix Por Período<span className="fw-300"><i>Consolidado Por Lojas</i></span>
              </h2>

            </div>
            <div className="panel-container show">
              <div className="panel-content">
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
                    title="Faturas Pix Consolidado Por Loja "
                    value={dadosListaVendasPix}
                    globalFilter={globalFilterValue}
                    size="small"
                    selectionMode="single"
                    selection={rowSelection}
                    onSelectionChange={(e) => setRowSelection(e.value)}
                    sortOrder={-1}
                    rows={dadosListaVendasPix.length}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                    filterDisplay="menu"
                    showGridlines
                    stripedRows
                    emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                  >
                    {colunasVendasPix.map(coluna => (
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}