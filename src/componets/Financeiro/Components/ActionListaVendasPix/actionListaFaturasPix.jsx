import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaFaturasPix = ({ dadosVendasFaturasPix }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas PIX Consolidada',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Valor Fatura PIX']],
      body: dadosListaVendasPix.map(item => [
        item.Numero,
        item.NOFANTASIA,
        formatMoeda(item.PIX),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_consolidada_pix.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaVendasPix);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas PIX Consolidada');
    XLSX.writeFile(workbook, 'vendas_consolidada_pix.xlsx');
  };

  const calcularTotalValorPix = () => {
    let total = 0;
    for (let dados of dadosVendasFaturasPix) {
      total += parseFloat(dados.VRRECEBIDO);
    }
    return total;
  }

  const dadosListaVendasPix = Array.isArray(dadosVendasFaturasPix) ? dadosVendasFaturasPix.map((item, index) => {
    let contador = index + 1;
    console.log(item);
    return {
      NOFANTASIA: item.NOFANTASIA,
      DTPROCESSAMENTO: item.DTPROCESSAMENTO,
      NUCODAUTORIZACAO: item.NUCODAUTORIZACAO,
      VRRECEBIDO: item.VRRECEBIDO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      STCANCELADO: item.STCANCELADO,


      contador
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
      header: 'Loja',
      body: row => <p style={{ color: 'blue', fontWeight: 600, width: '250px', margin: '0px' }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DTPROCESSAMENTO',
      header: 'Data',
      body: row => <p style={{ color: 'blue', fontWeight: 600, width: '100px' }}>{row.DTPROCESSAMENTO}</p>,
      sortable: true,
    },
    {
      field: 'NUCODAUTORIZACAO',
      header: 'Cod. Autorização',
      body: row => <th style={{ color: 'blue' }}>{row.NUCODAUTORIZACAO}</th>,
      sortable: true,
    },
    {
      field: 'VRRECEBIDO',
      header: 'Vr Fatura PIX',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRRECEBIDO)}</th>,
      footer: formatMoeda(calcularTotalValorPix()),
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Recebedor',
      body: row => <p style={{ color: 'blue', fontWeight: 600, width: '250px', margin: '0px' }}>{row.NOFUNCIONARIO}</p>,
      sortable: true,
    },
    {
      field: 'NUAUTORIZACAO',
      header: 'Autorização',
      body: row => <th style={{ color: 'blue' }}>{row.NUAUTORIZACAO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <th style={{ color: row.STCANCELADO == 'True' ? 'red' : 'blue' }}>{row.STCANCELADO == 'True' ? 'Cancelado' : 'Ativo'}</th>,
      sortable: true,
    }
  ]

  return (

    <Fragment>

      <div className="row">
        <div className="col-xl-12">
          <div id="panel-1" className="panel">
            <div className="panel-hdr">
              <h2>
                Lista de Faturas PIX Por Período<span className="fw-300"><i></i></span>
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
                    title="Fatura Pix"
                    value={dadosListaVendasPix}
                    globalFilter={globalFilterValue}
                    size={"small"}
                    selectionMode="single"
                    selection={rowSelection}
                    onSelectionChange={(e) => setRowSelection(e.value)} a
                    sortOrder={-1}
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50, 100, dadosListaVendasPix.length]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                    filterDisplay="menu"
                    paginator={true}
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
                        headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                        footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                        bodyStyle={{ fontSize: '1rem', color: '#d1cdc7' }}

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