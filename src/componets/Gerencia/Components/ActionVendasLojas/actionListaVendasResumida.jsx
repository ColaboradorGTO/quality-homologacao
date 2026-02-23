import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";

export const ActionListaVendasResumidas = ({ dadosVendasLojaResumido }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Loja Resumidas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['IDEMPRESA', 'Loja', 'QTD Clientes', 'Total Vendas Bruta', 'Total Desconto', 'Total Voucher', 'Total Liquido', 'Ticket Médio']],
      body: dados.map(item => [
        item.IDEMPRESA,
        item.NOFANTASIA,
        toFloat(item.QTDVENDA),
        formatMoeda(item.TOTALBRUTO),
        formatMoeda(item.TOTALDESCONTO),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.vrTotalLiquidoVenda),
        formatMoeda(item.vrTicketMedio),
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_loja_resumidas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['IDEMPRESA', 'Loja', 'QTD Clientes', 'Total Vendas Bruta', 'Total Desconto', 'Total Voucher', 'Total Liquido', 'Ticket Médio'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'IDEMPRESA' },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'QTD Clientes' },
      { wpx: 100, caption: 'Total Vendas Bruta' },
      { wpx: 100, caption: 'Total Desconto' },
      { wpx: 100, caption: 'Total Voucher' },
      { wpx: 100, caption: 'Total Liquido' },
      { wpx: 100, caption: 'Ticket Médio' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Loja Resumidas');
    XLSX.writeFile(workbook, 'vendas_loja_resumidas.xlsx');
  };


  const dados = dadosVendasLojaResumido.map((item) => {

    let vrTotalLiquidoVenda = parseFloat(item.TOTALBRUTO) - parseFloat(item.TOTALDESCONTO) - parseFloat(item.VRRECVOUCHER);
    let vrTicketMedio = vrTotalLiquidoVenda / parseFloat(item.QTDVENDA);

    return {
      IDEMPRESA: item?.IDEMPRESA,
      NOFANTASIA: item?.NOFANTASIA,
      QTDVENDA: toFloat(item?.QTDVENDA),
      TOTALBRUTO: toFloat(item?.TOTALBRUTO),
      TOTALDESCONTO: toFloat(item?.TOTALDESCONTO),
      VRRECVOUCHER: toFloat(item?.VRRECVOUCHER),
      Vouchers: toFloat(item?.Vouchers),
      vrTotalLiquidoVenda: toFloat(vrTotalLiquidoVenda),
      vrTicketMedio: toFloat(vrTicketMedio),
    }
  });

  const calcularTotalClientes = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.QTDVENDA), 0);
  }

  const calcularTotalVendasBruta = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.TOTALBRUTO), 0);
  }

  const calcularTotalDesconto = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.TOTALDESCONTO), 0);
  }

  const calcularTotalVoucher = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.VRRECVOUCHER), 0);
  }

  const calcularTotalLiquido = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.vrTotalLiquidoVenda), 0);
  }

  const calcularTotalTicketMedio = () => {
    return dados.reduce((total, dados) => total + toFloat(dados.vrTicketMedio), 0);
  }

  const colunasVendasResumida = [
    {
      field: 'IDEMPRESA',
      header: '#',
      body: row => <th style={{ color: 'blue' }} >{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ color: 'blue', width: '200px', fontWeight: 600, margin: '0px' }} >{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'QTDVENDA',
      header: 'QTD Clientes',
      body: row => <th style={{ color: 'green' }} >{row.QTDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'TOTALBRUTO',
      header: 'Total Vendas Bruta',
      body: row => <th style={{ color: 'blue' }} >{formatMoeda(row.TOTALBRUTO)}</th>,
      sortable: true,
    },
    {
      field: 'TOTALDESCONTO',
      header: 'Total Desconto',
      body: row => <th style={{ color: 'blue' }} >{formatMoeda(row.TOTALDESCONTO)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Total Voucher',
      body: row => <th style={{ color: 'blue' }} >{formatMoeda(row.VRRECVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'vrTotalLiquidoVenda',
      header: 'Total Liquido',
      body: row => <th style={{ color: 'blue' }} >{formatMoeda(row.vrTotalLiquidoVenda)}</th>,
      sortable: true,
    },
    {
      field: 'vrTicketMedio',
      header: 'Ticket Médio',
      body: row => <th style={{ color: 'blue' }} >{formatMoeda(row.vrTicketMedio)}</th>,
      sortable: true,
    }
  ]

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total " colSpan={2} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem', textAlign: 'center' }} />
        <Column footer={calcularTotalClientes()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalVendasBruta())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalVoucher())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalLiquido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalTicketMedio())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />

      </Row>
    </ColumnGroup>
  )

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas Resumidas</h2>
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
            title="Vendas Resumidas"
            value={dados}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            footerColumnGroup={footerGroup}
            size="small"
            sortOrder={-1}
            rows={true}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            response
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasResumida.map(coluna => (
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

    </Fragment >
  )
}
