import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEditarListaPrecos } from "../hooks/useEditarListaPrecos";
import HeaderTable from "../../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionEditarListasPrecos = ({ dadosListaLoja, optionsModulos, usuarioLogado }) => {
  const {
    dadosEmpresas,
    empresaSelecionada,
    setEmpresaSelecionada,
  } = useEditarListaPrecos({optionsModulos, usuarioLogado});
  
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowClick, setRowClick] = useState(false);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Lojas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Lista', 'Nome Loja', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.IDRESUMOLISTAPRECO,
        item.NOMELISTA,
        item.detalheLista,
        item.DATACRIACAO,
        item.DATAALTERACAO,
        item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_lojas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Lista', 'Nome Loja', 'Status']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'ID Lista' },
      { wpx: 300, caption: 'Nome Loja' },
      { wpx: 100, caption: 'Status' },
  
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Lojas');
    XLSX.writeFile(workbook, 'lista_lojas.xlsx');
  };

  const dados = dadosEmpresas.map((item, index) => {
    let contador = index + 1;

    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      STATIVO: item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA',
      IDGRUPOEMPRESARIAL: item.IDGRUPOEMPRESARIAL,
      contador
    }
  })

  const colunasEmpresas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Loja',
      body: row => <th>{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Nome Loja',
      body: row => {
        return (
          <th>{row.NOFANTASIA}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'ATIVA' ? 'blue' : 'red' }} >{row.STATIVO}</th>
        )
      },
      sortable: true,
    },
    {
      header: 'Selecione',
      selectionMode: 'multiple',
      selection: empresaSelecionada,
      width: '10px',
      sortable: true,
    },
  ]

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Lojas</h2>
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
        <div className="card " ref={dataTableRef}>

          <DataTable
            scrollable 
            scrollHeight="400px"
            title="Lista de Lojas"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            selectionMode={rowClick ? null : 'checkbox'}
            selection={empresaSelecionada}
            onSelectionChange={e => setEmpresaSelecionada(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={dados.length}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasEmpresas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                selectionMode={coluna.selectionMode}
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