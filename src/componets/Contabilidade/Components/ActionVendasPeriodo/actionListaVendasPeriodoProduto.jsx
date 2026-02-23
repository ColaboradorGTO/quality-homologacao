import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from "../../api/funcRequest"
import { formatMoeda } from "../../../utils/formatMoeda";
import { dataFormatada } from "../../../utils/dataFormatada";



export const ActionListaVendasPeriodoProduto = ({dadosVendasConsolidadas}) => {

  const calcularTotalQTDProdutoConsolidado = () => {
    let total = 0;
    for(let venda of dadosListaVendasConsolidadas) {
      total += parseFloat(venda.QTD)
    }
    return total;
  }

  const calcularTotalValorProdutoConsolidado = () => {
    let total = 0;
    for(let venda of dadosListaVendasConsolidadas) {
      total += parseFloat(venda.VALORPROD)
    }
    return total;
  }

  const calcularDescontoConsolidado = () => {
    let total = 0;
    for(let venda of dadosListaVendasConsolidadas) {
      total += parseFloat(venda.VALORDESCONTO)
    }
    return total;
  }

  const calcularValorNFConsolidado = () => {
    let total = 0;
    for(let venda of dadosListaVendasConsolidadas) {
      total += parseFloat(venda.VALORNF)
    }
    return total;
  }

  const dadosListaVendasConsolidadas = dadosVendasConsolidadas.map((item, index) => {
    let contador = index + 1;
    return {
      DATAEMISSAO: item.DATAEMISSAO,
      VALORUNITPROD: item.VALORUNITPROD,
      VALORPROD: item.VALORPROD,
      QTD: item.QTD,
      VALORDESCONTO: item.VALORDESCONTO,
      VALORNF: item.VALORNF,
      CODPRODUTO: item.CODPRODUTO,
      DESCRICAO: item.DESCRICAO,
      NCM: item.NCM,
      contador
    }
  })

  const colunasVendasConsolidadas = [
    {
      field: 'contador',
      header: '#',
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'DATAEMISSAO',
      header: 'Data',
      body: row => dataFormatada(row.DATAEMISSAO),
      sortable: true,
    },
    {
      field: 'VALORUNITPROD',
      header: 'Vr Unitário',
      body: row => formatMoeda(row.VALORUNITPROD),
      sortable: true,
      footer: 'Total',
    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => parseFloat(row.QTD),
      sortable: true,
      footer: calcularTotalQTDProdutoConsolidado()
    },
    {
      field: 'VALORPROD',
      header: 'Vr Total',
      body: row => formatMoeda(row.VALORPROD),
      sortable: true,
      footer: formatMoeda(calcularTotalValorProdutoConsolidado())
    },
    {
      field: 'VALORDESCONTO',
      header: 'Desconto',
      body: row => formatMoeda(row.VALORDESCONTO),
      sortable: true,
      footer: formatMoeda(calcularDescontoConsolidado())
    },
    {
      field: 'VALORNF',
      header: 'Vr NF',
      body: row => formatMoeda(row.VALORNF),
      sortable: true,
      footer: formatMoeda(calcularValorNFConsolidado())
    },
    {
      field: 'CODPRODUTO',
      header: 'Cód Produto',
      body: row => row.CODPRODUTO,
      sortable: true,
    },
    {
      field: 'DESCRICAO',
      header: 'Produto',
      body: row => row.DESCRICAO,
      sortable: true,
    },
    {
      field: 'NCM',
      header: 'NCM',
      body: row => row.NCM,
      sortable: true,
    },
    
  ]


  return (

    <Fragment>



          <div className="card">
            <DataTable
              title="Vendas por Loja"
              value={dadosVendasConsolidadas}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasVendasConsolidadas.map(coluna => (
                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                  footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}

                />
              ))}
            </DataTable>
          </div>

   

        {tabelaConsolidadaVisivel && (
          <div className="card">
            <DataTable
              title="Vendas por Loja"
              value={dadosListaVendasConsolidadas}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasVendasConsolidadas.map(coluna => (
                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                  footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}

                />
              ))}
            </DataTable>
          </div>
        )}

        {tabelaSaldoVisivel && (
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
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}

                />
              ))}
            </DataTable>
          </div>
        )}
        

    </Fragment >
  )
}

