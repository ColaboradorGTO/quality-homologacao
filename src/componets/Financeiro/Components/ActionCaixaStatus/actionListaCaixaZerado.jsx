import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { MdClose } from "react-icons/md"
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAtivarCancelar } from "./hooks/useAtivarCancelar";

export const ActionListaCaixaZerado = ({ 
  dadosCaixaZerados, 
  usuarioLogado, 
  optionsModulos, 
  refetchCaixaZerado 
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const {
    handleCancelar
  } = useAtivarCancelar({ usuarioLogado, optionsModulos, refetchCaixaZerado });
  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Caixas Zerados',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Loja', 'Nº Mov', 'Caixa', 'Dt. Abertura', 'Dt. Fechamneto', 'Operador', 'Status', 'Conferido']],
      body: dadosListaCaixaZerados.map(item => [
        item.contador, 
        item.NOFANTASIA, 
        item.IDMOVIMENTO,
        item.DSCAIXAFECHAMENTO, 
        item.DTHORAABERTURACAIXA, 
        item.DTHORAFECHAMENTOCAIXA, 
        item.OPERADORFECHAMENTO, 
        item.STFECHADO, 
        item.STCONFERIDO 
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('caixas_zerados.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaCaixaZerados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Loja', 'Caixa', 'Dt. Abertura', 'Dt. Fechamneto', 'Operador', 'Status', 'Conferido', 'Valor Quebra'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' }, 
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 150, caption: 'Dt. Abertura' },
      { wpx: 150, caption: 'Dt. Fechamneto' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 50, caption: 'Status' },
      { wpx: 80, caption: 'Conferido' },
      { wpx: 100, caption: 'Valor Quebra' },   
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Caixas Zerados');
    XLSX.writeFile(workbook, 'caixas_zerados.xlsx');
  };

  const dadosListaCaixaZerados = Array.isArray(dadosCaixaZerados) ? dadosCaixaZerados.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      IDMOVIMENTO: item.IDMOVIMENTO,
      DSCAIXAFECHAMENTO: item.DSCAIXAFECHAMENTO,
      DTHORAABERTURACAIXA: item.DTHORAABERTURACAIXA,
      DTHORAFECHAMENTOCAIXA: item.DTHORAFECHAMENTOCAIXA,
      OPERADORFECHAMENTO: item.OPERADORFECHAMENTO,
      STFECHADO: item.STFECHADO,
      STCONFERIDO: item.STCONFERIDO,
    }
  }): [];

  const colunasCaixaZerados = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{fontWeight: 600, width: '200px', margin: '0px'}}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTO',
      header: 'Nº Movimento',
      body: row => <p p style={{fontWeight: 600, width: '150px', margin: '0px'}}>{row.IDMOVIMENTO}</p>,
      sortable: true,
    },
    {
      field: 'DSCAIXAFECHAMENTO',
      header: 'Caixa',
      body: row => <th>{row.DSCAIXAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAABERTURACAIXA',
      header: 'Data Abertura',
      body: row => <p style={{fontWeight: 600, width: '150px', margin: '0px'}}>{row.DTHORAABERTURACAIXA}</p>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTOCAIXA',
      header: 'Data Fechamento',
      body: row => <th>{row.DTHORAFECHAMENTOCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'OPERADORFECHAMENTO',
      header: 'Operador',
      body: row => <p p style={{fontWeight: 600, width: '200px', margin: '0px'}}>{row.OPERADORFECHAMENTO}</p>,
      sortable: true,
    },
    {
      field: 'STFECHADO',
      header: 'Status',
      body: row => <th style={{ color: row.STFECHADO === 'True' ? 'red' : 'blue' }}>{row.STFECHADO === 'True' ? 'Fechado' : 'Aberto'}</th>,
      sortable: true,
    },
    {
      field: 'STCONFERIDO',
      header: 'Conferido',
      body: row => <th style={{ color: row.STCONFERIDO > 0 ? 'blue' : 'black' }}>{row.STCONFERIDO > 0 ? 'Conferido' : 'Sem Conferir'}</th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTO',
      header: 'Opções',
      body: row => {
        return (
          <div>
            <ButtonTable
              titleButton={"Fechar Caixa"}
              cor={"danger"}
              Icon={MdClose}
              iconSize={20}
              width="35px"
              height="35px"
              onClickButton={() => handleCancelar(row)}
            />
          </div>
        )
      },
      sortable: true,
    },
  ]


  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>
            Lista Caixas Zerados
          </h2>
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
            title="Lista de Caixas Zerados"
            value={dadosListaCaixaZerados}
            globalFilter={globalFilterValue}
            size={"small"}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaCaixaZerados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasCaixaZerados.map(coluna => (
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