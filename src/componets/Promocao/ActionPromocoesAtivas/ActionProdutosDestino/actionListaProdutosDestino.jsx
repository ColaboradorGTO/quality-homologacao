import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";


export const ActionListaProdutosDestino = ({
  dadosProdutosPesquisa,
  novoProdutoDestino,
  setNovoProdutoDestino,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const handleCheckboxChangeDestino = (produto) => {
    setNovoProdutoDestino((prevState) => {
      const existe = prevState.some(
        item =>
          String(item.IDPRODUTO) ===
          String(produto.IDPRODUTO)
      );

      if (existe) {
        return prevState.filter(
          item =>
            String(item.IDPRODUTO) !==
            String(produto.IDPRODUTO)
        );
      }

      return [...prevState, produto];
    });
  };
 
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos Promoções',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['N.Itens', 'Código de Barras', 'Descrição']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('produtos_promocoes.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados.map(item => ({
       'Nº': item.contador,
        'N.Itens': item.IDPRODUTO,
        'Descrição': item.DSNOME,
        'Código Barras': item.NUCODBARRAS,
    
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'N.Itens', 'Código de Barras', 'Descrição'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 100, caption: 'N.Itens' },
      { wpx: 200, caption: 'Código de Barras' },
      { wpx: 200, caption: 'Descrição' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Origens');
    XLSX.writeFile(workbook, 'produtos_promocoes.xlsx');
  };



  const dados = dadosProdutosPesquisa.map((item, index) => ({
    contador: index + 1,
    rowKey: `${item.IDPRODUTO}_${item.NUCODBARRAS}_${index}`,
    IDPRODUTO: item.IDPRODUTO,
    NUCODBARRAS: item.NUCODBARRAS,
    DSNOME: item.DSNOME,
    selecionado: novoProdutoDestino?.some(
      selecionadoItem => String(selecionadoItem.IDPRODUTO) === String(item.IDPRODUTO)
    ) ?? false,
  }));

  const colunasProdutos = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'N.Item',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Nº Código Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'Opcoes',
      header: 'Opções',
      body: (row) => {
        return (
          <input
            type="checkbox"
            checked={row.selecionado}
            onChange={() => handleCheckboxChangeDestino(row)}
          />
        );
      },
      sortable: false,
    }
  ]



  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Produtos</h2>

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
        <div className="card custom-swal" ref={dataTableRef}>
          <DataTable
            title="Lista de Produtos"
            value={dados}
            size="small"
            dataKey={"rowKey"}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={100}
            // rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            className="custom-swal"
            showGridlines
            stripedRows
            emptyMessage={
              <div className="dataTables_empty">Nenhum resultado encontrado</div>
            }
          >
            {colunasProdutos.map((coluna, index) => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  );
}
