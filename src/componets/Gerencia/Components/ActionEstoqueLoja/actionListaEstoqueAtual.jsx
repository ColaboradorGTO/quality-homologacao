import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";

export const ActionListaEstoqueAtual = ({ dadosEstoqueAtual }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

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
      head: [['Nº', 'Cod Barras', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %']],
      body: dados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSPRODUTO,
        `${item.IDRAZAO_SOCIAL_FORNECEDOR} - ${item.RAZAO_SOCIAL_FORNECEDOR}`,
        item.QTDFINAL,
        formatMoeda(item.PRECOCUSTO),
        formatMoeda(item.PRECOVENDA),
        formatMoeda(item.totalCusto),
        formatMoeda(item.totalVenda),
        item.markup
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('estoque_atual.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Cod Barras', 'Produto', 'Fornecedor', 'Estoque', 'Custo', 'Venda', 'Total Custo', 'Total Venda', 'Markup %'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Cod Barras' },
      { wpx: 200, caption: 'Produto' },
      { wpx: 200, caption: 'Fornecedor' },
      { wpx: 100, caption: 'Estoque' },
      { wpx: 100, caption: 'Custo' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 100, caption: 'Total Custo' },
      { wpx: 100, caption: 'Total Venda' },
      { wpx: 100, caption: 'Markup %' }
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
      NUCODBARRAS: item.NUCODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      IDRAZAO_SOCIAL_FORNECEDOR: item.IDRAZAO_SOCIAL_FORNECEDOR,
      RAZAO_SOCIAL_FORNECEDOR: item.RAZAO_SOCIAL_FORNECEDOR,
      QTDFINAL: item.QTDFINAL,
      PRECOCUSTO: item.PRECOCUSTO,
      PRECOVENDA: item.PRECOVENDA,
      NOFANTASIA: item.NOFANTASIA,

      DATAMOVIMENTO: item.DATAMOVIMENTO,
      QTDINICIO: item.QTDINICIO,
      QTDENTRADA: item.QTDENTRADA,
      QTDENTRADAVOUCHER: item.QTDENTRADAVOUCHER,
      QTDSAIDA: item.QTDSAIDA,
      QTDSAIDATRANSFERENCIA: item.QTDSAIDATRANSFERENCIA,
      QTDRETORNOAJUSTEPEDIDO: item.QTDRETORNOAJUSTEPEDIDO,
      QTDAJUSTEBALANCO: item.QTDAJUSTEBALANCO,
      QTDENTRADAECOMMERCE: item.QTDENTRADAECOMMERCE,
      QTDSAIDAECOMMERCE: item.QTDSAIDAECOMMERCE,
      totalCusto: totalCusto,
      totalVenda: totalVenda,
      markup: formatarPorcentagem(markup),
      contador
    }
  });

  const calcularEstoque = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.QTDFINAL), 0);
  }

  const calcularTotalCusto = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.totalCusto), 0);
  }

  const calcularTotalVenda = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.totalVenda), 0);
  }

  const colunasEstoqueAtual = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'Loja',
      header: 'Loja',
      body: row => <th style={{ color: 'blue' }}>{row.NOFANTASIA}</th>,
      sortable: true
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th style={{ color: 'blue' }}>{row.NUCODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <th style={{ color: 'blue' }}>{row.DSPRODUTO}</th>,
      sortable: true
    },
    {
      field: 'IDRAZAO_SOCIAL_FORNECEDOR',
      header: 'Fornecedor',
      body: row => <th style={{ color: 'blue' }}>{`${row.IDRAZAO_SOCIAL_FORNECEDOR} - ${row.RAZAO_SOCIAL_FORNECEDOR}`}</th>,
      sortable: true
    },
    {
      field: 'QTDFINAL',
      header: 'Estoque',
      body: row => <th style={{ color: 'blue' }}>{row.QTDFINAL}</th>,
      footer: calcularEstoque(),
      sortable: true
    },
    {
      field: 'PRECOCUSTO',
      header: 'Custo',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.PRECOCUSTO)}</th>,
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'Venda',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true
    },
    {
      field: 'totalCusto',
      header: 'Total Custo',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.totalCusto)}</th>,
      footer: formatMoeda(calcularTotalCusto()),
      sortable: true
    },
    {
      field: 'totalVenda',
      header: 'Total Venda',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.totalVenda)}</th>,
      footer: formatMoeda(calcularTotalVenda()),
      sortable: true
    },
    {
      field: 'markup',
      header: 'Markup %',
      body: row => <th style={{ color: 'blue' }}>{row.markup}</th>,
      sortable: true
    },

  ]

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total " colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={calcularEstoque()} colSpan={1} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalCusto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalVenda())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={""} colSpan={3} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
      </Row>
    </ColumnGroup>
  )


  return (

    <Fragment>
      <div className="panel" >
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
            size="small"
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            footerColumnGroup={footerGroup}
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
            {colunasEstoqueAtual.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}

          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}
