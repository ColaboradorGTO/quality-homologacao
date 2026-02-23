import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaRemessaVenda = ({ dadosEstabelecimentos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Remessa de Vendas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Estabelecimento', 'Código Estabelecimento' ]],
      body: dados.map(item => [
        item.contador, 
        item.NOFANTASIA, 
        item.NUESTABELECIMENTO, 
        item.CODESTABELECIMENTO, 

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('remessa_vendas_grupo.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Estabelecimento', 'Código Estabelecimento', 'IDESTA' ];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Estabelecimento' },
      { wpx: 150, caption: 'Código Estabelecimento' }, 
      { wpx: 100, caption: 'IDESTABELECIMENTO' }
     
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Remessa de Vendas');
    XLSX.writeFile(workbook, 'remessa_vendas_grupo.xlsx');
  };

 
  const dados = Array.isArray(dadosEstabelecimentos) ? dadosEstabelecimentos.map((item, index) => {
    let contador = index + 1;
    
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      NUESTABELECIMENTO: item.NUESTABELECIMENTO,
      CODESTABELECIMENTO: item.CODESTABELECIMENTO,
      IDESTABELECIMENTO: item.IDESTABELECIMENTO,
      
    }
  }): []

  const colunasEstabelecimentos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'NUESTABELECIMENTO',
      header: 'Estabelecimento',
      body: row => <th>{row.NUESTABELECIMENTO}</th>,
      sortable: true
    },
    {
      field: 'CODESTABELECIMENTO',
      header: 'Código Estabelecimento',
      body: row => <th>{row.CODESTABELECIMENTO}</th>,
      sortable: true
    },
    {
      field: 'IDESTABELECIMENTO',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Editar Estabelecimento"}
              cor={"primary"}
              Icon={CiEdit}
              iconSize={25}
              width="35px"
              height="35px"
              onClickButton
            />
          </div>
        )
      }
    }
  ]


  return (

    <Fragment>
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
          title="Remessa de Vendas"
          value={dados}
          size="small"
          globalFilter={globalFilterValue}
          selectionMode="single"
          selection={rowSelection}
          onSelectionChange={(e) => setRowSelection(e.value)}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
          filterDisplay="menu"
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado negativa</div>}
        >
          {colunasEstabelecimentos.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '1rem' }}

            />
          ))}
        </DataTable>
      </div>

    </Fragment>
  )
}
