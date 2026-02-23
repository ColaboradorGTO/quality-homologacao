import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";


export const ActionListaPrecoProdutoGrupoSubGrupo = ({ dadosListaEstoque }) => {
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
    doc.save('relatorio_produtos.pdf');
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatórios Produtos');
    XLSX.writeFile(workbook, 'relatorio_produtos.xlsx');
  };


  const dados = dadosListaEstoque.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOEMPRESA: item.produto.NOEMPRESA,
      GRUPO: item.produto.GRUPO,
      DSSUBGRUPO: item.produto.DSSUBGRUPO,
      NUCODBARRAS: item.produto.NUCODBARRAS,
      DSNOME: item.produto.DSNOME,
      PRECOCUSTO: item.produto.PRECOCUSTO,
      PRECOVENDA: item.produto.PRECOVENDA,
      QTDENTRADA: item.produto.QTDENTRADA,
      QTDSAIDA: item.produto.QTDSAIDA,
      QTDDEVOLVIDO: item.produto.QTDDEVOLVIDO,
      QTDVENDIDO: item.produto.QTDVENDIDO,
      QTDESTOQUE: item.produto.QTDESTOQUE,

      IDEMPRESA: item.produto.IDEMPRESA,
      IDSUBGRUPO: item.produto.IDSUBGRUPO,
      IDPRODUTO: item.produto.IDPRODUTO,
    }
  })

  const colunasEstoque = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOEMPRESA',
      header: 'Empresa',
      body: row => <p style={{width: '150px'}}>{row.NOEMPRESA}</p>,
      sortable: true,
    },
    {
      field: 'GRUPO',
      header: 'Grupo',
      body: row => <th>{row.GRUPO}</th>,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPO',
      header: 'Sub Grupo',
      body: row => <th>{row.DSSUBGRUPO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód.Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <p style={{width: '150px'}}>{row.DSNOME}</p>,
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'Preço Custo',
      body: row => <th>{formatMoeda(row.PRECOCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'Preço Venda',
      body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'QTDENTRADA',
      header: 'Qtd Entrada',
      body: row => <th>{row.QTDENTRADA}</th>,
      sortable: true,
    },
    {
      field: 'QTDSAIDA',
      header: 'Qtd Saída',
      body: row => <th>{row.QTDSAIDA}</th>,
      sortable: true,
    },
    {
      field: 'QTDDEVOLVIDO',
      header: 'Qtd Troca',
      body: row => <th>{row.QTDDEVOLVIDO}</th>,
      sortable: true,
    },
    {
      field: 'QTDVENDIDO',
      header: 'Qtd Venda(Saída)',
      body: row => <th>{row.QTDVENDIDO}</th>,
      sortable: true,
    },
    {
      field: 'QTDESTOQUE',
      header: 'Qtd Estoque',
      body: row => <th>{row.QTDESTOQUE}</th>,
      sortable: true,
    }
  ]


  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Preços Produtos</h2>
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
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasEstoque.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', fontWeight: 600, border: '1px solid #e9e9e9' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}

