import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaVendasDigitais = ({ dadosVendasDigitais }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Vendedor',
  });

    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Filial', 'IdVenda', 'Data', 'Quantidade de Itens', 'Total de vendas R$', 'Nome vendedor']],
        body: dados.map(item => [
          item.filial,
          item.idVenda,
          item.dataVenda,
          item.totalQuantidadeDigital,
          item.totalVenda,
          item.nomeVendedor,
        ]),
        horizontalPageBreak: true,
        horizontalPageBreakBehaviour: 'immediately'
      });
      doc.save('vendas-digitais.pdf');
    };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Matrícula', 'Nome', 'QTD Produto', 'Valor Vendido', 'Voucher Recebido', 'Valor Liquido']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Filial' },
      { wpx: 200, caption: 'IdVenda' },
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'Quantidade de Itens' },
      { wpx: 100, caption: 'Total de vendas R$' },
      { wpx: 100, caption: 'Nome vendedor' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Digitais');
    XLSX.writeFile(workbook, 'vendas-digitais.xlsx');
  };

  const dados = dadosVendasDigitais?.map((item, index) => {
    return {
      filial: item.filial,
      idVenda: item.idVenda,
      dataVenda: item.dataVenda,
      totalQuantidadeDigital: item.totalQuantidadeDigital,
      totalVenda: item.totalVenda,
      nomeVendedor: item.nomeVendedor,
    };
  });

  const colunasVendasDigitais = [
    {
      field: 'filial',
      header: 'Filial',
      body: row => <th >{row.filial}</th>,
      sortable: true,
    },
    {
      field: 'idVenda',
      header: 'IdVenda',
      body: row => <th >{row.idVenda}</th>,
      sortable: true,
    },
    {
      field: 'dataVenda',
      header: 'Data',
      body: row => <th >{row.dataVenda} </th>,
      sortable: true,
    },
    {
      field: 'totalQuantidadeDigital',
      header: 'Quantidade de Itens',
      body: row => <th>{row.totalQuantidadeDigital}</th>,
      sortable: true,
    },
    {
      field: 'totalVenda',
      header: 'Total de vendas R$',
      body: row => <th>{row.totalVenda}</th>,
      sortable: true,
    },
    {
      field: 'nomeVendedor',
      header: 'Nome vendedor',
      body: row => <th>{row.nomeVendedor}</th>,
      sortable: true,
    },
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas por Vendedor</h2>
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
            title="Vendas por Vendedor"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasVendasDigitais.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.9rem' }}

              />
            ))}

          </DataTable>
        </div>
      </div>

    </Fragment>
  )
}