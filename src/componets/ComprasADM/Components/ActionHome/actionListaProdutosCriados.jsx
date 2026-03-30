import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataHoraFormatada } from "../../../../utils/dataFormatada";


export const ActionListaProdutosCriados = ({ dadosProdutosCriados }) => {

  const dados = dadosProdutosCriados?.map((item, index) => {
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
      body: row => <th style={{color: 'blue'}}>{row.contador}</th>,
      sortable: true,
    },
    {
      header: 'Dt. Pedido',
      body: row => <th style={{color: 'blue'}}>{dataHoraFormatada(row.DTCADASTRO)}</th>,
      sortable: true,
    },
    {
      header: 'Pedido',
      body: row => <th style={{color: 'blue'}}>{row.IDRESUMOPEDIDO}</th>,
      sortable: true,
    },
    {
      header: 'Cód. Barra',
      body: row => <th style={{color: 'blue'}}>{row.CODBARRAS}</th>,
      sortable: true,
    },
    {
      header: 'Produto ',
      body: row => {
        return (
          <p style={{color: 'blue', width: '200px', fontWeight: 600}}>{row.DSPRODUTO}</p>
        )
      }, 
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Estrutura',
      body: row => <p style={{color: 'blue', width: '150px', fontWeight: 600}}>{row.DSSUBGRUPOESTRUTURA}</p>,
      sortable: true,
    },
    {
      header: 'NCM',
      body: row => <th style={{color: 'blue'}}>{parseFloat(row.NUNCM)}</th>,
      sortable: true,
    },
    {
      header: 'TM',
      body: row => <th style={{color: 'blue'}}>{row.DSTAMANHO}</th>,
      sortable: true,
    },
    {
      header: 'QTD',
      body: row => <th style={{color: 'blue'}}>{parseFloat(row.QTDPRODUTO)}</th>,
      sortable: true,
    },
    {
      header: 'Vr Custo',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRCUSTO)}</th>,
      sortable: true,
    },
    {
      header: 'Vr Venda',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRVENDA)}</th>,
      sortable: true,
    },
    {
      header: 'Total Venda',
      body: row => <th style={{color: 'blue'}}>{formatMoeda(row.VRTOTALCUSTO)}</th>,
      sortable: true,
    },
    {
      header: 'Estoque Ideal',
      body: row => <th style={{color: 'blue'}}>{parseFloat(row.QTDESTOQUEIDEAL)}</th>,
      sortable: true,
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
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
              footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
      </div>
    </Fragment>
  )
}