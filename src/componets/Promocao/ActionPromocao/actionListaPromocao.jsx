import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import { useCadastrarPromocao } from "./ActionCadastrarPromocao/hooks/useCadastrarPromocao";


export const ActionListaPromocao = ({ dadosListaPromocao, refetchPromocao }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const {
    handleCSVUpload,
    handleXLSUpload
  } = useCadastrarPromocao(refetchPromocao);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Promoção',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', , 'Descrição', 'Situação']],
      body: dados.map(item => [
        item.IDRESUMOPROMO,
        item.DSPROMO,
        item.STATIVO === 'True' ? 'Ativo' : 'Inativo',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('promocao.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Descrição', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Promoção');
    XLSX.writeFile(workbook, 'promocao.xlsx');
  };



  const dados = dadosListaPromocao.map((item) => {

    return {
      IDRESUMOPROMO: item.IDRESUMOPROMO,
      DSPROMO: item.DSPROMO,
      STATIVO: item.STATIVO,
    }
  });

  const colunasListaPromocao = [
    {
      field: 'IDRESUMOPROMO',
      header: 'ID',
      body: row => <th style={{ color: 'blue' }} >{row.IDRESUMOPROMO}</th>,
      sortable: true,
    },
    {
      field: 'DSPROMO',
      header: 'Descrição',
      body: row => <th style={{ color: 'blue' }} >{row.DSPROMO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
          {row.STATIVO === 'True' ? 'Ativo' : 'Inativo'}
        </th>

      ),
      sortable: true,
    },
    {
      field: 'Detalhar',
      header: 'Detalhar',
      body: row => <p style={{ color: 'blue' }} ></p>,
      sortable: true,
    },
  ]

  // DSNOME: "Oculos De Sol HPC143 Acetad Pto/mrm Triton Eyew Un"
  // IDPRODUTO: "000000112Un"
  // NUCODBARRAS: "0000000002718"
  // PRECOCUSTO: "19.00"
  // PRECOVENDA: "119.9600"


  const toast = useRef(null);
  const fileInputRef = useRef(null);

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Promoções</h2>
          <div className="card">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleCSVUpload(file);
                  fileInputRef.current.value = ""; // Clear the input after file upload
                }
              }}
            />
         
          </div>
          <div className="card">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleXLSUpload(file);
                  fileInputRef.current.value = ""; // Clear the input after file upload
                }
              }}
            />
         
          </div>
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
            title="Lista de Promoções"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={
              <div className="dataTables_empty">Nenhum resultado encontrado</div>
            }
          >
            {colunasListaPromocao.map((coluna) => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{
                  color: "white",
                  backgroundColor: "#7a59ad",
                  border: "1px solid #e9e9e9",
                  fontSize: "1rem",
                }}
                footerStyle={{
                  color: "#212529",
                  backgroundColor: "#e9e9e9",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
                bodyStyle={{
                  fontSize: "1rem",
                  border: "1px solid #e9e9e9",
                }}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  );
}
