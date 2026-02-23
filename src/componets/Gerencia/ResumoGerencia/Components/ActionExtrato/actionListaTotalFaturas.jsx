import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import { toFloat } from "../../../../../utils/toFloat";
import { mascaraValor } from "../../../../../utils/mascaraValor";
import { dataFormatada } from "../../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../../utils/formatMoeda";



export const ActionListaTotalFaturas = ({ dadosTotalFaturas, dadosVendas }) => {

  const dados = dadosTotalFaturas.map((item) => { 

    const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO)
    const saldoAnteriorFaturas = saldoAnteriorVendas + parseFloat(item.VRRECEBIDO)
    return {
      DTPROCESSAMENTOFORMATADA: item.DTPROCESSAMENTOFORMATADA,
      VRRECEBIDO: item.VRRECEBIDO,
      saldoAnteriorFaturas: saldoAnteriorFaturas,
    }
  });

  const colunasFaturas = [
    {
      header: 'Dt. Lançamento',
      field: 'DTPROCESSAMENTOFORMATADA',
      body: row => <p style={{margin:  '0px', width: '134px'}} >{row.DTPROCESSAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'DTPROCESSAMENTOFORMATADA',
      body: row => <p style={{margin: '0px'}} > Mov. Fatura {row.DTPROCESSAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'FUNCIONARIOMOV',
      body: row => <p style={{margin: '0px', }}  >Recebimento de Faturas</p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: '',
      body: row => <p style={{margin: '0px', }}  > </p>,
    },
    {
      header: 'Débito',
      field: '',
      body: row => <p style={{margin: '0px', }} >0,00</p>,
      sortable: true,
    },
    {
      header: 'Crédito',
      field: 'VRRECEBIDO',
      body: row => <p style={{margin: '0px', }} >{formatMoeda(row.VRRECEBIDO)}</p>,
      sortable: true,
    },
    {
      header: 'Saldo ',
      field: 'saldoAnteriorFaturas',
      body: row => <p style={{margin: '0px', width: '5rem'}} > {formatMoeda(row.saldoAnteriorFaturas)} </p>,
      sortable: true,
    },
    {
      header: 'Situação ',
      field: '',
      body: row => <p style={{margin: '0px', }} >  </p>,
      sortable: true,
    },
  ]

  return (

    <Fragment>
  
        <DataTable
          title="Vendas por Loja"
          value={dados}
          // headerStyle={{display: 'none'}}
          tableStyle={{ minWidth: '50rem' }}
          selectionMode={"single"}
          dataKey="IDEMPRESA"
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
        >
          {colunasFaturas.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}
              body={coluna.body}
              footer={coluna.footer}
              headerStyle={{display: 'none'}}
              // headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9 ", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#ABEBE4', border: '1px solid #89e3da' }} />
          ))}
        </DataTable>
     
    </Fragment>
  )
}