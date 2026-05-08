import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../utils/toFloat";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaVendasMarca = ({dadosListaVendasMarca}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Período Recebimentos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['#', 'Loja', 'Total Vendas', 'Dinheiro', 'Cartão', 'POS', 'PIX', 'Convênio', 'Voucher', 'Fatura', 'Fatura PIX', 'Total Fatura', 'Despesa', '  Total', 'Quebra', 'Disponível']],
      body: dadosVendasMarca.map(item => [
        item.IDEMPRESA,
        item.NOFANTASIA, 
        formatMoeda(item.valorTotalVendido), 
        formatMoeda(item.VRDINHEIRO), 
        formatMoeda(item.VRCARTAO), 
        formatMoeda(item.VRPOS), 
        formatMoeda(item.VRPIX), 
        formatMoeda(item.CONVENIO), 
        formatMoeda(item.VOUCHER), 
        formatMoeda(item.VRFATURA), 
        formatMoeda(item.VRFATURAPIX), 
        formatMoeda(item.valorFaturaTotal), 
        formatMoeda(item.valorDespesaTotal), 
        formatMoeda(item.valorDisponivelBruto), 
        formatMoeda(item.valorQuebraCaixa), 
        formatMoeda(item.valorDisponivel) 
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_periodo_recebimentos.pdf');
  };
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendasMarcaExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['#', 'Loja', 'Total Vendas', 'Dinheiro', 'Cartão', 'POS', 'PIX', 'Convênio', 'Voucher', 'Fatura', 'Fatura PIX', 'Total Fatura', 'Despesa', 'Total', 'Quebra', 'Disponível'];
    worksheet['!cols'] = [
      { wpx: 20,  caption: 'ID Empresa', }, 
      { wpx: 200, caption: 'Loja' }, 
      { wpx: 100, caption: 'Total Vendas' }, 
      { wpx: 100, caption: 'Dinheiro' }, 
      { wpx: 150, caption: 'Cartão' }, 
      { wpx: 100, caption: 'POS' }, 
      { wpx: 100, caption: 'PIX' }, 
      { wpx: 100, caption: 'Convênio' }, 
      { wpx: 100, caption: 'Voucher' },
      { wpx: 100, caption: 'Fatura' }, 
      { wpx: 100, caption: 'Fatura PIX' }, 
      { wpx: 100, caption: 'Total Fatura' }, 
      { wpx: 100, caption: 'Despesa' }, 
      { wpx: 100, caption: 'Total' }, 
      { wpx: 100, caption: 'Quebra' }, 
      { wpx: 100, caption: 'Disponível' }
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Período Recebimentos');
    XLSX.writeFile(workbook, 'vendas_periodo_recebimentos.xlsx');
  };

  const calcularTotalValorDespesaTotal = (item) => {
    return (
      toFloat(item.VRDESPESA) + toFloat(item.VRADIANTAMENTOSALARIO)
    )
  }

  const calcularValorDisponivelBruto = (item) => {
    return (
      toFloat(item.VRDINHEIRO) + toFloat(item.VRFATURA)
    )
  }

  const calcularValorFaturaTotal = (item) => {
    return (
      toFloat(item.VRFATURAPIX) + toFloat(item.VRFATURA)
    )
  }

  const calcularValorTotalVendido = (item) => {
    return (toFloat(item.VRTOTALPAGO) - toFloat(item.VOUCHER))
  }

  const calcularValorQuebraCaixa = (item) => {
    return (toFloat(item.VRRECDINHEIRO) - toFloat(item.VRFISICODINHEIRO))
  }

  const calcularValorDisponivelBrutoTicketM = (item) => {
    return (
      toFloat(item.VRDINHEIRO) +
      toFloat(item.VRCARTAO) +
      toFloat(item.VRPOS) +
      toFloat(item.CONVENIO) +
      toFloat(item.VRPIX)
    )
  }

  const calcularValorDisponivelBrutoVoucherTiketM = (item) => {
    return (toFloat(item.VRTOTALPAGO) - toFloat(item.VOUCHER))
  }

  const dadosVendasMarcaExcel = dadosListaVendasMarca.map((item, index) => {
    const valorTotalVendido = calcularValorTotalVendido(item);
    const valorFaturaTotal = calcularValorFaturaTotal(item);
    const valorDespesaTotal = calcularTotalValorDespesaTotal(item);
    const valorDisponivelBruto = calcularValorDisponivelBruto(item);
    const valorQuebraCaixa = calcularValorQuebraCaixa(item);
    const valorDisponivel = valorDisponivelBruto - valorDespesaTotal + valorQuebraCaixa;

    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA, 
      valorTotalVendido: formatMoeda(valorTotalVendido), 
      VRDINHEIRO: formatMoeda(item.VRDINHEIRO), 
      VRCARTAO: formatMoeda(item.VRCARTAO), 
      VRPOS: formatMoeda(item.VRPOS), 
      VRPIX: formatMoeda(item.VRPIX), 
      CONVENIO: formatMoeda(item.CONVENIO), 
      VOUCHER: formatMoeda(item.VOUCHER), 
      VRFATURA: formatMoeda(item.VRFATURA), 
      VRFATURAPIX: formatMoeda(item.VRFATURAPIX), 
      valorFaturaTotal: formatMoeda(valorFaturaTotal), 
      valorDespesaTotal: formatMoeda(valorDespesaTotal), 
      valorDisponivelBruto: formatMoeda(valorDisponivelBruto), 
      valorQuebraCaixa: formatMoeda(valorQuebraCaixa), 
      valorDisponivel: formatMoeda(valorDisponivel) 
    }
  })

  const dadosVendasMarca = dadosListaVendasMarca.map((item, index) => {
    const valorDespesaTotal = calcularTotalValorDespesaTotal(item);
    const valorTotalVendido = calcularValorTotalVendido(item);
    const valorDisponivelBruto = calcularValorDisponivelBruto(item);
    const valorTotalDisponivelBruto = calcularValorDisponivelBruto(item) - valorDespesaTotal;
    const valorQuebraCaixa = calcularValorQuebraCaixa(item);
    const valorFaturaTotal = calcularValorFaturaTotal(item);
    const valorTotalQuebraMarca = valorDisponivelBruto - valorDespesaTotal;
    const valorTotalQuebraVoucherMarca = valorDisponivelBruto - valorDespesaTotal;
    const valorDisponivelBrutoVoucher = valorDisponivelBruto;
    const valorDisponivel = valorDisponivelBruto - valorDespesaTotal + valorQuebraCaixa;
    const percentualDinherioVenda = (toFloat(item.VRDINHEIRO) * 100) / ((toFloat(item.VRTOTALPAGO) - toFloat(item.VOUCHER)));
 
    const percentualTefVenda = ((parseFloat(item.VRCARTAO) * 100) / (parseFloat(valorTotalVendido)));
    const percentualConvenioVenda = ((parseFloat(item.CONVENIO) * 100) / (parseFloat(valorTotalVendido)));
    const percentualPosVenda = ((parseFloat(item.VRPOS) * 100) / (parseFloat(valorTotalVendido)));
    const percentualPixVenda = ((parseFloat(item.VRPIX) * 100) / (parseFloat(valorTotalVendido)));
    const percentualVoucherVenda = ((parseFloat(item.VOUCHER) * 100) / (parseFloat(valorTotalVendido)));

    const valorDisponivelBrutoTiketM = calcularValorDisponivelBrutoTicketM(item);
    const valorDisponivelBrutoVoucherTiketM = calcularValorDisponivelBrutoVoucherTiketM(item);
    const valorTiketMedio = valorDisponivelBrutoVoucherTiketM / parseFloat(item.QTDVENDA);

    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      VRDINHEIRO: item.VRDINHEIRO,
      VRTOTALPAGO: item.VRTOTALPAGO,
      VRCARTAO: item.VRCARTAO,
      VRPOS: item.VRPOS,
      VRPIX: item.VRPIX,
      VRMOOVPAY: item.VRMOOVPAY,
      CONVENIO: item.CONVENIO,
      VOUCHER: item.VOUCHER,
      VRFATURA: item.VRFATURA,
      VRFATURAPIX: item.VRFATURAPIX,
      VRDESPESA: item.VRDESPESA,
      VRADIANTAMENTOSALARIO: item.VRADIANTAMENTOSALARIO,
      VRFISICODINHEIRO: item.VRFISICODINHEIRO,
      VRRECDINHEIRO: item.VRRECDINHEIRO,
      QTDVENDA: item.QTDVENDA,

      valorDespesaTotal: valorDespesaTotal,
      valorTotalVendido: valorTotalVendido,
      valorDisponivelBruto: valorDisponivelBruto,
      valorFaturaTotal: valorFaturaTotal,
      valorQuebraCaixa: valorQuebraCaixa,
      valorTotalQuebraMarca: valorTotalQuebraMarca,
      valorTotalQuebraVoucherMarca: valorTotalQuebraVoucherMarca,
      valorDisponivelBrutoVoucher: valorDisponivelBrutoVoucher,
      valorDisponivel: valorDisponivel,


      percentualDinherioVenda: toFloat(percentualDinherioVenda),
      percentualTefVenda: percentualTefVenda,
      percentualConvenioVenda: percentualConvenioVenda,
      percentualPosVenda: percentualPosVenda,
      percentualPixVenda: percentualPixVenda,
      percentualVoucherVenda: percentualVoucherVenda,
      valorTotalDisponivelBruto:valorTotalDisponivelBruto,

      valorDisponivelBrutoTiketM: valorDisponivelBrutoTiketM,
      valorDisponivelBrutoVoucherTiketM: valorDisponivelBrutoVoucherTiketM,
      valorTiketMedio: valorTiketMedio,
    }
  })
 
  const calcularTotal = (field) => {
    return dadosVendasMarca.reduce((total, item) => total + parseFloat(item[field]), 0);
  };

  const calcularTotalVendas = () => {
    const total = calcularTotal('valorTotalVendido');
    return total;
  }

  const calcularTotalFatura = () => {
    const total = calcularTotal('VRFATURA');
    return total;
  }

  const calcularTotalFaturaPix = () => {
    const total = calcularTotal('VRFATURAPIX');
    return total;
  }

  const calcularTotalDespesa = () => {
    const total = calcularTotal('valorDespesaTotal');
    return total;
  }

  const calcularTotalDisponivelBruto = () => {
    const total = calcularTotal('valorTotalDisponivelBruto'); 
    return total;
  }

  const calcularTotalQuebraCaixa = () => {
    const total = calcularTotal('valorQuebraCaixa');
    return total;
  }

  const calcularTotalDisponivel = () => {
    const total = calcularTotal('valorDisponivel')
    return total;
  }


  const calcularTotalDinheiroPercentual = () => {
    const totalDinheiro = calcularTotal('VRDINHEIRO');
    const totalVendas = calcularTotal('valorTotalVendido');
    const percentualDinheiroVenda = (totalDinheiro * 100) / totalVendas;
    return `${formatMoeda(totalDinheiro)} (${percentualDinheiroVenda.toFixed(4)}%) do total bruto da venda`;
  };

  const calcularTotalCartaoPercentual = () => {
    const totalCartao = calcularTotal('VRCARTAO');
    const totalVendas = calcularTotal('valorTotalVendido');
    const percentualCartaoVenda = (totalCartao * 100) / totalVendas;
    return `${formatMoeda(totalCartao)} (${percentualCartaoVenda.toFixed(4)}%) do total bruto da venda`;
  };

  const calcularTotalPosPercentual = () => {
    const totalPos = calcularTotal('VRPOS')
    const totalPercentualPosVenda = calcularTotal('valorTotalVendido')
    const percentualPosVenda = (totalPos * 100) / totalPercentualPosVenda;
    return `${formatMoeda(totalPos)} (${percentualPosVenda.toFixed(4)}%) do total bruto da venda`;
  }

  const calcularTotalPIXPercentual = () => {
    const totalPix = calcularTotal('VRPIX');
    const totalVendas = calcularTotal('valorTotalVendido');
    const percentualPixVenda = (totalPix * 100) / totalVendas;
    return `${formatMoeda(totalPix)} (${percentualPixVenda.toFixed(4)}%) do total bruto da venda`;
  }

  const calcularTotalConvenioPercentual = () => {
    const totalConvenio = calcularTotal('CONVENIO');
    const totalVendas = calcularTotal('valorTotalVendido');
    const percentualConvenioVenda = (totalConvenio * 100) / totalVendas;
    return `${formatMoeda(totalConvenio)} (${percentualConvenioVenda.toFixed(4)}%) do total bruto da venda`;
  }

  const calcularTotalVoucherPercentual = () => {
    const totalVoucher = calcularTotal('VOUCHER');
    const totalVendas = calcularTotal('valorTotalVendido');
    const percentualVoucherVenda = (totalVoucher * 100) / totalVendas;
    return `${formatMoeda(totalVoucher)} (${percentualVoucherVenda.toFixed(4)}%) do total bruto da venda`;
  } 

  const colunasVendasMarca = [
    {
      field: 'IDEMPRESA',
      header: '#',
      body: row =><th style={{color: 'blue'}}>{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA IDEMPRESA',
      header: 'Loja',
      body: row =><p style={{color: 'blue', width: '200px', margin: '0px', fontWeight: 600}}>{ row.NOFANTASIA}</p>,
      footer: <th style={{fontWeight: 600, fontSize: '1rem'}}>Total</th>,
      sortable: true,
    },
    {
      field: 'valorTotalVendido',
      header: 'Total Venda',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.valorTotalVendido)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalVendas())}</th>,
      sortable: true,
    },
    {
      field: 'VRDINHEIRO',
      header: 'Dinheiro',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRDINHEIRO)}</th>,
      footer: (row) => {
        return (
          <div>
            <th style={{fontWeight: 600}}>{calcularTotalDinheiroPercentual() } </th>
          </div>
        )
      },
      sortable: true,
    },
    {
      field: 'VRCARTAO',
      header: 'Cartão',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRCARTAO)}</th>,
      footer: () => {return <th style={{fontWeight: 600}}>{calcularTotalCartaoPercentual()}</th> },
      sortable: true,
    },
    {
      field: 'VRPOS',
      header: 'POS',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRPOS)}</th>,
      footer: () => { return <th style={{fontWeight: 600}}>{calcularTotalPosPercentual()}</th> },
      sortable: true,
    },
    {
      field: 'VRPIX',
      header: 'PIX',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRPIX)}</th>,
      footer: () => { return <th style={{fontWeight: 600}}>{calcularTotalPIXPercentual()}</th>},
      sortable: true,
    },
    {
      field: 'CONVENIO',
      header: 'Convênio',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.CONVENIO)}</th>,
      footer: () => {return  <th style={{fontWeight: 600}}>{calcularTotalConvenioPercentual()}</th> },
      sortable: true,
    },
    {
      field: 'VOUCHER',
      header: 'Voucher',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VOUCHER)}</th>,
      footer: () => {  return <th style={{fontWeight: 600}}>{calcularTotalVoucherPercentual()}</th>},
      sortable: true,
    },
    {
      field: 'VRFATURA',
      header: 'Fatura',
      body: row =><th style={{color: 'blue'}}>{ formatMoeda(row.VRFATURA)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalFatura())}</th>,
      sortable: true,
    },
    {
      field: 'VRFATURAPIX',
      header: 'Fatura PIX',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRFATURAPIX)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalFaturaPix())}</th>,
      sortable: true,
    },
    {
      field: 'valorFaturaTotal',
      header: 'Total Fatura',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.valorFaturaTotal)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalFatura())}</th>,
      sortable: true,
    },
    {
      field: 'valorDespesaTotal',
      header: 'Despesa',
      body: row => <th style={{color: 'red'}}>{formatMoeda(row.valorDespesaTotal)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalDespesa())}</th>,
      sortable: true,
    },
    {
      field: 'valorDisponivelBruto',
      header: 'Total',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.valorDisponivelBruto)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalDisponivelBruto())}</th>,
      sortable: true,
    },
    {
      field: 'valorQuebraCaixa',
      header: 'Quebra',
      body: (row) => {
        return (
          <th style={{ color: row.valorQuebraCaixa > 0 ? 'blue' : 'red' }}>
            {parseFloat(row.valorQuebraCaixa).toFixed(2)}
          </th>
        )

      },
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalQuebraCaixa())}</th>,
      sortable: true,
    },
    {
      field: 'valorDisponivel',
      header: 'Disponível',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.valorDisponivel)}</th>,
      footer: <th style={{fontWeight: 600}}>{formatMoeda(calcularTotalDisponivel())}</th>,
      sortable: true,
    }
  ]

  return (

    <Fragment>
      <div className="panel">

        <div className="panel-hdr mb-4">
          <h2>
            Lista de Vendas Por Período - Recebimentos

            <span className="fw-300">
              Por Marca
            </span>
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
            title="Vendas por Marca"
            value={dadosVendasMarca}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dadosVendasMarca.length]}
            totalRecords={dadosVendasMarca.length}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasMarca.map(coluna => (
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