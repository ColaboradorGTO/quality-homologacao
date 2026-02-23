import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "react-bootstrap";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaEstoqueRotatividade = ({ dadosEstoqueRotatividade }) => {
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
    documentTitle: 'Rotatividade Estoque',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto','Data Movimento', 'QTD início', 'QTD Entrada', 'QTD Entrada Voucher', 'QTD Saída', 'QTD Saída Transf', 'QTD AJuste Balanço', 'QTD Final']],
      body: dados.map(item => [
        item.NUCODBARRAS,
        item.DSPRODUTO,
        item.PRECOCUSTO,
        item.PRECOVENDA,
        dataFormatada(item.DATAMOVIMENTO),
        parseFloat(item.QTDINICIO),
        parseFloat(item.QTDENTRADA),
        parseFloat(item.QTDENTRADAVOUCHER),
        parseFloat(item.QTDSAIDA),
        parseFloat(item.QTDSAIDATRANSFERENCIA),
        parseFloat(item.QTDRETORNOAJUSTEPEDIDO),
        parseFloat(item.QTDAJUSTEBALANCO),
        parseFloat(item.QTDFINAL),,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('estoque_rotatividade.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExecell);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Data Movimento', 'QTD início', 'QTD Entrada', 'QTD Entrada Voucher', 'QTD Saída', 'QTD Saída Transf', 'QTD AJuste Balanço', 'QTD Final'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'ID Produto' },
      { wpx: 100, caption: 'Data Movimento' },
      { wpx: 100, caption: 'QTD início' },
      { wpx: 100, caption: 'QTD Entrada' },
      { wpx: 100, caption: 'QTD Entrada Voucher' },
      { wpx: 100, caption: 'QTD Saída' },
      { wpx: 100, caption: 'QTD Saída Transf' },
      { wpx: 100, caption: 'QTD AJuste Balanço' },
      { wpx: 100, caption: 'QTD Final' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rotatividade Estoque');
    XLSX.writeFile(workbook, 'estoque_rotatividade.xlsx');
  };

  const dadosExecell = dadosEstoqueRotatividade.map((item, index) => {
    return {
  
      produto: JSON.stringify({
        NUCODBARRAS: item.NUCODBARRAS,
        DSPRODUTO: item.DSPRODUTO,
        PRECOCUSTO: item.PRECOCUSTO,
        PRECOVENDA: item.PRECOVENDA,
      }),
      DATAMOVIMENTO: dataFormatada(item.DATAMOVIMENTO),
      QTDINICIO: parseFloat(item.QTDINICIO),
      QTDENTRADA: parseFloat(item.QTDENTRADA),
      QTDENTRADAVOUCHER: parseFloat(item.QTDENTRADAVOUCHER),
      QTDSAIDA: parseFloat(item.QTDSAIDA),
      QTDSAIDATRANSFERENCIA: parseFloat(item.QTDSAIDATRANSFERENCIA),
      QTDRETORNOAJUSTEPEDIDO: parseFloat(item.QTDRETORNOAJUSTEPEDIDO),
      QTDAJUSTEBALANCO: parseFloat(item.QTDAJUSTEBALANCO),
      QTDFINAL: parseFloat(item.QTDFINAL),
    }
  })
  const dados = dadosEstoqueRotatividade.map((item, index) => {
 
    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      PRECOCUSTO: item.PRECOCUSTO,
      PRECOVENDA: item.PRECOVENDA,
      DATAMOVIMENTO: dataFormatada(item.DATAMOVIMENTO),
      QTDINICIO: parseFloat(item.QTDINICIO),
      QTDENTRADA: parseFloat(item.QTDENTRADA),
      QTDENTRADAVOUCHER: parseFloat(item.QTDENTRADAVOUCHER),
      QTDSAIDA: parseFloat(item.QTDSAIDA),
      QTDSAIDATRANSFERENCIA: parseFloat(item.QTDSAIDATRANSFERENCIA),
      QTDRETORNOAJUSTEPEDIDO: parseFloat(item.QTDRETORNOAJUSTEPEDIDO),
      QTDAJUSTEBALANCO: parseFloat(item.QTDAJUSTEBALANCO),
      QTDFINAL: parseFloat(item.QTDFINAL),
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

  const  calcularQtdEntrada = () => {
    const totalDinheiro = calcularTotal('QTDENTRADA');
    const totalVendas = calcularTotalPagina('QTDENTRADA');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const  calcularQtdEntradaVoucher = () => {
    const totalDinheiro = calcularTotal('QTDENTRADAVOUCHER');
    const totalVendas = calcularTotalPagina('QTDENTRADAVOUCHER');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const  calcularQtdSaida = () => {
    const totalDinheiro = calcularTotal('QTDSAIDA');
    const totalVendas = calcularTotalPagina('QTDSAIDA');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const  calcularQtdSaidaTransferencia = () => {
    const totalDinheiro = calcularTotal('QTDSAIDATRANSFERENCIA');
    const totalVendas = calcularTotalPagina('QTDSAIDATRANSFERENCIA');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const  calcularQtdRetornoAjustePedido = () => {
    const totalDinheiro = calcularTotal('QTDRETORNOAJUSTEPEDIDO');
    const totalVendas = calcularTotalPagina('QTDRETORNOAJUSTEPEDIDO');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };
  const  calcularQtdAjusteBalanco = () => {
    const totalDinheiro = calcularTotal('QTDAJUSTEBALANCO');
    const totalVendas = calcularTotalPagina('QTDAJUSTEBALANCO');
    return `${totalDinheiro}   (${totalVendas} total)`;
  };

  const headerGroup = (
    <ColumnGroup>
        <Row>
            <Column header="Product" rowSpan={3} />
            
        </Row>
        <Row>
            <Column header="Data Movimento" sortable field="DATAMOVIMENTO" />
            <Column header="QTD Início" sortable field="QTDINICIO" />
            <Column header="QTD Entrada" sortable field="QTDENTRADA" />
            <Column header="QTD Entrada Voucer" sortable field="QTDENTRADAVOUCHER" />
            <Column header="QTD Saída" sortable field="QTDSAIDA" />
            <Column header="QTD Saída Transferência" sortable field="QTDSAIDATRANSFERENCIA" />
            <Column header="QTD Ajuste Pedido" sortable field="QTDRETORNOAJUSTEPEDIDO" />
            <Column header="QTD Ajuste Balanço" sortable field="QTDAJUSTEBALANCO" />
            <Column header="QTD Final" sortable field="QTDFINAL" />
        </Row>
    </ColumnGroup>
);

  const colunasEstoqueRotatividade = [

    {
      field: 'DATAMOVIMENTO',
      header: 'Data Movimento',
      body: row => <th style={{  }}>{row.DATAMOVIMENTO}</th>,
      sortable: true
    },
    {
      field: 'QTDINICIO',
      header: 'QTD Início',
      body: row => <th style={{  }}>{row.QTDINICIO}</th>,

      sortable: true
    },
    {
      field: 'QTDENTRADA',
      header: 'QTD Entrada',
      body: row => <th style={{  }}>{row.QTDENTRADA}</th>,
      footer: calcularQtdEntrada(),
      sortable: true
    },
    {
      field: 'QTDENTRADAVOUCHER',
      header: 'QTD Entrada Voucher',
      body: row => <th style={{  }}>{row.QTDENTRADAVOUCHER}</th>,
      footer: calcularQtdEntradaVoucher(),
      sortable: true
    },
    {
      field: 'QTDSAIDA',
      header: 'QTD Saída',
      body: row => <th style={{  }}>{row.QTDSAIDA}</th>,
      footer: calcularQtdSaida(),
      sortable: true
    },
    {
      field: 'QTDSAIDATRANSFERENCIA',
      header: 'QTD Saída Transferência',
      body: row => <th style={{  }}>{row.QTDSAIDATRANSFERENCIA}</th>,
      footer: calcularQtdSaidaTransferencia(),
      sortable: true
    },
    {
      field: 'QTDRETORNOAJUSTEPEDIDO',
      header: 'QTD Ret. Ajuste Pedido',
      body: row => <th style={{  }}>{row.QTDRETORNOAJUSTEPEDIDO}</th>,
      footer: calcularQtdRetornoAjustePedido(),
      sortable: true
    },
    {
      field: 'QTDAJUSTEBALANCO',
      header: 'QTD Ajuste Balanço',
      body: row => <th style={{  }}>{row.QTDAJUSTEBALANCO}</th>,
      footer: calcularQtdAjusteBalanco(),
      sortable: true
    },
    {
      field: 'QTDFINAL',
      header: 'QTD Final',
      body: row => <th style={{  }}>{row.QTDFINAL}</th>,
      sortable: true
    },
  ]


  const HeaderTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2" style={{ alignContent: 'center' }}>
        <span className="font-bold" style={{fontWeight: 600}}>
          {`${rowData.NUCODBARRAS} - ${rowData.DSPRODUTO} / Custo R$ ${formatMoeda(rowData.PRECOCUSTO)}  - Venda R$ ${formatMoeda(rowData.PRECOVENDA)}`}
        </span>
      </div>
    );
  };

  
  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Rotatividade Estoque</h2>
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
            size={'small'}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            first={first}
            rows={rows}
            onPage={onPageChange}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            rowGroupMode="subheader"
            groupRowsBy="IDPRODUTO"
            sortMode="single"
            scrollable
            rowGroupHeaderTemplate={HeaderTemplate}
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
