import { Fragment, useRef, useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ButtonTable } from "../../../../../ButtonsTabela/ButtonTable";
import HeaderTable from "../../../../../Tables/headerTable";
import { dataFormatada } from "../../../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../../../utils/formatMoeda";


export const ActionListaProdutosOrigem = ({ dadosProdutoOrigem, dadosProdutoDestino }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Produtos de Origem',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº',  'Cod. Barras', 'Produto']],
      body: dados.map(item => [
        item.contador,
        item.NUCODBARRAS,
        item.DSPRODUTO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_promocoes_produtos_origem.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº',  'Cod. Barras', 'Produto'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 100, caption: 'Produto' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos de Origem');
    XLSX.writeFile(workbook, 'llista_promocoes_produtos_origem.xlsx');
  };


  const dadosListaProdutoOrigem = dadosProdutoOrigem.map((item, index) => {
    let contador = index + 1;
   
    return {
      contador,
      NUCODBARRAS: item.NUCODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      IDPRODUTOORIGEM: item.IDPRODUTOORIGEM,
    }
  });

  const colunasProdutoOrigem = [
    {
      header: "#",
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      header: "Cod. Barras",
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      header: "Produtos",
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      button: true,
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="p-1">
            <ButtonTable
              titleButton={"Excluir Produto da Promoção"}
              onClickButton
              Icon={FaRegTrashAlt}
              iconSize={18}
              iconColor={"#fff"}
              cor={"danger"}
            />

          </div>
        </div>

      ),
    }

  ]

  return (
    <Fragment>
      <div className="panel col-sm-12 col-md-12  col-lg-6">
        <div className="panel-hdr">
          <h2>

            Produtos de Origem

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
        <div className="card mb-4" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dadosListaProdutoOrigem}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasProdutoOrigem.map(coluna => (
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