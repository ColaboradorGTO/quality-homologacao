import React, { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { IoMdClose } from "react-icons/io";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";



export const ActionListaProdutos = ({
    produtosOrigemDetalhados,
    handleRemoverProdutoOrigem
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const formatarPreco = (valor) => (valor === null || valor === undefined || valor === '') ? '-' : formatMoeda(valor);

  const dados = (Array.isArray(produtosOrigemDetalhados) ? produtosOrigemDetalhados : []).map((item) => ({
    contador: item.contador,
    IDPRODUTO: item.IDPRODUTO,
    DSNOME: item.ENCONTRADO ? item.DSNOME : 'PRODUTO NÃO ENCONTRADO',
    NUCODBARRAS: item.NUCODBARRAS,
    PRECO_VENDA: item.PRECO_VENDA,
    PRECOVENDA: item.PRECOVENDA,
    ENCONTRADO: item.ENCONTRADO,
    PRECO_VENDA_NOVO: item.PRECO_VENDA_NOVO
  }));

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
      head: [['N.Itens', 'Código de Barras', 'Descrição', 'Preço Venda']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
        formatarPreco(item.PRECOVENDA),
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
      'Código Barras': item.NUCODBARRAS,
      'Descrição': item.DSNOME,
      'Preço Venda': item.PRECOVENDA,
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'N.Itens', 'Código de Barras', 'Descrição', 'Preço Venda'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 100, caption: 'N.Itens' },
      { wpx: 200, caption: 'Código de Barras' },
      { wpx: 200, caption: 'Descrição' },
      { wpx: 120, caption: 'Preço Venda' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos Destino');
    XLSX.writeFile(workbook, 'produtos_destino.xlsx');
  };

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
      body: row => <th style={{ color: row.ENCONTRADO ? undefined : 'red' }}>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Nº Código Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Preço Venda',
      body: row => <th>{formatarPreco(row.PRECOVENDA)}</th>,
      sortable: true,
    },
    {
      field: 'PRECO_VENDA_NOVO',
      header: 'Preço Novo',
      body: row => <th>{formatarPreco(row.PRECO_VENDA_NOVO)}</th>,
      sortable: true,
    },
    // {
    //   field: '',
    //   header: 'Opções',
    //   body: row => {
    //     return (
    //       <ButtonTable
    //         titleButton={"Remover Produto"}
    //         cor={"danger"}
    //         Icon={IoMdClose}
    //         iconSize={22}
    //         onClickButton={() => handleRemoverProdutoOrigem(row)}
    //         width="40px"
    //         height="40px"
    //       />
    //     )
    //   }
    // }
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
            dataKey="IDPRODUTO"
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
            cellMemo={false}
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
