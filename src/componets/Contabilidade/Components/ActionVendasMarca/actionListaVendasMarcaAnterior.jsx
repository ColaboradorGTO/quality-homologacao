import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaVendasMarcaAnterior = ({dadosVendasMarca}) => {
  
  const calcularValorBruto = (item) => {
    return (
      toFloat(item.vendaMarca.VRTOTALLIQUIDO) +
      toFloat(item.valorDesconto)
    );
  }

  const calcularValorLiquido = (item) => {
    return (
      toFloat(item.valorPago) - toFloat(item.voucher)
    )
  }

  const calcularTotalQtdProduto = () => {
    let total = 0;
    for (let venda of dados) {
      total += parseFloat(venda.QTD);
    }
    return total;
  }
  const calcularTotalValorBruto = () => {
    let total = 0;
    for (let venda of dados) {
      total += venda.valorProduto;
    }
    return total;
  }

  const calcularTotalValorDesconto = () => {
    let total = 0;
    for (let venda of dados) {
      total += parseFloat(venda.valorDesconto);
    }
    return total;
  }

  const calcularTotalVendaBrutaDesconto = () => {
    let total = 0;
    for (let venda of dados) {
      total += parseFloat(venda.VRTOTALLIQUIDO);
    }
    return total;
  }

  const calcularTotalVoucher = () => {
    let total = 0;
    for (let venda of dados) {
      total += parseFloat(venda.voucher);
    }
    return total;
  }

  const calcularTotalValorLiquido = () => {
    let total = 0;
    for (let venda of dados) {
      total += venda.valorLiquido;
    }
    return total;
  }
  const dados = dadosVendasMarca.map((item, index) => {
    let contador = index + 1;
    const valorProduto = calcularValorBruto(item);
    const valorLiquido = calcularValorLiquido(item);
    return {
      valorDesconto: item.valorDesconto,
      valorPago: item.valorPago,

      IDEMPRESA: item.vendaMarca.IDEMPRESA,
      NOFANTASIA: item.vendaMarca.NOFANTASIA,
      QTD: parseFloat(item.vendaMarca.QTD),
      TOTALCUSTO: parseFloat(item.vendaMarca.TOTALCUSTO),
      VRTOTALLIQUIDO: item.vendaMarca.VRTOTALLIQUIDO,
      valorProduto: valorProduto,
      valorLiquido: valorLiquido,
      voucher: item.voucher,
      contador
    };
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: '#',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => row.NOFANTASIA,
      sortable: true,
      footer: 'Total',
    },
    {
      field: 'QTD',
      header: 'QTD Total Produto',
      body: row => parseFloat(row.QTD),
      sortable: true,
      footer: calcularTotalQtdProduto(),
    },
    {
      field: 'valorProduto',
      header: 'Venda Bruta',
      body: row => formatMoeda(row.valorProduto),
      sortable: true,
      footer: formatMoeda(calcularTotalValorBruto()),
    },
    {
      field: 'valorDesconto',
      header: 'Desconto',
      body: row => formatMoeda(row.valorDesconto),
      sortable: true,
      footer: formatMoeda(calcularTotalValorDesconto()),
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Venda Bruta ( - Desc)',
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
      sortable: true,
      footer: formatMoeda(calcularTotalVendaBrutaDesconto()),
    },
    {
      field: 'voucher',
      header: 'Voucher',
      body: row => formatMoeda(row.voucher),
      sortable: true,
      footer: formatMoeda(calcularTotalVoucher()),
    },
    {
      field: 'valorLiquido',
      header: 'Venda Líquida',
      body: row => formatMoeda(row.valorLiquido),
      sortable: true,
      footer: formatMoeda(calcularTotalValorLiquido()),
    },
  ]

 

  return (

    <Fragment>
  
        <div className="card">
          <DataTable
            title="Vendas por Loja"
            value={dados}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>

        </div>

    </Fragment>
  )
}

