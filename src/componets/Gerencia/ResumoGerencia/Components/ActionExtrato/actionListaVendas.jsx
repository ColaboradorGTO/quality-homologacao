import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../../utils/formatMoeda";


export const ActionListaVendas = ({dadosVendas}) => {


  const dados = dadosVendas.map((item) => {
    let saldoAnterior = 0;
    let totalQuebraCaixa = 0;

    const saldoAnteriorVendas = saldoAnterior + parseFloat(item.venda.VRRECDINHEIRO)
    return {
      VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
      DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,

      saldoAnteriorVendas: saldoAnteriorVendas,
    }
  });

  const colunasVendas = [
    {
      header: 'Dt. Lançamento',
      field: 'DTHORAFECHAMENTOFORMATADA',
      body: row => <p style={{ margin: '0px', width: '150px' }}>{row.DTHORAFECHAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'DTHORAFECHAMENTOFORMATADA',
      body: row => <p style={{ margin: '0px', }}> Mov. Dinherio do Caixa {row.DTHORAFECHAMENTOFORMATADA}</p>,

      sortable: true,
    },
    {
      header: 'Pago A',
      field: '',
      body: row => <p style={{ margin: '0px' }} >Vendas Dinheiro</p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      body: row => <p style={{ margin: '0px' }} ></p>
    },
    {
      header: 'Débito',
      field: '',
      body: row => <p style={{ margin: '0px' }}>0,00</p>,
      sortable: true,
    },
    {
      header: 'Crédito',
      field: 'VRRECDINHEIRO',
      body: row => <p style={{ margin: '0px', }}>{formatMoeda(row.VRRECDINHEIRO)}</p>,
      sortable: true,
    },
    {
      header: 'Saldo',
      field: 'saldoAnteriorVendas',
      body: row => <p style={{ margin: '0px' }}>{formatMoeda(row.saldoAnteriorVendas)}</p>,
      sortable: true,
    },
    {
      header: 'Situação',
      field: '',
      body: row => <p style={{ margin: '0px' }}></p>,
      sortable: true,
    },
  ]


  return (

    <Fragment>
      <DataTable
        title="Vendas por Loja"
        value={dados}
        tableStyle={{ minWidth: '50rem' }}
        selectionMode={"single"}
        dataKey="IDEMPRESA"
        sortField="VRTOTALPAGO"
        sortOrder={-1}
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
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#c0f0eb', border: '1px solid #89e3da' }} />
        ))}
      </DataTable>
    </Fragment>
  )
}