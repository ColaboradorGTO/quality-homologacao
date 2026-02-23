import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";



export const ActionListaAdiantamentos = ({  dadosTotalAdiantamentos, dadosVendas, dadosTotalFaturas, dadosTotalDespesas}) => {

  const dados = dadosTotalAdiantamentos.map((item) => {
    const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO)
    const saldoAnteriorFaturas = parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO) + parseFloat(saldoAnteriorVendas);
    const saldoAnteriorDespesas =  saldoAnteriorFaturas - parseFloat(dadosTotalDespesas[0]?.VRDESPESA)

    const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(item.VRVALORDESCONTO)
 
    return {
   
      DTLANCAMENTOADIANTAMENTO: item.DTLANCAMENTOADIANTAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      DSMOTIVO: item.DSMOTIVO,
      VRVALORDESCONTO: item.VRVALORDESCONTO,
      saldoAnteriorAdiantamentos: saldoAnteriorAdiantamentos,
    }
  });

  const colunasAdiantamentos = [
    {
      header: 'Dt. Lançamento',
      field: 'DTLANCAMENTOADIANTAMENTO',
      body: row => <p style={{margin:  '0px', width: '150px'}} >{row.DTLANCAMENTOADIANTAMENTO}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: '',
      body: row => <p style={{margin:  '0px',maxWidth: '18rem' }}>Adiantamento de Salário </p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'NOFUNCIONARIO',
      body: row => <p style={{margin:  '0px'}}>{row.NOFUNCIONARIO} </p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: 'DSMOTIVO',
      body: row => <p style={{margin:  '0px'}}>{row.DSMOTIVO} </p>,
    },
    {
      header: 'Débito',
      field: 'VRVALORDESCONTO',
      body: row => <p style={{margin:  '0px', color: 'red'}}>{formatMoeda(row.VRVALORDESCONTO)}</p>,
      sortable: true,
    },
    {
      header: 'Crédito',
      field: '',
      body: row => <p style={{margin:  '0px'}}>0,00</p>,
      sortable: true,
    },
    {
      field: 'saldoAnteriorAdiantamentos',
      header: 'Saldo',
      body: row => <p style={{margin:  '0px'}}>{formatMoeda(row.saldoAnteriorAdiantamentos)}</p>,
      sortable: true,
    },
    {
      header: 'Situação',
      field: 'STCONFERIDO',
      body: row => <p style={{margin: '0px'}}></p> ,
      sortable: true,
    },
  ]

  return (

    <Fragment>
     
      <DataTable
        title="Vendas por Loja"
        value={dados}
        tableStyle={{ minWidth: '50rem' }}
        // headerStyle={{display: 'none'}}
        selectionMode={"single"}
        dataKey="IDEMPRESA"
        sortField="VRTOTALPAGO"
        sortOrder={-1}
        showGridlines
        stripedRows
        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
      >
        {colunasAdiantamentos.map(coluna => (
          <Column
            key={coluna.field}
            field={coluna.field}
            header={coluna.header}
            body={coluna.body}
            headerStyle={{display: 'none'}}
            // headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
            footer={coluna.footer}
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#a90250', border: '1px solid #7a59ad' }} />
        ))}
      </DataTable>
  
    </Fragment>
  )
}