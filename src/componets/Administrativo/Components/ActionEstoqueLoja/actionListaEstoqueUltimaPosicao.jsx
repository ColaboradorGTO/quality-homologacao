import React, { Fragment,  useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaEstoqueUltimaPosicao = ({ dadosEstoqueUltima }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
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
    documentTitle: 'última Posição Estoque',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Movimento', 'ID Loja', 'Loja', 'ID Produto', 'Produto', 'Cod. Barras', 'UND', 'ST Estoque', 'Estoque', 'Custo', 'Venda', 'Data Movimento']],
      body: dados.map(item => [
        item.contador,
        item.IDINVMOVIMENTO,
        item.IDEMPRESA,
        item.NOFANTASIA,
        item.IDPRODUTO,
        item.DSPRODUTO,
        item.NUCODBARRAS,
        item.UND,
        item.QTDFINAL,
        item.QTDFINAL,
        item.PRECOCUSTO,
        item.PRECOVENDA,
        item.DTMOVIMENTOFORMATADO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('ultima_posicao_estoque.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Movimento', 'ID Loja', 'Loja', 'ID Produto', 'Produto', 'Cod. Barras', 'UND', 'ST Estoque', 'Estoque', 'Custo', 'Venda', 'Data Movimento'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' }, 
      { wpx: 100, caption: 'ID Movimento' },
      { wpx: 100, caption: 'ID Loja' },
      { wpx: 150, caption: 'Loja' },
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 150, caption: 'Produto' },
      { wpx: 150, caption: 'Cod. Barras' },
      { wpx: 100, caption: 'UND' },
      { wpx: 100, caption: 'ST Estoque' },
      { wpx: 100, caption: 'Estoque' },
      { wpx: 100, caption: 'Custo' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 100, caption: 'Data Movimento' },
    ]; 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'última Posição Estoque');
    XLSX.writeFile(workbook, 'ultima_posicao_estoque.xlsx');
  };


  const dados = dadosEstoqueUltima.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDINVMOVIMENTO: item.IDINVMOVIMENTO,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      IDPRODUTO: item.IDPRODUTO,
      DSPRODUTO: item.DSPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      UND: item.UND,
      QTDFINAL: parseFloat(item.QTDFINAL),
      PRECOCUSTO: item.PRECOCUSTO,
      PRECOVENDA: item.PRECOVENDA,
      DTMOVIMENTOFORMATADO: item.DTMOVIMENTOFORMATADO,

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

  const  calcularEstoque = () => {
    const totalDinheiro = calcularTotal('QTDFINAL');
    const totalVendas = calcularTotalPagina('QTDFINAL');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };

  const  calcularCusto = () => {
    const totalDinheiro = calcularTotal('PRECOCUSTO');
    const totalVendas = calcularTotalPagina('PRECOCUSTO');
    return `${formatMoeda(totalDinheiro)}   (${formatMoeda(totalVendas)} total)`;
  };
  const  calcularVenda = () => {
    const totalDinheiro = calcularTotal('PRECOVENDA');
    const totalVendas = calcularTotalPagina('PRECOVENDA');
    return `${formatMoeda(totalDinheiro)}   (${formatMoeda(totalVendas)} total)`;
  };

  const colunasEstoqueRotatividade = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'IDINVMOVIMENTO',
      header: 'ID Movimento',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.IDINVMOVIMENTO}</th>,
      sortable: true
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Loja',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.IDEMPRESA}</th>,
      sortable: true
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'IDPRODUTO',
      header: 'ID Produto',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}> {row.IDPRODUTO} </th>,
      sortable: true
    },
    {
      field: 'DSPRODUTO',
      header: ' Produto',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}> {row.DSPRODUTO} </th>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.NUCODBARRAS} </th>,
      sortable: true
    },
    {
      field: 'UND',
      header: 'UND',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.UND}</th>,
      sortable: true
    },
    {
      field: 'QTDFINAL',
      header: 'Estoque',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.QTDFINAL}</th>,
      footer: calcularEstoque(),
      sortable: true
    },
    {
      field: 'PRECOCUSTO',
      header: 'Custo',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{formatMoeda(row.PRECOCUSTO)}</th>,
      footer: calcularCusto(),
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'Venda',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{formatMoeda(row.PRECOVENDA)}</th>,
      footer: calcularVenda(),
      sortable: true
    },
    {
      field: 'DTMOVIMENTOFORMATADO',
      header: 'Data Movimento ',
      body: row => <th style={{ color: '#000', fontWeight: 600 }}>{row.DTMOVIMENTOFORMATADO}</th>,
      sortable: true
    },
  ]

  const footerGroup = (
    <ColumnGroup>

      <Row> 
        <Column footer="Total " colSpan={8} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer={calcularEstoque()}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={calcularCusto()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={calcularVenda()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} /> 
        <Column footer={""}   footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}/>
      </Row>
    </ColumnGroup>
  )
  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Última Posição Estoque</h2>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            first={first}
            rows={rows}
            onPage={onPageChange}
            rowsPerPageOptions={[2,5, 10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasEstoqueRotatividade.map(coluna => (
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
