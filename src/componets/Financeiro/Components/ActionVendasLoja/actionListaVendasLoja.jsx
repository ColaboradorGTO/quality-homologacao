import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda"
import { toFloat } from "../../../../utils/toFloat"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";


export const ActionListaVendasLoja = ({ dadosVendasLoja }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Vendas Por Loja',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data', 'Loja', 'Dinheiro', 'Cartão', 'POS', 'PIX', 'Convênio', 'Voucher', 'Fatura', 'Fat PIX', 'Despesa', 'Total Recebido', 'Disponível']],
      body: dadosListaVendasLoja.map(item => [
        item.DTHORAFECHAMENTO,
        item.NOFANTASIA,
        formatMoeda(item.VALORTOTALDINHEIRO),
        formatMoeda(item.VALORTOTALCARTAO),
        formatMoeda(item.VALORTOTALPOS),
        formatMoeda(item.VALORTOTALPIX),
        formatMoeda(item.VALORTOTALCONVENIO),
        formatMoeda(item.VALORTOTALVOUCHER),
        formatMoeda(item.VALORTOTALFATURA),
        formatMoeda(item.VALORTOTALFATURAPIX),
        formatMoeda(item.valorDespesaTotal),
        formatMoeda(item.valorTotalVendido),
        formatMoeda(item.valorDisponivel)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_por_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Data', 'Loja', 'Dinheiro', 'Cartão', 'POS', 'PIX', 'Convênio', 'Voucher', 'Fatura', 'Fat PIX', 'Despesa', 'Total Recebido', 'Disponível'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Data' },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Dinheiro' },
      { wpx: 100, caption: 'Cartão' },
      { wpx: 100, caption: 'POS' },
      { wpx: 100, caption: 'PIX' },
      { wpx: 100, caption: 'Convênio' },
      { wpx: 100, caption: 'Voucher' },
      { wpx: 100, caption: 'Fatura' },
      { wpx: 100, caption: 'Fat PIX' },
      { wpx: 100, caption: 'Despesa' },
      { wpx: 100, caption: 'Total Recebido' },
      { wpx: 100, caption: 'Disponível' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Vendas Por Loja');
    XLSX.writeFile(workbook, 'vendas_por_loja.xlsx');
  };

  const calcularTotalValorDespesaTotal = (item) => {
    return (
      toFloat(item.totais.VALORTOTALDESPESA) + toFloat(item.totais.VALORTOTALADIANTAMENTOSALARIAL)
    )
  }

  const calcularValorTotalVendido = (item) => {
    return (
      toFloat(item.totais.VALORTOTALDINHEIRO) +
      toFloat(item.totais.VALORTOTALCARTAO) +
      toFloat(item.totais.VALORTOTALPOS) +
      toFloat(item.totais.VALORTOTALPIX) +
      toFloat(item.totais.VALORTOTALMOOVPAY) +
      toFloat(item.totais.VALORTOTALCONVENIO) +
      toFloat(item.totais.VALORTOTALVOUCHER)
    )
  }

  const calcularValorDisponivelBruto = (item) => {
    return (
      toFloat(item.totais.VALORTOTALDINHEIRO) +
      toFloat(item.totais.VALORTOTALFATURA)
    )
  }

  const calcularValorQuebraCaixa = (item) => {
    return (
      toFloat(item.totais.VRRECDINHEIRO) - toFloat(item.totais.VRFISICODINHEIRO)
    )
  }

  const totalValorRecebidoDinheiro = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALDINHEIRO);
    }
    return total;
  }

  const totalValorRecebidoCartao = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALCARTAO);
    }
    return total;
  }

  const totalValorRecebidoPos = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALPOS);
    }
    return total;
  }

  const totalValorRecebidoPix = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALPIX);
    }
    return total;
  }

  const totalValorRecebidoConvenio = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALCONVENIO);
    }
    return total;
  }

  const totalValorRecebidoVoucherLoja = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALVOUCHER);
    }
    return total;
  }

  const totalValorRecebidoFatura = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALFATURA);
    }
    return total;
  }

  const totalValorRecebidoFaturaPix = () => {
    let total = 0;
    for (let venda of dadosVendasLoja) {
      total += parseFloat(venda.totais?.VALORTOTALFATURAPIX);
    }
    return total;
  }

  const dadosExcel = Array.isArray(dadosVendasLoja) ? dadosVendasLoja.map((item) => {
    const valorDespesaTotal = calcularTotalValorDespesaTotal(item);
    const valorTotalVendido = calcularValorTotalVendido(item);
    const valorDisponivelBruto = calcularValorDisponivelBruto(item);
    const valorQuebraCaixa = calcularValorQuebraCaixa(item);
    const valorDisponivel = valorDisponivelBruto - valorDespesaTotal + valorQuebraCaixa;
    // console.log(item.totais[0])
    return {
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFANTASIA: item.NOFANTASIA,
      VALORTOTALDINHEIRO: formatMoeda(item.totais?.VALORTOTALDINHEIRO),
      VALORTOTALCARTAO: formatMoeda(item.totais?.VALORTOTALCARTAO),
      VALORTOTALPOS: formatMoeda(item.totais?.VALORTOTALPOS),
      VALORTOTALPIX: formatMoeda(item.totais?.VALORTOTALPIX),
      VALORTOTALCONVENIO: formatMoeda(item.totais?.VALORTOTALCONVENIO),
      VALORTOTALVOUCHER: formatMoeda(item.totais?.VALORTOTALVOUCHER),
      VALORTOTALFATURA: formatMoeda(item.totais?.VALORTOTALFATURA),
      VALORTOTALFATURAPIX: formatMoeda(item.totais?.VALORTOTALFATURAPIX),
      valorDespesaTotal: formatMoeda(valorDespesaTotal),
      valorTotalVendido: formatMoeda(valorTotalVendido),
      valorDisponivel: formatMoeda(valorDisponivel),

    }
  }) : [];


  const dadosListaVendasLoja = dadosVendasLoja.map((item) => {
    const valorDespesaTotal = calcularTotalValorDespesaTotal(item);
    const valorTotalVendido = calcularValorTotalVendido(item);
    const valorDisponivelBruto = calcularValorDisponivelBruto(item);
    const valorQuebraCaixa = calcularValorQuebraCaixa(item);
    const valorDisponivel = valorDisponivelBruto - valorDespesaTotal + valorQuebraCaixa;
    return {
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFANTASIA: item.NOFANTASIA,
      VALORTOTALDINHEIRO: item.totais?.VALORTOTALDINHEIRO,
      VALORTOTALCARTAO: item.totais?.VALORTOTALCARTAO,
      VALORTOTALPOS: item.totais?.VALORTOTALPOS,
      VALORTOTALPIX: item.totais?.VALORTOTALPIX,
      VALORTOTALCONVENIO: item.totais?.VALORTOTALCONVENIO,
      VALORTOTALVOUCHER: item.totais?.VALORTOTALVOUCHER,
      VALORTOTALFATURA: item.totais?.VALORTOTALFATURA,
      VALORTOTALFATURAPIX: item.totais?.VALORTOTALFATURAPIX,
      valorDespesaTotal: valorDespesaTotal,
      valorTotalVendido: valorTotalVendido,
      valorDisponivel: valorDisponivel,
      VALORTOTALMOOVPAY: item.totais.VALORTOTALMOOVPAY,
      VALORTOTALDESPESA: item.totais.VALORTOTALDESPESA,
      VALORTOTALADIANTAMENTOSALARIAL: item.totais.VALORTOTALADIANTAMENTOSALARIAL,
      VRFISICODINHEIRO: item.totais.VRFISICODINHEIRO,
      VRAJUSTEDINHEIRO: item.totais.VRAJUSTEDINHEIRO,
      VRRECDINHEIRO: item.totais.VRRECDINHEIRO,
      valorDisponivelBruto: valorDisponivelBruto,
      valorQuebraCaixa: valorQuebraCaixa,
    }
  })

  const totalValorDespesaTotal = () => {
    let total = 0;
    for (let venda of dadosListaVendasLoja) {
      total += parseFloat(venda.valorDespesaTotal);
    }
    return total;
  }

  const totalValorRecebido = () => {
    let total = 0;
    for (let venda of dadosListaVendasLoja) {

      total += parseFloat(venda.valorTotalVendido);
    }
    return total;
  }

  const totalValorDisponivel = () => {
    let total = 0;
    for (let venda of dadosListaVendasLoja) {
      total += parseFloat(venda.valorDisponivel);
    }
    return total;
  }

  const colunasVendasLoja = [
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Data',
      body: row => <th style={{ color: 'blue' }}>{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ color: 'blue', width: '200px', margin: '0px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      footer: 'Total',
      sortable: true,
    },
    {
      field: 'VALORTOTALDINHEIRO',
      header: 'Dinheiro',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALDINHEIRO)}</th>,
      footer: formatMoeda(totalValorRecebidoDinheiro()),
      sortable: true,
    },
    {
      field: 'VALORTOTALCARTAO',
      header: 'Cartão',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALCARTAO)}</th>,
      footer: formatMoeda(totalValorRecebidoCartao()),
      sortable: true,
    },
    {
      field: 'VALORTOTALPOS',
      header: 'POS',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALPOS)}</th>,
      footer: formatMoeda(totalValorRecebidoPos()),
      sortable: true,
    },
    {
      field: 'VALORTOTALPIX',
      header: 'PIX',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALPIX)}</th>,
      footer: formatMoeda(totalValorRecebidoPix()),
      sortable: true,
    },
    {
      field: 'VALORTOTALCONVENIO',
      header: 'Convênio',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALCONVENIO)}</th>,
      footer: formatMoeda(totalValorRecebidoConvenio()),
      sortable: true,
    },
    {
      field: 'VALORTOTALVOUCHER',
      header: 'Voucher',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALVOUCHER)}</th>,
      footer: formatMoeda(totalValorRecebidoVoucherLoja()),
      sortable: true,
    },
    {
      field: 'VALORTOTALFATURA',
      header: 'Fatura',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALFATURA)}</th>,
      footer: formatMoeda(totalValorRecebidoFatura()),
      sortable: true,
    },
    {
      field: 'VALORTOTALFATURAPIX',
      header: 'Fatura PIX',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALFATURAPIX)}</th>,
      footer: formatMoeda(totalValorRecebidoFaturaPix()),
      sortable: true,
    },
    {
      field: 'valorDespesaTotal',
      header: 'Despesa',
      body: row => (
        <div>
          <th style={{ color: 'blue' }}>{formatMoeda(row.valorDespesaTotal)}</th>
        </div>
      ),
      footer: formatMoeda(totalValorDespesaTotal()),
      sortable: true,
    },
    {
      field: 'valorTotalVendido',
      header: 'Total Recebido',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.valorTotalVendido)}</th>,
      footer: formatMoeda(totalValorRecebido()),
      sortable: true,
    },
    {
      field: 'valorDisponivel',
      header: 'Disponível',
      body: row => (
        <div>
          <th style={{ color: row.valorDisponivel ? 'green' : 'green' }}>{formatMoeda(row.valorDisponivel)}</th>
        </div>
      ),
      footer: () => (
        <div>
          <th style={{ color: 'green', fontWeight: 700 }}>{formatMoeda(totalValorDisponivel())}</th>
        </div>
      ),
      sortable: true,
    }
  ];


  return (
    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Vendas Por Loja</h2>
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
        <div ref={dataTableRef}>
          <DataTable
            title="Vendas por Loja"
            value={dadosListaVendasLoja}
            size="small"
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaVendasLoja.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasLoja.map(coluna => (
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
  );
}