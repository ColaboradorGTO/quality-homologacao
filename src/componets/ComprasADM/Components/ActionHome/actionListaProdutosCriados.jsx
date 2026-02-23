import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";



export const ActionListaProdutosCriados = ({ dadosListaProdutosCriados }) => {

  const dadosProdutosCriado = dadosListaProdutosCriados.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOPEDIDO: item.IDRESUMOPEDIDO,
      DTCADASTRO: item.DTCADASTRO,
      IDDETALHEPRODUTOPEDIDO: item.IDDETALHEPRODUTOPEDIDO,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      CODBARRAS: item.CODBARRAS,
      DSPRODUTO: item.DSPRODUTO,
      NUNCM: item.NUNCM,
      DSTAMANHO: item.DSTAMANHO,
      QTDPRODUTO: item.QTDPRODUTO,
      VRCUSTO: item.VRCUSTO,
      VRVENDA: item.VRVENDA,
      VRTOTALCUSTO: item.VRTOTALCUSTO,
      QTDESTOQUEIDEAL: item.QTDESTOQUEIDEAL,
      contador
    }
  });

  const colunasProdutosCriado = [
    {
      header: 'Nº',
      body: row => <p style={{color: 'blue'}}>{row.contador}</p>,
      sortable: true,
    },
    {
      header: 'Dt. Pedido',
      body: row => <p style={{color: 'blue'}}>{dataFormatada(row.DTCADASTRO)}</p>,
      sortable: true,
    },
    {
      header: 'Pedido',
      body: row => <p style={{color: 'blue'}}>{row.IDRESUMOPEDIDO}</p>,
      sortable: true,
    },
    {
      header: 'Cód. Barra',
      body: row => <p style={{color: 'blue'}}>{row.CODBARRAS}</p>,
      sortable: true,
    },
    {
      header: 'Produto ',
      body: row => {
        return (
          <p style={{color: 'blue', width: '120px'}}>{row.DSPRODUTO}</p>
        )
      }, 
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Estrutura',
      body: row => <p style={{color: 'blue'}}>{row.DSSUBGRUPOESTRUTURA}</p>,
      sortable: true,
    },
    {
      header: 'NCM',
      body: row => <p style={{color: 'blue'}}>{parseFloat(row.NUNCM)}</p>,
      sortable: true,
    },
    {
      header: 'TM',
      body: row => <p style={{color: 'blue'}}>{row.DSTAMANHO}</p>,
      sortable: true,
    },
    {
      header: 'QTD',
      body: row => <p style={{color: 'blue'}}>{parseFloat(row.QTDPRODUTO)}</p>,
      sortable: true,
    },
    {
      header: 'Vr Custo',
      body: row => <p style={{color: 'blue'}}>{formatMoeda(row.VRCUSTO)}</p>,
      sortable: true,
    },
    {
      header: 'Vr Venda',
      body: row => <p style={{color: 'blue'}}>{formatMoeda(row.VRVENDA)}</p>,
      sortable: true,
    },
    {
      header: 'Total Venda',
      body: row => <p style={{color: 'blue'}}>{formatMoeda(row.VRTOTALCUSTO)}</p>,
      sortable: true,
    },
    {
      header: 'Estoque Ideal',
      body: row => <p style={{color: 'blue'}}>{parseFloat(row.QTDESTOQUEIDEAL)}</p>,
      sortable: true,
    },
    
  ]

  return (
    <Fragment>
      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dadosProdutosCriado}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          rows={10}
          paginator={true}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasProdutosCriado.map(coluna => (
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