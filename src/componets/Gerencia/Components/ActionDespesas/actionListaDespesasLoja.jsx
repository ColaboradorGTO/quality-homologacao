import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { useReactToPrint } from 'react-to-print';
import HeaderTable from '../../../Tables/headerTable';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';

export const ActionListaDespesasLoja = ({ dadosDespesasLoja }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Despesas da Loja',
  });

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Data Mov', 'Descrição.',  'Valor', 'Pago A', 'Histórico', 'Nota Fiscal', 'Situação']],
      body: dados.map(item => [
        item.contador, 
        item.DTDESPESA, 
        item.DSCATEGORIA, 
        item.VRDESPESA, 
        item.DSPAGOA, 
        item.DSHISTORIO, 
        item.NUNOTAFISCAL, 
        item.STCANCELADO === 'False' ? 'Ativo' : 'Cancelado'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('despesas_loja.pdf');
  };
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data Mov', 'Descrição.',  'Valor', 'Pago A', 'Histórico', 'Nota Fiscal', 'Situação']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Data Mov' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 200, caption: 'Pago A' },
      { wpx: 200, caption: 'Histórico' },
      { wpx: 100, caption: 'Nota Fiscal' },
      { wpx: 100, caption: 'Situação' },
     
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Despesas da Loja');
    XLSX.writeFile(workbook, 'despesas_loja.xlsx');
  };
  
  
  const dados = dadosDespesasLoja.map((item, index) => {
    let contador = index + 1;
    
    return {
      contador,
      DTDESPESA: item.DTDESPESA,
      IDDESPESASLOJA: item.IDDESPESASLOJA,
      DSCATEGORIA: item.DSCATEGORIA,
      VRDESPESA: item.VRDESPESA,
      DSPAGOA: item.DSPAGOA,
      DSHISTORIO: item.DSHISTORIO,
      NUNOTAFISCAL: item.NUNOTAFISCAL,
      STCANCELADO: item.STCANCELADO, 
      
    }
  });
  

    const calcularTotal = (field) => {
      return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
    };
  
  
    const calcularTotalValor = () => {
      const totalDinheiro = calcularTotal('VRDESPESA');

      return `${formatMoeda(totalDinheiro)} `;
    };
  
    
  const colunasDespesas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{color: 'blue'}}>{row.contador}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'DTDESPESA',
      header: 'Data Mov',
      body: row => <p style={{ margin: 0, color: 'blue', fontWeight: 600, width: '100px' }}>{row.DTDESPESA}</p>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIA',
      header: 'Descrição',
      body: row => <th style={{color: 'blue'}}>{row.DSCATEGORIA}</th>,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRDESPESA',
      header: 'Valor',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRDESPESA)}</th>,
      footer: formatMoeda(calcularTotal()),
      sortable: true,
    },
    {
      field: 'DSPAGOA',
      header: 'Pago a',
      body: row => <th style={{color: 'blue'}}>{row.DSPAGOA}</th>,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => <th style={{color: 'blue'}}>{row.DSHISTORIO}</th>,
      sortable: true,
    },
    {
      field: 'NUNOTAFISCAL',
      header: 'Nota Fiscal',
      body: row => <th style={{color: 'blue'}}>{row.NUNOTAFISCAL}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCANCELADO === 'False' ? 'blue' : 'red' }}>
          {row.STCANCELADO === 'False' ? 'Ativo' : 'Cancelado'}
        </th>
      ),
      sortable: true,
    },

  ]

  const footerGroup = (
    <ColumnGroup>

      <Row> 
        <Column footer="Total Lançamentos" colSpan={3} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={calcularTotalValor()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={""} colSpan={4}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}/>
      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Despesas da Loja</h2>
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
            title="Lista de Despesas da Loja"
            value={dados}
            size="small"
            footerColumnGroup={footerGroup}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
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
            {colunasDespesas.map(coluna => (
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