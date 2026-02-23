import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export const ActionListaVendasPeriodoSaldo = ({ dadosVendasSaldo }) => {

  const calcularTotalQTDVendaSaldo = () => {
    let total = 0;
    for (let venda of dadosListaSaldo) {
      total += parseFloat(venda.QTDSAIDAVENDA)
    }
    return total;
  }

  const calcularTotalQTDEstoqueSaldo = () => {
    let total = 0;
    for (let venda of dadosListaSaldo) {
      total += parseFloat(venda.QTDSALDO)
    }
    return total;
  }

  const calcularTotalQTDEstoqueDataSaldo = () => {
    let total = 0;
    for (let venda of dadosListaSaldo) {
      total += parseFloat(venda.QTDSALDODATA)
    }
    return total;
  }

  const dadosListaSaldo = dadosVendasSaldo.map((item, index) => {
    let contador = index + 1;
    return {

      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      GRUPOPRODUTO: item.GRUPOPRODUTO,
      NOMEGRUPO: item.NOMEGRUPO,
      PN: item.PN,
      NOFANTASIA: item.NOFANTASIA,
      QTDSAIDAVENDA: item.QTDSAIDAVENDA,
      QTDSALDO: item.QTDSALDO,
      QTDSALDODATA: item.QTDSALDODATA,
      contador
    }
  })

  const colunasVendasSaldo = [
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
    },
    {
      field: 'PN',
      header: 'Fornecedor',
      body: row => row.PN,
      sortable: true,
    },
    {
      field: 'GRUPOPRODUTO',
      header: 'Grupo',
      body: row => row.GRUPOPRODUTO,
      sortable: true,
    },
    {
      field: 'NOMEGRUPO',
      header: 'Grade',
      body: row => row.NOMEGRUPO,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cod. Produto',
      body: row => row.NUCODBARRAS,
      sortable: true,
      footer: 'Total',
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => row.DSNOME,
      sortable: true,
    },
    {
      field: 'QTDSAIDAVENDA',
      header: 'Qtd Venda',
      body: row => row.QTDSAIDAVENDA,
      sortable: true,
      footer: calcularTotalQTDVendaSaldo()
    },
    {
      field: 'QTDSALDO',
      header: 'Estoque Atual',
      body: row => row.QTDSALDO,
      sortable: true,
      footer: calcularTotalQTDEstoqueSaldo()
    },
    {
      field: 'QTDSALDODATA',
      header: 'Estoque Por Data',
      body: row => row.QTDSALDODATA,
      sortable: true,
      footer: calcularTotalQTDEstoqueDataSaldo()
    },

  ]


  return (

    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaSaldo}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasVendasSaldo.map(coluna => (
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

    </Fragment>
  )
}

