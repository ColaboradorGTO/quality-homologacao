import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaEstoqueAtual = ({ dadosEstoqueAtual }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
    
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  }  

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Estoque Atual',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Loja', 'Loja','ID Produto', 'Cod. Barra', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %']],
      body: dados.map(item => [
        item.contador,
        item.IDEMPRESA,
        item.NOFANTASIA,
        item.IDPRODUTO,
        item.SKUVTEX,
        item.NUCODBARRAS,
        item.DSPRODUTO,
        item.IDRAZAO_SOCIAL_FORNECEDOR,
        item.RAZAO_SOCIAL_FORNECEDOR,
        item.QTDFINAL,
        item.PRECOCUSTO,
        item.PRECOVENDA,
        item.totalCusto,
        item.totalVenda,
        formatarPorcentagem(item.markup),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('estoque_atual.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Loja', 'Loja', 'ID Produto', 'SKU Vtex', 'Cod. Barra', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' }, 
      { wpx: 50, caption: 'ID Loja' },
      { wpx: 150, caption: 'Loja' },
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 100, caption: 'SKU Vtex' },
      { wpx: 100, caption: 'Cod. Barra' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 150, caption: 'Fornecedor' },
      { wpx: 50, caption: 'Estoque' },
      { wpx: 100, caption: 'Custo' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 100, caption: 'Total Custo' },
      { wpx: 100, caption: 'Total Venda' },
      { wpx: 50, caption: 'Markup %' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque Atual');
    XLSX.writeFile(workbook, 'estoque_atual.xlsx');
  };

  const dados = dadosEstoqueAtual.map((item, index) => {
    let contador = index + 1;

    const totalCusto = (parseFloat(item.QTDFINAL) * parseFloat(item.PRECOCUSTO))
    const totalVenda = (parseFloat(item.QTDFINAL) * parseFloat(item.PRECOVENDA))
    const markup = parseFloat(((parseFloat(item.PRECOVENDA) * 100) / parseFloat(item.PRECOCUSTO)) - 100)

    return {
      contador,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      IDPRODUTO: item.IDPRODUTO,
      SKUVTEX: item.SKUVTEX,
      NUCODBARRAS: item.NUCODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      IDRAZAO_SOCIAL_FORNECEDOR: item.IDRAZAO_SOCIAL_FORNECEDOR,
      RAZAO_SOCIAL_FORNECEDOR: item.RAZAO_SOCIAL_FORNECEDOR,
      QTDFINAL: item.QTDFINAL,
      PRECOCUSTO: formatMoeda(item.PRECOCUSTO),
      PRECOVENDA: formatMoeda(item.PRECOVENDA),
      totalCusto: totalCusto,
      totalVenda: totalVenda,
      markup: formatarPorcentagem(markup),
    }
  });


  const calcularTotalPagina = (field) => {
    return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
  };
  const calcularTotal = (field) => {
    const firstIndex = first * rows;
    const lastIndex = firstIndex + rows;
    const dataPaginada = dados.slice(firstIndex, lastIndex); 
    return dataPaginada.reduce((total, item) => total + toFloat(item[field] || 0), 0);
  };

  const calcularEstoque = () => {
    const totalDinheiro = calcularTotal('QTDFINAL');
    const totalVendas = calcularTotalPagina('QTDFINAL');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const calcularTotalCusto = () => {
    const totalDinheiro = calcularTotal('totalCusto');
    const totalVendas = calcularTotalPagina('totalCusto');
    return `${formatMoeda(totalDinheiro)}   (${formatMoeda(totalVendas)} total)`;
  };
  const calcularTotalVenda = () => {
    const totalDinheiro = calcularTotal('totalVenda');
    const totalVendas = calcularTotalPagina('totalVenda');
    return `${formatMoeda(totalDinheiro)}   (${formatMoeda(totalVendas)} total)`;
  };
 

  const colunasEstoqueAtual = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{fontSize: '13px' }}>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Loja',
      body: row => <th style={{fontSize: '13px' }}>{row.IDEMPRESA}</th>,
      sortable: true
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{fontSize: '13px', width: '200px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true
    },
    {
      field: 'IDPRODUTO',
      header: 'ID Produto',
      body: row => <th style={{ fontSize: '13px' }}>{row.IDPRODUTO}</th>,
      sortable: true
    },
    {
      field: 'SKUVTEX',
      header: 'SKU Vtex',
      body: row => <th style={{ fontSize: '13px' }}>{row.SKUVTEX}</th>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th style={{ fontSize: '13px' }}>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <p style={{ fontSize: '13px', width: '300px', fontWeight: 600  }}>{row.DSPRODUTO}</p>,
      sortable: true
    },
    {
      field: 'IDRAZAO_SOCIAL_FORNECEDOR',
      header: 'Fornecedor',
      body: row => <p style={{ fontSize: '13px', width: '300px', fontWeight: 600  }}>{`${row.IDRAZAO_SOCIAL_FORNECEDOR} - ${row.RAZAO_SOCIAL_FORNECEDOR}`}</p>,
      sortable: true
    },
    {
      field: 'QTDFINAL',
      header: 'Estoque',
      body: row => <th style={{ fontSize: '13px' }}>{row.QTDFINAL}</th>,
      footer: calcularEstoque(),
      sortable: true
    },
    {
      field: 'PRECOCUSTO',
      header: 'Custo',
      body: row => <th style={{ fontSize: '13px' }}>{row.PRECOCUSTO}</th>,
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'Venda',
      body: row => <th style={{ fontSize: '13px' }}>{row.PRECOVENDA}</th>,
      sortable: true
    },
    {
      field: 'totalCusto',
      header: 'Total Custo',
      body: row => <th style={{ fontSize: '13px' }}>{formatMoeda(row.totalCusto)}</th>,
      footer: calcularTotalCusto(),
      sortable: true
    },
    {
      field: 'totalVenda',
      header: 'Total Venda',
      body: row => <th style={{ fontSize: '13px' }}>{formatMoeda(row.totalVenda)}</th>,
      footer: calcularTotalVenda(),
      sortable: true
    },
    {
      field: 'markup',
      header: 'Markup %',
      body: row => <th style={{ fontSize: '13px' }}>{row.markup}</th>,
      sortable: true
    },

  ]

  const footerGroup = (
    <ColumnGroup>

      <Row> 
        <Column footer="Total " colSpan={8} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer={calcularEstoque()}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer="" footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer="" footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer={calcularTotalCusto()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={calcularTotalVenda()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} /> 
        <Column footer={""} colSpan={3}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}/>
      </Row>
    </ColumnGroup>
  )
 

  return (


    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Estoque Atual</h2>
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
            title="Estoque Atual"
            value={dados} 
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
            first={first}
            rows={rows}
            onPage={onPageChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasEstoqueAtual.map(coluna => (
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
