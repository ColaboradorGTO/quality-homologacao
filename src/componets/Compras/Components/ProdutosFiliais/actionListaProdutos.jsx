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
      head: [['Id. Prod', 'Produto', 'Cód Barras', 'Filial Origem', 'PV. Origem', 'Qtd. Origem', 'Filial Destino', 'PV. Destino', 'Qtd. Destino', 'PV. Divergência']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.DSPRODUTO,
        item.NUCODBARRAS,
        item.NOFILIALORIGEM,
        formatMoeda(item.PRECOVENDAFILIALORIGEM),
        item.QTDESTOQUEFILIALORIGEM,
        item.NOFILIALDESTINO,
        formatMoeda(item.PRECOVENDAFILIALDESTINO),
        item.QTDESTOQUEFILIALDESTINO,
        item.PRECOVENDAFILIALORIGEM !== item.PRECOVENDAFILIALDESTINO ? 'SIM' : 'NÃO',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Id. Prod', 'Produto', 'Cód Barras', 'Filial Origem', 'PV. Origem', 'Qtd. Origem', 'Filial Destino', 'PV. Destino', 'Qtd. Destino', 'PV. Divergência'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Id. Prod' },
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cód Barras' },
      { wpx: 100, caption: 'Filial Origem' },
      { wpx: 100, caption: 'PV. Origem' },
      { wpx: 100, caption: 'Qtd. Origem' },
      { wpx: 100, caption: 'Filial Destino' },
      { wpx: 100, caption: 'PV. Destino' },
      { wpx: 100, caption: 'Qtd. Destino' },
      { wpx: 100, caption: 'PV. Divergência' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Produtos');
    XLSX.writeFile(workbook, 'lista_produtos.xlsx');
  };

  const dados = dadosProdutos.map((item, index) => {
    let contador = index + 1;
    let STDIVERGENCIA = 'NÃO';
    
    return {
      contador,
      IDPRODUTO: item.IDPRODUTO,
      DSPRODUTO: item.DSPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      NOFILIALORIGEM: item.NOFILIALORIGEM,
      PRECOVENDAFILIALORIGEM: item.PRECOVENDAFILIALORIGEM,
      QTDESTOQUEFILIALORIGEM: item.QTDESTOQUEFILIALORIGEM,
      NOFILIALDESTINO: item.NOFILIALDESTINO,
      PRECOVENDAFILIALDESTINO: item.PRECOVENDAFILIALDESTINO,
      QTDESTOQUEFILIALDESTINO: item.QTDESTOQUEFILIALDESTINO,
      STDIVERGENCIA,
    }
  });

  const colunasListaProdEtiquetas = [
    {
      field: 'IDPRODUTO',
      header: 'Id. Prod',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: (row) => <th>{row.DSPRODUTO}</th>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código de Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'NOFILIALORIGEM',
      header: 'Filial Origem',
      body: row => <th>{row.NOFILIALORIGEM}</th>,
      sortable: true
    },
    {
      field: 'PRECOVENDAFILIALORIGEM',
      header: 'PV. Origem',
      body: row => {
         if(row.PRECOVENDAFILIALORIGEM !== row.PRECOVENDAFILIALDESTINO) {
          return <th style={{ color: '#2196F3' }}>{row.PRECOVENDAFILIALORIGEM}</th>
        } else {
          return <th style={{ color: '#fd3995' }}>{row.PRECOVENDAFILIALORIGEM}</th>
        }
      },
      sortable: true
    },
    {
      field: 'QTDESTOQUEFILIALORIGEM',
      header: 'Qtd. Origem',
      body: row => <th>{row.QTDESTOQUEFILIALORIGEM}</th>,
      sortable: true
    },
    {
      field: 'NOFILIALDESTINO',
      header: 'Filial Destino',
      body: row => <th>{row.NOFILIALDESTINO}</th>,
      sortable: true
    },
    {
      field: 'PRECOVENDAFILIALDESTINO',
      header: 'PV. Destino',
      body: row => {
        if(row.PRECOVENDAFILIALORIGEM !== row.PRECOVENDAFILIALDESTINO) {
          return <th style={{ color: '#2196F3' }}>{row.PRECOVENDAFILIALDESTINO}</th>
        } else {
          return <th style={{ color: '#fd3995' }}>{row.PRECOVENDAFILIALDESTINO}</th>
        }
      },
      sortable: true
    },
    {
      field: 'QTDESTOQUEFILIALDESTINO',
      header: 'Qtd. Destino',
      body: row => <th>{toFloat(row.QTDESTOQUEFILIALDESTINO)}</th>,
      sortable: true
    },
    {
      field: 'STDIVERGENCIA',
      header: 'PV. Divergência',
      body: row => {
        if(row.PRECOVENDAFILIALORIGEM !== row.PRECOVENDAFILIALDESTINO) {
          return <th style={{ color: '#2196F3' }}>{SIM}</th>
        } else {
          return <th style={{ color: '#fd3995 ' }}>NÃO</th>
        }
      },
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
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>


    </Fragment>
  )
}