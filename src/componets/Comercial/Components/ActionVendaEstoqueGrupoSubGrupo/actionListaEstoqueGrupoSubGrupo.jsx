import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaEstoqueVendaGrupoSubGrupo = ({ dadosGrupoSubGrupo }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);



  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Grupo Sub Grupo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Grupo Empresarial', 'Grupo', 'SunGrupo', 'Qtd. Peças Estoque', 'Qtd. Peças Vendidas', 'Estoque PV(R$)', 'Estoque PC(R$)', 'Markup 1', '(%) Estoque', 'Venda (R$)', 'Venda (%)', 'Cobertura']],
      body: dados.map(item => [
        item.contador,
        item.DSGRUPOEMPRESARIAL,
        item.GRUPO,
        item.SUBGRUPO,
        item.qtdPosicionamento,
        item.QTDVENDA,
        item.estoquePrecoVenda,
        item.estoquePrecoCusto,
        item.indicadorMarckup,
        item.percentualEstoquePrecoVenda,
        item.VRTOTALLIQUIDO,
        item.percentualPrecoVenda,
        item.cobertura,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_vendas_grupo_subgrupo.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Grupo Empresarial', 'Grupo', 'SunGrupo', 'Qtd. Peças Estoque', 'Qtd. Peças Vendidas', 'Estoque PV(R$)', 'Estoque PC(R$)', 'Markup 1', '(%) Estoque', 'Venda (R$)', 'Venda (%)', 'Cobertura'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 100, caption: 'Grupo Empresarial' },
      { wpx: 100, caption: 'Grupo' },
      { wpx: 100, caption: 'SubGrupo' },
      { wpx: 100, caption: 'Qtd. Peças Estoque' },
      { wpx: 100, caption: 'Qtd. Peças Vendidas' },
      { wpx: 100, caption: 'Estoque PV(R$)' },
      { wpx: 100, caption: 'Estoque PC(R$)' },
      { wpx: 100, caption: 'Markup 1' },
      { wpx: 100, caption: '(%) Estoque' },
      { wpx: 100, caption: 'Venda (R$)' },
      { wpx: 100, caption: 'Venda (%)' },
      { wpx: 100, caption: 'Cobertura' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Grupos SubGrupos');
    XLSX.writeFile(workbook, 'relatorio_vendas_grupo_subgrupo.xlsx');
  };

  const calcularValorPrecoMedioCusto = (item) => {
    return toFloat(item.vendaMarca.TOTALCUSTO).toFixed(2) / toFloat(item.vendaMarca.QTDVENDA)
  }

  const calcularValorPrecoMedioVenda = (item) => {
    return toFloat(item.vendaMarca.VRTOTALLIQUIDO).toFixed(2) / toFloat(item.vendaMarca.QTDVENDA)
  }

  const calcularTotalEstoqueData = (item) => {
    return (
      toFloat(item.posicaoEstoqueAtual.QTDESTOQUE) +
      toFloat(item.posicaoVouchersAtual.QTDVOUCHERS)
    )
  }

  const calcularTotalEstoqueAnterior = (item) => {
    return (
      toFloat(item.posicaoEstoqueAnterior.QTDESTOQUE) -
      toFloat(item.posicaoVendasAnterior.QTDVENDAS) +
      toFloat(item.posicaoVouchersAnterior.QTDVOUCHERS)
    )
  }

  const calcularMarckupProduto = (item) => {
    return (toFloat(item.vendaMarca.VRTOTALLIQUIDO) / toFloat(item.vendaMarca.TOTALCUSTO) - 1) * 100
  }

  const calcularPercentualPrecoVenda = (item) => {
    return ((toFloat(item.vendaMarca.VRTOTALLIQUIDO) * 100) / toFloat(item.vendaMarca.VRTOTALLIQUIDO))
  }

  const calcularMediaVendas = (item) => {
    return (toFloat(item.vendaMarca.QTDVENDA) / toFloat(item.vendaMarca.DIASPESQUISADOS))
  }

  const calcularCobertura = (item) => {
    return (toFloat(item.qtdPosicionamento) / toFloat(item.mediaVendas))
  }

  const dados = dadosGrupoSubGrupo.map((item, index) => {
    let contador = index + 1;
    const totalEstoqueAnterior = calcularTotalEstoqueAnterior(item);
    const totalEstoqueData = calcularTotalEstoqueData(item);
    const qtdPosicionamento = totalEstoqueAnterior + totalEstoqueData - item.vendaMarca.QTDVENDA;

    const valorPrecoMedioCusto = calcularValorPrecoMedioCusto(item);
    const valorPrecoMedioVenda = calcularValorPrecoMedioVenda(item);
    const estoquePrecoVenda = valorPrecoMedioVenda * qtdPosicionamento;
    const estoquePrecoCusto = valorPrecoMedioCusto * qtdPosicionamento;
    const marckupProduto = calcularMarckupProduto(item);
    const indicadorMarckup = marckupProduto / 100;
    const percentualEstoquePrecoVenda = (parseFloat(estoquePrecoVenda) * 100) / parseFloat(estoquePrecoVenda);
    const percentualPrecoVenda = calcularPercentualPrecoVenda(item);
    const mediaVendas = calcularMediaVendas(item);
    const cobertura = calcularCobertura(item);


    return {
      contador,
      DSGRUPOEMPRESARIAL: item.vendaMarca.DSGRUPOEMPRESARIAL,
      GRUPO: item.vendaMarca.GRUPO,
      SUBGRUPO: item.vendaMarca.SUBGRUPO,
      qtdPosicionamento: qtdPosicionamento,
      
      estoquePrecoVenda: estoquePrecoVenda,
      estoquePrecoCusto: estoquePrecoCusto,
      indicadorMarckup: indicadorMarckup,
      percentualEstoquePrecoVenda: percentualEstoquePrecoVenda,
      
      percentualPrecoVenda: percentualPrecoVenda,
      cobertura: cobertura,

      QTDVENDA: item.vendaMarca.QTDVENDA,
      TOTALCUSTO: item.vendaMarca.TOTALCUSTO,
      TOTALBRUTO: item.vendaMarca.TOTALBRUTO,
      TOTALDESCONTO: item.vendaMarca.TOTALDESCONTO,
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,
      DIASPESQUISADOS: item.vendaMarca.DIASPESQUISADOS,

      QTDVENDAS: item.posicaoEstoqueAnterior.QTDVENDAS,
      QTDESTOQUE: item.posicaoEstoqueAnterior.QTDESTOQUE,
      QTDVOUCHERS: item.posicaoEstoqueAnterior.QTDVOUCHERS,

      QTDVENDASPOSICAO: item.posicaoVendasAnterior.QTDVENDAS,
      QTDVOUCHERS: item.posicaoVouchersAnterior.QTDVOUCHERS,

      QTDVOUCHERSATUAL: item.posicaoVouchersAtual.QTDVOUCHERS,

      QTDESTOQUEDATA: item.posicaoEstoqueAtual.QTDESTOQUE,
      QTDVOUCHERSDATA: item.posicaoEstoqueAtual.QTDVOUCHERS,

      totalEstoqueAnterior: totalEstoqueAnterior,
      totalEstoqueData: totalEstoqueData,
      valorPrecoMedioCusto: valorPrecoMedioCusto,
      valorPrecoMedioVenda: valorPrecoMedioVenda,
      marckupProduto: marckupProduto,
      mediaVendas: mediaVendas,

    }
  })

  const colunasListaEstoqueVendas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSGRUPOEMPRESARIAL',
      header: 'Grupo Empresarial',
      body: row => <th>{row.DSGRUPOEMPRESARIAL}</th>,
      sortable: true,
    },
    {
      field: 'GRUPO',
      header: 'Grupo',
      body: row => <th>{row.GRUPO}</th>,
      sortable: true,
    },
    {
      field: 'SUBGRUPO',
      header: 'SubGrupo',
      body: row => <th>{row.SUBGRUPO}</th>,
      sortable: true,
    },
    {
      field: 'qtdPosicionamento',
      header: 'Qtd. Peças Estoque',
      body: row => <th>{row.qtdPosicionamento}</th>,
      sortable: true,
    },
    {
      field: 'QTDVENDA',
      header: 'Qtd. Peças Vendidas',
      body: row => <th>{row.QTDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'estoquePrecoVenda',
      header: 'Estoque PV(R$)',
      body: row => <th>{formatMoeda(row.estoquePrecoVenda)}</th>,
      sortable: true,
    },
    {
      field: 'estoquePrecoCusto',
      header: 'Estoque PC(R$)',
      body: row => <th>{formatMoeda(row.estoquePrecoCusto)}</th>,
      sortable: true,
    },
    {
      field: 'indicadorMarckup',
      header: 'Markup 1',
      body: row => <th> {parseFloat(row.indicadorMarckup).toFixed(2)}</th>,
      sortable: true,
    },
    {
      field: 'percentualEstoquePrecoVenda',
      header: '(%) Estoque',
      body: row => <th>{parseFloat(row.percentualEstoquePrecoVenda).toFixed(2)}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Venda (R$)',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      sortable: true,
    },
    {
      field: 'percentualPrecoVenda',
      header: 'Venda (%)',
      body: row => <th>{parseFloat(row.percentualPrecoVenda).toFixed(2)}</th>,
      sortable: true,
    },
    {
      field: 'cobertura',
      header: 'Cobertura',
      body: row => <th>{parseFloat(row.cobertura).toFixed(2)}</th>,
      sortable: true,
    },
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Relatórios Vendas</h2>
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
            title="Vendas Grupo Sub Grupo"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasListaEstoqueVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}