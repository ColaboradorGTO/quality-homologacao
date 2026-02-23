import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { dataFormatada } from "../../../../utils/dataFormatada";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';


export const ActionListaAlteracaoPreco = ({ dadosAlteracaoPreco }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Balanco por Loja',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Data Abertura', 'Data Fechamento', 'Estoque Atual', 'Contagem', 'Diferença', 'Status']],
      body: dados.map(item => [

        item.IDEMPRESA,
        item.NOFANTASIA,
        item.DTABERTURA,
        item.DTFECHAMENTO,
        item.QTDTOTALANTERIOR,
        item.QTDTOTALCONTAGEM,
        item.diferenca,
        item.STCONCLUIDO == 'False' ? 'Concluído' : 'Em Aberto',

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('balanco_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Data Abertura', 'Data Fechamento', 'Estoque Atual', 'Contagem', 'Diferença', 'Status'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 150, caption: 'Empresa' },
      { wpx: 150, caption: 'Data Abertura' },
      { wpx: 150, caption: 'Data Fechamento' },
      { wpx: 150, caption: 'Estoque Atual' },
      { wpx: 150, caption: 'Contagem' },
      { wpx: 150, caption: 'Diferença' },
      { wpx: 150, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Balanco por Loja');
    XLSX.writeFile(workbook, 'balanco_loja.xlsx');
  };

  const calcularDiferencaPreco = (item) => {
    return (
      toFloat(item.PRECOVENDA) - toFloat(item.PRECOVENDAANTERIOR)
    );
  }

  const calcularValorAnterior = (item) => {
    return (
      toFloat(item.PRECOVENDAANTERIOR) * toFloat(item.QTDFINAL)
    );
  }
  const dados = Array.isArray(dadosAlteracaoPreco) ? dadosAlteracaoPreco.map((item, index) => {
    let contador = index + 1;

    const diferencaPreco = calcularDiferencaPreco(item);
    const valorAnterior = calcularValorAnterior(item);
    const valorAtual = toFloat(item.PRECOVENDA) * toFloat(item.QTDFINAL);
    const diferencaValor = valorAtual - valorAnterior;
    const diferencaPercentual = (toFloat(valorAtual) - toFloat(valorAnterior)) / toFloat(valorAnterior) * 100;
    const somaDiferencaPercentual = toFloat(diferencaPercentual) * toFloat(item.QTDFINAL)
    const mediaDiferencial = (toFloat(somaDiferencaPercentual) / toFloat(item.QTDFINAL).toFixed(2))

    return {
      IDRESUMOALTERACAOPRECOPRODUTO: item.IDRESUMOALTERACAOPRECOPRODUTO,
      DTHORAEXECUTADO: item.DTHORAEXECUTADO,
      IDGRUPOESTRUTURA: item.IDGRUPOESTRUTURA,
      DSGRUPOESTRUTURA: item.DSGRUPOESTRUTURA,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      DSNOME: item.DSNOME,
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      PRECOVENDAANTERIOR: toFloat(item.PRECOVENDAANTERIOR),
      PRECOVENDA: toFloat(item.PRECOVENDA),
      QTDFINAL: toFloat(item.QTDFINAL),
      diferencaPreco: diferencaPreco,
      valorAnterior: toFloat(valorAnterior),
      valorAtual: toFloat(valorAtual),
      diferencaValor: toFloat(diferencaValor),
      diferencaPercentual: formatarPorcentagem(diferencaPercentual),
      somaDiferencaPercentual: toFloat(somaDiferencaPercentual).toFixed(2),
      mediaDiferencial: mediaDiferencial,
      contador
    }
  }) : [];

  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
  };

  const calcularEstoque = () => {
    const total = calcularTotal('QTDFINAL');
    return total;
  }
  const calcularTotalPrecoAnterior = () => {
    const total = calcularTotal('PRECOVENDAANTERIOR');
    return total;
  }
  const calcularTotalPrecoAtual = () => {
    const total = calcularTotal('PRECOVENDA');
    return total;
  }
  const calcularTotalDiferencaPreco = () => {
    const total = calcularTotal('diferencaPreco');
    return total;
  }
  const calcularTotalValorAnterior = () => {
    const total = calcularTotal('valorAnterior');
    return total;
  }
  const calcularTotalValorAtual = () => {
    const total = calcularTotal('valorAtual');
    return total;
  }
  const calcularTotalDiferencaValor = () => {
    const total = calcularTotal('diferencaValor');
    return total;
  }
  const calcularTotalMedia = () => {
    const totalPercentual = calcularTotal('somaDiferencaPercentual');
    const totalEstoque = calcularTotal('QTDFINAL');
    const total = parseFloat(totalPercentual) / parseFloat(totalEstoque).toFixed(2);
    return formatarPorcentagem(total);
  }



  const colunasAlteracaoPreco = [
    {
      field: 'DTHORAEXECUTADO',
      header: 'Data',
      body: row => <th>{dataFormatada(row.DTHORAEXECUTADO)}</th>,
      sortable: true,
    },
    {
      field: 'IDRESUMOALTERACAOPRECOPRODUTO',
      header: 'Nº Alteração',
      body: row => <th>{row.IDRESUMOALTERACAOPRECOPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'IDGRUPOESTRUTURA',
      header: 'Grupo',
      body: row => <th> {row.IDGRUPOESTRUTURA} - {row.DSGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Sub Grupo',
      body: row => <p style={{ width: '150px', margin: '0px', fontWeight: 600 }}>{row.DSSUBGRUPOESTRUTURA}</p>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{ width: '200px', margin: '0px', fontWeight: 600 }}>{row.DSNOME}</p>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'Código',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'QTDFINAL',
      header: 'Estoque',
      body: row => <th>{row.QTDFINAL}</th>,
      footer: row => calcularEstoque(),
      sortable: true,
    },
    {
      field: 'PRECOVENDAANTERIOR',
      header: 'Preço Anterior',
      body: row => <th>{formatMoeda(row.PRECOVENDAANTERIOR)}</th>,
      footer: row => formatMoeda(calcularTotalPrecoAnterior()),
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'Preço Atual',
      body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
      footer: row => formatMoeda(calcularTotalPrecoAtual()),
      sortable: true,
    },
    {
      field: 'diferencaPreco',
      header: 'Dif(R$)',
      body: row => <th>{formatMoeda(row.diferencaPreco)}</th>,
      footer: row => formatMoeda(calcularTotalDiferencaPreco()),
      sortable: true,
    },
    {
      field: 'valorAnterior',
      header: 'Valor Anterior',
      body: row => <th>{formatMoeda(row.valorAnterior)}</th>,
      footer: row => formatMoeda(calcularTotalValorAnterior()),
      sortable: true,
    },
    {
      field: 'valorAtual',
      header: 'Valor Atual',
      body: row => <th>{formatMoeda(row.valorAtual)}</th>,
      footer: row => formatMoeda(calcularTotalValorAtual()),
      sortable: true,
    },
    {
      field: 'diferencaValor',
      header: 'Dif(R$)',
      body: row => <th>{formatMoeda(row.diferencaValor)}</th>,
      footer: row => formatMoeda(calcularTotalDiferencaValor()),
      sortable: true,
    },
    {
      field: 'diferencaPercentual',
      header: 'Dif(%)',
      body: row => <th>{row.diferencaPercentual}</th>,
      footer: <th>{calcularTotalMedia()}</th>,
      sortable: true,
    },
  ]



  return (

    <Fragment>
      <div id="panel-1" className="panel" >
        <div className="panel-hdr">
          <h2 >
            Lista de Alteração de Preço
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
              title="Alteração de Preço"
              value={dados}
              size="small"
              globalFilter={globalFilterValue}
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
              filterDisplay="menu"
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasAlteracaoPreco.map(coluna => (
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


