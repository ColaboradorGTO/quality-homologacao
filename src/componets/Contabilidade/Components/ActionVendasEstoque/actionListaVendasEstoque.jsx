import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionListaVendasEstoque = ({dadosEstoqueAtual}) => {

  const dadosListaEstoque = dadosEstoqueAtual.map((item, index) => {
    let contador = index + 1;
    let MarkUp = 0;
    return {
      NOMEGRUPO: item.NOMEGRUPO,
      DSNOME: item.DSNOME,
      NUCODBARRAS: item.NUCODBARRAS,
      QTDSAIDAVENDA: item.QTDSAIDAVENDA,
      QTDSALDO: item.QTDSALDO,
      PRECOCUSTO: item.PRECOCUSTO,
      PRECO_VENDA: item.PRECO_VENDA,
      contador,
      MarkUp, //Falta Formula
    }
  })

  const colunasEstoque = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NOMEGRUPO',
      header: 'Grade',
      body: row => row.NOMEGRUPO,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => row.DSNOME,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Referência',
      body: row => row.NUCODBARRAS,
      sortable: true,
    },
    {
      field: 'QTDSAIDAVENDA',
      header: 'QTD Venda',
      body: row => parseFloat(row.QTDSAIDAVENDA),
      sortable: true,
    },
    {
      field: 'QTDSALDO',
      header: 'Estoqeu/Venda',
      body: row => parseFloat(row.QTDSALDO),
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'Pç Compra',
      body: row => formatMoeda(row.PRECOCUSTO),
      sortable: true,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Pç Venda',
      body: row => formatMoeda(row.PRECO_VENDA),
      sortable: true,
    },
    {
      field: 'MarkUp',
      header: 'MarkUp',
      body: row => row.MarkUp,
      sortable: true,
    }

  ]

  return (

    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosListaEstoque}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasEstoque.map(coluna => (
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
    </Fragment >
  )
}

