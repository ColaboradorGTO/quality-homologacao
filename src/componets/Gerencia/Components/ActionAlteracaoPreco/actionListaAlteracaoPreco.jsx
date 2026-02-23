import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { dataFormatada, dataHoraFormatada } from "../../../../utils/dataFormatada";

export const ActionListaAlteracaoPreco = ({ dadosAlteracaoPreco }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Alteração de Preços',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Data', 'Nº Alteração', 'Grupo', 'SubGrupo', 'Produto', 'Código', 'Código Barras', 'Estoque', 'Preço Anterior', 'Preço Atual', 'Dif(R$)', 'Valor Anterior', 'Valor Atual', 'Dif(R$)', 'Dif(%)'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Data' },
      { wpx: 100, caption: 'Nº Alteração' },
      { wpx: 100, caption: 'Grupo' },
      { wpx: 100, caption: 'SubGrupo' },
      { wpx: 300, caption: 'Produto' },
      { wpx: 100, caption: 'Código' },
      { wpx: 100, caption: 'Código Barras' },
      { wpx: 70, caption: 'Estoque' },
      { wpx: 70, caption: 'Preço Anterior' },
      { wpx: 70, caption: 'Preço Atual' },
      { wpx: 70, caption: 'Dif(R$)' },
      { wpx: 100, caption: 'Valor Anterior' },
      { wpx: 100, caption: 'Valor Atual' },
      { wpx: 100, caption: 'Dif(R$)' },
      { wpx: 100, caption: 'Dif(%)' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alteração de Preços');
    XLSX.writeFile(workbook, 'alteracao_preco.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data', 'Nº Alteração', 'Grupo', 'SubGrupo', 'Produto', 'Código', 'Código Barras', 'Estoque', 'Preço Anterior', 'Preço Atual', 'Dif(R$)', 'Valor Anterior', 'Valor Atual', 'Dif(R$)', 'Dif(%)']],
      body: dados.map(item => [
        item.DTHORAEXECUTADO,
        item.IDRESUMOALTERACAOPRECOPRODUTO,
        `${item.IDGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`,
        item.DSSUBGRUPOESTRUTURA,
        item.DSNOME,
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.QTDFINAL,
        formatMoeda(item.PRECOVENDAANTERIOR),
        formatMoeda(item.PRECOVENDA),
        formatMoeda(item.diferencaPreco),
        formatMoeda(item.valorAnterior),
        formatMoeda(item.valorAtual),
        formatMoeda(item.diferencaValor),
        item.diferencaPercentual

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('alteracao_preco.pdf');
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
  const dadosExcel = Array.isArray(dadosAlteracaoPreco) ? dadosAlteracaoPreco.map((item, index) => {
    let contador = index + 1;

    const diferencaPreco = calcularDiferencaPreco(item);
    const valorAnterior = calcularValorAnterior(item);
    const valorAtual = toFloat(item.PRECOVENDA) * toFloat(item.QTDFINAL);
    const diferencaValor = valorAtual - valorAnterior;
    const diferencaPercentual = (toFloat(valorAtual) - toFloat(valorAnterior)) / toFloat(valorAnterior) * 100;
    const somaDiferencaPercentual = toFloat(diferencaPercentual) * toFloat(item.QTDFINAL)


    return {
      DTHORAEXECUTADO: dataFormatada(item.DTHORAEXECUTADO),
      IDRESUMOALTERACAOPRECOPRODUTO: item.IDRESUMOALTERACAOPRECOPRODUTO,
      IDGRUPOESTRUTURA: `${item.IDGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`,
      DSGRUPOESTRUTURA: item.DSGRUPOESTRUTURA,
      DSNOME: item.DSNOME,
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      QTDFINAL: toFloat(item.QTDFINAL),
      PRECOVENDAANTERIOR: toFloat(item.PRECOVENDAANTERIOR),
      PRECOVENDA: toFloat(item.PRECOVENDA),
      diferencaPreco: diferencaPreco,
      valorAnterior: toFloat(valorAnterior),
      valorAtual: toFloat(valorAtual),
      diferencaValor: toFloat(diferencaValor),
      diferencaPercentual: formatarPorcentagem(diferencaPercentual),


    }
  }) : [];

  const dados = Array.isArray(dadosAlteracaoPreco) ? dadosAlteracaoPreco.map((item, index) => {
    let contador = index + 1;

    const diferencaPreco = calcularDiferencaPreco(item);
    const valorAnterior = calcularValorAnterior(item);
    const valorAtual = toFloat(item.PRECOVENDA) * toFloat(item.QTDFINAL);
    const diferencaValor = valorAtual - valorAnterior;
    const diferencaPercentual = (toFloat(valorAtual) - toFloat(valorAnterior)) / toFloat(valorAnterior) * 100;
    const somaDiferencaPercentual = toFloat(diferencaPercentual) * toFloat(item.QTDFINAL)


    return {
      DTHORAEXECUTADO: item.DTHORAEXECUTADO,
      IDRESUMOALTERACAOPRECOPRODUTO: item.IDRESUMOALTERACAOPRECOPRODUTO,
      IDGRUPOESTRUTURA: `${item.IDGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`,
      DSGRUPOESTRUTURA: item.DSGRUPOESTRUTURA,
      DSNOME: item.DSNOME,
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      QTDFINAL: toFloat(item.QTDFINAL),
      PRECOVENDAANTERIOR: toFloat(item.PRECOVENDAANTERIOR),
      PRECOVENDA: toFloat(item.PRECOVENDA),
      diferencaPreco: diferencaPreco,
      valorAnterior: toFloat(valorAnterior),
      valorAtual: toFloat(valorAtual),
      diferencaValor: toFloat(diferencaValor),
      diferencaPercentual: formatarPorcentagem(diferencaPercentual),
      somaDiferencaPercentual: toFloat(somaDiferencaPercentual),
      contador,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
    }
  }) : [];

  const calcularEstoque = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.QTDFINAL), 0);
  }

  const calcularTotalPrecoAnterior = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.PRECOVENDAANTERIOR), 0);
  }

  const calcularTotalPrecoAtual = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.PRECOVENDA), 0);
  }

  const calcularTotalDiferencaPreco = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.diferencaPreco), 0);
  }

  const calcularTotalValorAnterior = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.valorAnterior), 0);
  }

  const calcularTotalValorAtual = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.valorAtual), 0);
  }

  const calcularTotalDiferencaValor = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.diferencaValor), 0);
  }

  const calcularTotalDiferencaPercentual = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.diferencaPercentual), 0);
  }
  const calcularTotalSomaDiferencaPercentual = () => {
    return dados.reduce((total, dados) => total + parseFloat(dados.somaDiferencaPercentual), 0);
  }

  const calcularTotalPercentual = () => {
    return calcularTotalSomaDiferencaPercentual() / calcularEstoque();
  }

  const colunasAlteracaoPreco = [
    {
      field: 'DTHORAEXECUTADO',
      header: 'Data',
      body: row => <p style={{margin: '0px', fontWeight: 600, width: '170px'}}>{dataHoraFormatada(row.DTHORAEXECUTADO)}</p>,
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
      body: row => <th> {row.IDGRUPOESTRUTURA} </th>,
      sortable: true,
    },
    {
      field: 'DSGRUPOESTRUTURA',
      header: 'Sub Grupo',
      body: row => <th>{row.DSGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{ margin: '0px', width: '200px', fontWeight: 600 }}>{row.DSNOME}</p>,
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
      footer: row => formatarPorcentagem(calcularTotalPercentual()),
      sortable: true,
    },
  ]

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total" colSpan={7} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={calcularEstoque()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalPrecoAnterior())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalPrecoAtual())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalDiferencaPreco())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalValorAnterior())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalValorAtual())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularTotalDiferencaValor())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatarPorcentagem(calcularTotalPercentual())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
      </Row>
    </ColumnGroup>
  )

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>
            Relatório Alteração Preços Produtos
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
            title="Alteração de Preços"
            value={dados}
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
            {colunasAlteracaoPreco.map(coluna => (
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