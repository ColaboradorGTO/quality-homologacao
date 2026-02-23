import { Fragment } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";



export const ActionListaDespesas = ({  dadosTotalDespesas, dadosVendas, dadosTotalFaturas}) => {
  
  const dados = dadosTotalDespesas.map((item) => {
    const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO)
    const saldoAnteriorFaturas = parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO) + parseFloat(saldoAnteriorVendas);
    const saldoAnteriorDespesas =  saldoAnteriorFaturas - parseFloat(item.VRDESPESA)

    return {
   
      DTDESPESAFORMATADA: item.DTDESPESAFORMATADA,
      DSPAGOA: item.DSPAGOA,
      DSHISTORIO: item.DSHISTORIO,
      DSCATEGORIA: item.DSCATEGORIA,
      VRDESPESA: item.VRDESPESA,
      saldoAnteriorDespesas: saldoAnteriorDespesas,
    
    }
  });

  const colunasDespesas = [
    {
      header: 'Dt. Lançamento',
      field: 'DTDESPESAFORMATADA',
      body: row => <p style={{margin:  '0px', width: '150px'}} >{row.DTDESPESAFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'DSHISTORIO',
      body: row => <p style={{margin:  '0px',maxWidth: '18rem' }}>{row.DSHISTORIO} </p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'DSPAGOA',
      body: row => <p style={{margin:  '0px'}}>{row.DSPAGOA} </p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: 'DSCATEGORIA',
      body: row => <p style={{margin:  '0px'}}>{row.DSCATEGORIA} </p>,
    },
    {
      header: 'Débito',
      field: 'VRDESPESA',
      body: row => <p style={{margin:  '0px', color: 'red'}}>{row.VRDESPESA}</p>,
      sortable: true,
    },
    {
      header: 'Crédito',
      field: '',
      body: row => <p style={{margin:  '0px'}}>0,00</p>,
      sortable: true,
    },
    {
      header: 'Saldo',
      field: 'saldoAnteriorDespesas',
      body: row => <p style={{margin:  '0px'}}>{formatMoeda(row.saldoAnteriorDespesas)}</p>,
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
        {colunasDespesas.map(coluna => (
          <Column
            key={coluna.field}
            field={coluna.field}
            header={coluna.header}
            body={coluna.body}
            headerStyle={{display: 'none'}}
            // headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
            footer={coluna.footer}
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#530227', border: '1px solid #7a59ad' }} />
        ))}
      </DataTable>
  
    </Fragment>
  )
}