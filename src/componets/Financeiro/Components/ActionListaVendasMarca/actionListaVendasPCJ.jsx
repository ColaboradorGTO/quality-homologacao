import React, { Fragment, useRef, useState } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";

export const ActionListaVendasPCJ = ({ dadosVendasPCJ }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Período - PCJ Marca',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Empresa', 'Nº Mov', 'Caixa', 'Abertura', 'Operador', 'CPF', 'Total CredS 1-8', 'Total CredS 7-8', '% PCJ']],
      body: dados.map(item => [item.NOFANTASIA, item.ID, item.DSCAIXA, item.DTABERTURA, item.NOFUNCIONARIO, item.NUCPF, formatMoeda(item.TOTALPCJ18), formatMoeda(item.TOTALPCJ78), formatarPorcentagem(item.pcjTotal)]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_pcj.pdf');

  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Empresa', 'Nº Mov', 'Caixa', 'Abertura', 'Operador', 'CPF', 'Total CredS 1-8', 'Total CredS 7-8', '% PCJ'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Empresa', },
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 150, caption: 'Abertura' },
      { wpx: 250, caption: 'Operador' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Total CredS 1-8' },
      { wpx: 150, caption: 'Total CredS 7-8' },
      { wpx: 100, caption: '% PCJ' }];


    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Período - PCJ Marca');
    XLSX.writeFile(workbook, 'vendas_pcj.xlsx');
  };

  const calcularPCJ = (item) => {
    return (
      (toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ78) / toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ18)) * 100
    );
  };


  const dados = dadosVendasPCJ.map((item) => {
    const pcjTotal = calcularPCJ(item);
    return {

      NOFANTASIA: item.caixa.NOFANTASIA,
      ID: item.caixa.ID,
      DSCAIXA: item.caixa.DSCAIXA,
      DTABERTURA: item.caixa.DTABERTURA,
      NOFUNCIONARIO: item.caixa.NOFUNCIONARIO,
      NUCPF: item.caixa.NUCPF,
      TOTALPCJ18: toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ18),
      TOTALPCJ78: toFloat(item.vendapcj[0]['venda-pcj'].TOTALPCJ78),
      pcjTotal: toFloat(pcjTotal),
    
    };
  });

  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + toFloat(item[field]), 0);
  };

  const calcularTotalPCJ18 = () => {
    const total = calcularTotal('TOTALPCJ18');  
    return total;
  }

  const calcularTotalPCJ78 = () => {
    const total = calcularTotal('TOTALPCJ78');
    return total;
  }

  
  const calcularTotalPCJ = () => {
    const vrPCJ18 = calcularTotalPCJ18('TOTALPCJ18');
    const vrPCJ78 = calcularTotalPCJ78('TOTALPCJ78');
    const total = (vrPCJ78 / vrPCJ18) * 100;

    return parseFloat(total.toFixed(2));
  }

  const renderPcjTotal = (rowData) => {
    const pcjValue = toFloat(rowData.pcjTotal);
    const color = rowData.pcjTotal < 30 ? 'red' : 'blue';
    return <span style={{ color }}>{formatarPorcentagem(pcjValue)}</span>;
  };

  const colunaVendasPCJ = [
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: (row) => <th style={{ color: '#000' }}>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'ID',
      header: 'Nº Movimento',
      body: (row) => <th style={{ color: '#000' }}>{row.ID}</th>,
      sortable: true
    },
    {
      field: 'DSCAIXA',
      header: 'Caixa',
      body: (row) => <th style={{ color: '#000' }}>{row.DSCAIXA}</th>,
      sortable: true
    },
    {
      field: 'DTABERTURA',
      header: 'Abertura',
      body: (row) => <th style={{ color: '#000' }}>{row.DTABERTURA}</th>,
      sortable: true
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: (row) => <th style={{ color: '#000' }}>{row.NOFUNCIONARIO}</th>,
      sortable: true
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: (row) => <th style={{ color: '#000' }}>{row.NUCPF}</th>,
      footer: 'Total',
      sortable: true
    },
    {
      field: 'TOTALPCJ18',
      header: 'Total CredS 1-8',
      body: (row) => <th style={{ color: '#000' }}>{formatMoeda(row.TOTALPCJ18)}</th>,
      footer: formatMoeda(calcularTotalPCJ18()),
      sortable: true
    },
    {
      field: 'TOTALPCJ78',
      header: 'Total CredS 7-8',
      body: (row) => <th style={{ color: '#000' }}>{formatMoeda(row.TOTALPCJ78)}</th>,
      footer: formatMoeda(calcularTotalPCJ78()),
      sortable: true
    },
    {
      field: 'pcjTotal',
      header: '% PCJ',
      body: renderPcjTotal,
      footer: formatarPorcentagem(calcularTotalPCJ()),
      sortable: true
    },
  ];

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Vendas Por Período - PCJ <span className="fw-300">Por Marca</span></h2>
        </div>

        <div style={{ marginBottom: "1rem" }}>
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
            title="Lista de Vendas Por Período - PCJ Por Marca"
            value={dados}
            globalFilter={globalFilterValue}
            size={"small"}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            totalRecords={dados.length}
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            showGridlines
            stripedRows
          >
            {colunaVendasPCJ.map((coluna) => (
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
  );
};
