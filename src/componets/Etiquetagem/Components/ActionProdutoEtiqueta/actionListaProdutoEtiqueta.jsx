import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { formatMoeda } from "../../../../utils/formatMoeda";

import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

// 1070561136301

export const ActionListaProdutoEtiqueta = ({ dadosListaPrecosSap }) => {
  const [qtdProduto, setQtdProduto] = useState(1);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Produtos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Cod Barras', 'Produto', 'Tamanho', 'PR. Venda', 'Grupo', 'Estilo', 'Marca']],
      body: dados.map(item => [
        item.NOFANTASIA,
        item.IDVENDA,
        dataFormatada(item.DATAVENDA),
        formatMoeda(item.VRRECDINHEIRO),
        formatMoeda(item.VRRECCARTAO),
        formatMoeda(item.VRRECPOS),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.VRRECCONVENIO),
        item.DSPAG,
        item.NOTEF,
        item.NUAUTORIZACAO,
        item.NPARCELAS,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Cod Barras', 'Produto', 'Tamanho', 'PR. Venda', 'Grupo', 'Estilo', 'Marca'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Cod Barras'},
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Tamanho' },
      { wpx: 100, caption: 'PR. Venda' },
      { wpx: 100, caption: 'Grupo' },
      { wpx: 100, caption: 'Estilo' },
      { wpx: 100, caption: 'Marca' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Produtos');
    XLSX.writeFile(workbook, 'lista_produtos.xlsx');
  };

  const dados = dadosListaPrecosSap.map((item, index) => {
    let contador = index + 1;
    if(!item.STCANCELADO) {
      nuCodBarras = item.NUCODBARRAS;
      descProduto = item.DSNOME;
      TAMANHO = (item.TAMANHO.split(' ').pop()).toUpperCase().replace(/[^\w\s]/gi, '')
      precoVenda = item.PRECOVENDA;
      grupo = item.DSLISTAPRECO;
      estilo = item.DSESTILO;
    }
    
    return {
      contador,
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      TAMANHO: item.TAMANHO,
      PRECOVENDA: item.PRECOVENDA,
      DSLISTAPRECO: item.DSLISTAPRECO,
    
  
      // TAMANHO: item.TAMANHO,  (dsProd.split(' ')).pop()).toUpperCase().replace(/[^\w\s]/gi, '')



      
      IDGRUPOEMPRESARIAL: item.IDGRUPOEMPRESARIAL,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
     

      // ----------------------
      
      CODBARRAS: item.CODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      DSTAMANHO: item.DSTAMANHO,
      VRUNITLIQDETALHEPEDIDO: item.VRUNITLIQDETALHEPEDIDO,

      MARCA: item.MARCA,
      SUBGRUPO: item.SUBGRUPO,
      DSESTILO: item.DSESTILO,
      IDSUBGRUPOEMPRESARIAL: item.IDSUBGRUPOEMPRESARIAL,
      DSLOCALEXPOSICAO: item.DSLOCALEXPOSICAO,
    }
  });

  const colunasListaProdEtiquetas = [
    {
      field: 'contador',
      header: 'Nº',
      body: (row) => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'IDPRODUTO',
      header: (
        <div>
          <label>{selectAll ? 'Desmarcar Todos' : 'Marcar Todos'}</label>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            selectionMode="multiple"
            />
        </div>
      ),
      selectionMode: "single",
      body: (rowData) => {
        return (
          <div style={{ background: '', }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(rowData.IDPRODUTO)}
                onChange={(e) => {
                  const updatedSelectedIds = e.target.checked
                    ? [...selectedIds, rowData.IDPRODUTO]
                    : selectedIds.filter(id => id !== rowData.IDPRODUTO);
          
                  setSelectedIds(updatedSelectedIds);
                  setSelectAll(updatedSelectedIds.length === dados.length);
                }}
                selectionMode="multiple"
              />
          </div>
        )
      }
    },
    {
      field: 'IDPRODUTO',
      header: 'Quantidade',
      body: (row) => {
        return (
          <div style={{ background: '', width: '100%' }}>
            <input
              type="number"
              value={qtdProduto}
              onValueChange={(e) => row.IDPRODUTO.editorCallback(e.value)}
              style={{ width: '100%' }}
            />
          </div>
        )
      }
    },
    {
      field: 'CODBARRAS',
      header: 'Código de Barras',
      body: row => <th>{row.CODBARRAS}</th>,
      sortable: true
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true
    },
    {
      field: 'TAMANHO',
      header: 'Tamanho',
      body: row => <th>{row.TAMANHO}</th>,
      sortable: true
    },
    {
      field: 'PRECOVENDA',
      header: 'PR. Venda',
      body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true
    },
    {
      field: 'DSLISTAPRECO',
      header: 'Grupo',
      body: row => <th>{row.DSLISTAPRECO}</th>,
      sortable: true
    },
    {
      field: 'DSESTILO',
      header: 'Estilo',
      body: row => <th>{row.DSESTILO}</th>,
      sortable: true
    },
    {
      field: 'MARCA',
      header: 'Marca',
      body: row => <th>{row.MARCA}</th>,
      sortable: true
    },

  ]

  // useEffect(() => {
  //   if (selectedIds.length > 0) {
  //     handleDetalhar(selectedIds, 'True');
  //   }
  // }, [selectedIds]);


  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);

    const updatedSelectedIds = isChecked ? dados.map(item => item.IDPRODUTO) : [];
    setSelectedIds(updatedSelectedIds);

    // if (updatedSelectedIds.length > 0) {
    //   handleDetalhar(updatedSelectedIds, 'True');
    // }
  };

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Produtos </h2>
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
            title="Lista de Produtos"
            value={dados}
            globalFilterValue={globalFilterValue}
            size="small"
            selectionMode={'single'}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >

            {colunasListaProdEtiquetas.map(coluna => (
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