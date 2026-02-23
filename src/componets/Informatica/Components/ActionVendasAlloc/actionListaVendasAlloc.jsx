import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { GrView } from "react-icons/gr";
import HeaderTable from "../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";

export const ActionListaVendasAlloc = ({ dadosVendasAlloc }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Alloc',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Loja', 'DT Venda', 'Nº Venda', 'DT Envio', 'Nº Retorno Alloc', 'Cumpom Código', 'Nº Retorno Pag', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.IDEMPRESA,
        item.DTVENDA,
        item.IDVENDA,
        item.DTEMVIO,
        item.IDRETORNOALLOC,
        item.CUPOM_CODIGO,
        item.IDRETORNOPAGAMENTO,
        item.STSTATUS
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_alloc.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Loja', 'DT Venda', 'Nº Venda', 'DT Envio', 'Nº Retorno Alloc', 'Cumpom Código', 'Nº Retorno Pag', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Loja' },
      { wpx: 100, caption: 'DT Venda' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'DT Envio' },
      { wpx: 100, caption: 'Nº Retorno Alloc' },
      { wpx: 100, caption: 'Cumpom Código' },
      { wpx: 100, caption: 'Nº Retorno Pag' },
      { wpx: 100, caption: 'Situação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Alloc');
    XLSX.writeFile(workbook, 'vendas_alloc.xlsx');
  };

  const dados = dadosVendasAlloc.map((item, index) => {
    let contador = index + 1;
    return {
      IDVENDA: item.IDVENDA,
      IDEMPRESA: item.IDEMPRESA,
      DTEMVIO: item.DTEMVIO,
      DTVENDA: item.DTVENDA,
      IDRETORNOALLOC: item.IDRETORNOALLOC,
      CUPOM_CODIGO: item.CUPOM_CODIGO,
      IDRETORNOPAGAMENTO: item.IDRETORNOPAGAMENTO,
      TXT_VENDA: item.TXT_VENDA,
      TXT_PAGAMENTO: item.TXT_PAGAMENTO,
      TXTRETORNOALLOC: item.TXTRETORNOALLOC,
      TXTRETORNOERROALLOC: item.TXTRETORNOERROALLOC,
      STSTATUS: item.STSTATUS,
      contador
    }
  });

  const colunasVendasAlloc = [
    {
      field: 'contador',
      header: '#',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'Loja',
      body: row => row.IDEMPRESA,
      sortable: true,
    },
    {
      field: 'DTVENDA',
      header: 'DT Venda',
      body: row => row.DTVENDA,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => row.IDVENDA,
      sortable: true,
    },
    {
      field: 'DTEMVIO',
      header: 'DT Envio',
      body: row => row.DTEMVIO,
      sortable: true,
    },
    {
      field: 'IDRETORNOALLOC',
      header: 'Nº Retorno Alloc',
      body: row => parseFloat(row.IDRETORNOALLOC),
      sortable: true,
    },
    {
      field: 'CUPOM_CODIGO',
      header: 'Cumpom Código',
      body: row => row.CUPOM_CODIGO,
      sortable: true,
    },
    {
      field: 'IDRETORNOPAGAMENTO',
      header: 'Nº Retorno Pag',
      body: row => row.IDRETORNOPAGAMENTO,
      sortable: true,
    },
    {
      field: 'STSTATUS',
      header: 'Situação',
      body: row => row.STSTATUS,
      sortable: true,
    },
    {
      field: '',
      header: 'Detalhar',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="p-1">
              <ButtonTable
                titleButton={"Alterar"}
                onClickButton={() => handleClickEdit(row)}
                Icon={GrView}
                iconSize={18}
                iconColor={"#fff"}
                cor={"success"}
                width="40px"
                height="30px"
              />

            </div>
          </div>
        )
      ),
    }
  ]

  const handleDetalhar = async (IDVENDA) => {
    try {
      const response = await get(`/atualizarFuncionario?idFuncionario=${IDVENDA}`)
      if (response.data && response.data.length > 0) {

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickDetalhar = (row) => {
    if (row && row.IDVENDA) {
      handleDetalhar(row.IDVENDA);
    }
  };

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Vendas Alloc</h2>
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
            value={dados}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            globalFilter={globalFilterValue}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasAlloc.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
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
