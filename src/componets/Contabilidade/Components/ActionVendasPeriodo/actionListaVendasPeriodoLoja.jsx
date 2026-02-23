import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../utils/formatMoeda";



export const ActionListaVendasPeriodoLoja = ({dadosVendasPeriodo}) => {

  const calcularTotalQTDProduto = () => {
    let total = 0;
    for(let venda of dadosVendas) {
      total += parseFloat(venda.QTD)
    }
    return total;
  }

  const calcularTotalValorProduto = () => {
    let total = 0;
    for(let venda of dadosVendas) {
      total += parseFloat(venda.VALORPROD)
    }
    return total;
  }

  const calcularTotalValorDesconto = () => {
    let total = 0;
    for(let venda of dadosVendas) {
      total += parseFloat(venda.VALORDESCONTO)
    }
    return total;
  }

  const calcularTotalValorNF = () => {
    let total = 0;
    for(let venda of dadosVendas) {
      total += parseFloat(venda.VALORNF)
    }
    return total;
  }

  const dadosVendas = dadosVendasPeriodo.map((item, index) => {
    let contador = index + 1;
    return {
      NOFANTASIA: item.NOFANTASIA,
      DATAEMISSAO: item.DATAEMISSAO,
      VALORPROD: item.VALORPROD,
      QTD: item.QTD,
      VALORDESCONTO: item.VALORDESCONTO,
      VALORNF: item.VALORNF,
      contador
    }
  })

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
      colSpan: 3
    },
    {
      field: 'DATAEMISSAO',
      header: 'Data',
      body: row => row.DATAEMISSAO,
      sortable: true,
      
    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => row.QTD,
      sortable: true,
      footer: calcularTotalQTDProduto()
    },
    {
      field: 'VALORPROD',
      header: 'Vr Total',
      body: row => formatMoeda(row.VALORPROD),
      sortable: true,
      footer: formatMoeda(calcularTotalValorProduto())
    },
    {
      field: 'VALORDESCONTO',
      header: 'Desconto',
      body: row => formatMoeda(row.VALORDESCONTO),
      sortable: true,
      footer: formatMoeda(calcularTotalValorDesconto())
    },
    {
      field: 'VALORNF',
      header: 'Vr NF',
      body: row => formatMoeda(row.VALORNF),
      sortable: true,
      footer: formatMoeda(calcularTotalValorNF())
    },
  ]

  return (

    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosVendas}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
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
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>
    </Fragment >
  )
}

