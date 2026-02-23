import { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



export const ActionListaVendasDigitalMarca = ({dadosVendasMarca}) => {

  const dados = dadosVendasMarca.map((item) => {

    return {
      NOFANTASIA: item.NOFANTASIA,
      QTDTOTAL: parseFloat(item.QTDTOTAL),
      VRTOTALVENDA: parseFloat(item.VRTOTALVENDA).toFixed(2),
      VRPOS: item.VRPOS,
    }
  });


  const colunasVendas = [
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => row.NOFANTASIA,
      sortable: true,
    },

    {
      field: 'QTDTOTAL',
      header: 'QTD Produtos',
      body: row => parseFloat(row.QTDTOTAL),
      sortable: true,
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Valor Vendido',
      body: row => formatMoeda(row.VRTOTALVENDA),
      sortable: true,
    },

  ]



  return (

    <Fragment>

      <DataTable
        title="Vendas por Loja"
        value={dados}
        sortField="VRTOTALPAGO"
        sortOrder={-1}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        showGridlines
        stripedRows
        emptyMessage="Sem Registros para Exibir"
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
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem' }}

          />

        ))}

      </DataTable>

    </Fragment>
  )
}

