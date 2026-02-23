import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrDocumentPdf } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonSearch } from "../../../Buttons/ButtonSearch";
import { toFloat } from "../../../../utils/toFloat";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";


export const ActionPDFPedidoDetalhado = ({ dadosPedidosDetalhados }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Pedidos Periodo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'QTD Produto', 'Vr. Compra', 'Vr. Venda', 'Vr. Lucro', '(%) Lucro', 'Setor']],
      body: dados.map(item => [
        item.DTPEDIDO,
        item.IDPEDIDO,
        item.NOFANTASIAGRUPO,
        item.NOMECOMPRADOR,
        item.NOFANTASIAFORN,
        toFloat(item.QTDPRODTOTAL),
        formatMoeda(item.VRTOTALCUSTO),
        formatMoeda(item.VRTOTALVENDA),
        formatMoeda(item.VRTOTALLUCRO),
        formatarPorcentagem(item.vrTotalLucro),
        item.DSSETOR == 'COMPRAS' ? 'COMPRAS' : item.DSSETOR == 'CADASTRO' ? 'CADASTRO' : 'COMPRAS ADM',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relacao_pedidos_detalhado.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'QTD Produto', 'Vr. Compra', 'Vr. Venda', 'Vr. Lucro', '(%) Lucro', 'Setor'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Data' },
      { wpx: 100, caption: 'Nº Pedido' },
      { wpx: 150, caption: 'Marca' },
      { wpx: 200, caption: 'Comprador' },
      { wpx: 250, caption: 'Fornecedor' },
      { wpx: 100, caption: 'QTD Produto' },
      { wpx: 100, caption: 'Vr. Compra' },
      { wpx: 100, caption: 'Vr. Venda' },
      { wpx: 100, caption: 'Vr. Lucro' },
      { wpx: 100, caption: '(%) Lucro' },
      { wpx: 200, caption: 'Setor' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Pedidos');
    XLSX.writeFile(workbook, 'relacao_pedidos_detalhado.xlsx');
  };

  const dados = dadosPedidosDetalhados.map((item, index) => {
    let contador = index + 1;
    const vrTotalLucro = (toFloat(item.VRTOTALVENDA * 100) / toFloat(item.VRTOTALCUSTO)) - 100;
    return {
      DTPEDIDO: item.DTPEDIDO,
      IDPEDIDO: item.IDPEDIDO,
      NOFANTASIAGRUPO: item.NOFANTASIAGRUPO,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFANTASIAFORN: item.NOFANTASIAFORN,
      QTDPRODTOTAL: toFloat(item.QTDPRODTOTAL),
      VRTOTALCUSTO: toFloat(item.VRTOTALCUSTO),
      VRTOTALVENDA: toFloat(item.VRTOTALVENDA),
      VRTOTALLUCRO: toFloat(item.VRTOTALLUCRO),
      vrTotalLucro: formatarPorcentagem(vrTotalLucro),
      DSSETOR: item.DSSETOR,

      DSANDAMENTO: item.DSANDAMENTO,
      contador
    }
  })

  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + toFloat(item[field]), 0);
  };

  const calcularTotalPedido = () => {
    const total = calcularTotal('VRTOTALLIQUIDO');
    return total;
  }

  const calcularQtdProduto = () => {
    const total = calcularTotal('QTDPRODTOTAL');
    return total;
  }

  const calcularTotalCompra = () => {
    const total = calcularTotal('VRTOTALCUSTO');
    return total;
  }

  const calcularTotalVenda = () => {
    const total = calcularTotal('VRTOTALVENDA');
    return total;
  }

  const calcularTotalLucro = () => {
    const total = calcularTotal('VRTOTALLUCRO');
    return total;
  }

  const totalVenda = calcularTotalVenda();
  const totalCusto = calcularTotalCompra();
  const percentualLucroTotal = ((totalVenda * 100) / totalCusto) - 100;

  const colunasPedidoResumido = [
    {
      field: 'DTPEDIDO',
      header: 'Data',
      body: row => row.DTPEDIDO,

    },
    {
      field: 'IDPEDIDO',
      header: 'Nº Pedido',
      body: row => row.IDPEDIDO,
    },
    {
      field: 'NOFANTASIAGRUPO',
      header: 'Marca',
      body: row => row.NOFANTASIAGRUPO,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => row.NOMECOMPRADOR,
    },
    {
      field: 'NOFANTASIAFORN',
      header: 'Fornecedor',
      body: row => row.NOFANTASIAFORN,
    },
    {
      field: 'QTDPRODTOTAL',
      header: 'QTD Produto',
      body: row => row.QTDPRODTOTAL,

    },
    {
      field: 'VRTOTALCUSTO',
      header: 'Vr Compra',
      body: row => formatMoeda(row.VRTOTALCUSTO),
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Vr Venda',
      body: row => formatMoeda(row.VRTOTALVENDA),
    },
    {
      field: 'VRTOTALLUCRO',
      header: 'Vr Lucro',
      body: row => formatMoeda(row.VRTOTALLUCRO),
    },
    {
      field: 'totalValorPercentualLucro',
      header: '(%) Lucro',
      body: row => formatarPorcentagem(row.vrTotalLucro),
    },
    {
      field: 'DSSETOR',
      header: 'Setor',
      body: (row) => {
        if (row.DSSETOR == 'COMPRAS') {
          return (
            <p style={{ color: 'blue' }} >COMPRAS</p>
          )

        } else if (row.DSSETOR == 'CADASTRO') {
          return (
            <p estyle={{ color: 'red' }} >CADASTRO</p>
          )

        } else if (row.DSSETOR == 'COMPRASADM') {
          return (
            <p style={{ color: 'red' }}>COMPRAS ADM</p>
          )
        }
      }
    },
  ]


  return (
    <Fragment>
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
        <div
          style={{
            fontWeight: 700,
            fontSize: "16px",
            border: '1px solid #000',
            textAlign: 'center',
            marginBottom: '10px',
            marginTop: '10px'
          }}>

          <h2>RELAÇÃO DE PEDIDOS DETALHADOS</h2>
        </div>
        <DataTable
          title="Pedidos Detalhados"
          value={dados}
          size="small"
          globalFilter={globalFilterValue}
          sortOrder={-1}
          
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
        >
          {colunasPedidoResumido.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: '#212529', backgroundColor: "transparent", border: '1px solid #000', fontSize: '0.688rem', textAlign: 'center' }}
              footerStyle={{ color: '#212529', backgroundColor: "transparent", border: '1px solid #000', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.688rem', backgroundColor: 'transparent', border: '1px solid #000', textAlign: 'initial' }}

            />
          ))}
        </DataTable>

        <table className="mt-3" style={{ width: '30%', }}>
          <tbody>

            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }} >Quantidade de Pedidos:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}><b>{dados.length}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }}>QTD Produtos:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}><b>{calcularQtdProduto()}</b></th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }}>Valor Total Compra:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}>{formatMoeda(calcularTotalCompra())}</th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }}>Valor Total Venda:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}>{formatMoeda(calcularTotalVenda())}</th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }}>Valor Total Lucro:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}>{formatMoeda(calcularTotalLucro())}</th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 400 }}>% Total Lucro:</th>
              <th style={{ textAlign: 'right', fontSize: '1rem' }}>{formatarPorcentagem(percentualLucroTotal)}</th>
            </tr>
          </tbody>

        </table>
      </div>
    </Fragment>
  )
}