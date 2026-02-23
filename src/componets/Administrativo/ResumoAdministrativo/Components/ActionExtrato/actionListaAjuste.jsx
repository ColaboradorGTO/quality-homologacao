import { Fragment, useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const ActionListaAjuste = ({ 
  dadosAjusteExtrato,
  dadosTotalDepositos, 
  dadosVendas,
  dadosTotalFaturas,
  dadosTotalDespesas,
  dadosTotalAdiantamentos
}) => {
  
  const dados = dadosAjusteExtrato.map((item) => {
    let saldoAnterior = 0;
    return {

      IDAJUSTEEXTRATO: item.ajusteextrato.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: item.ajusteextrato.DTCADASTROFORMATADA,
      VRDEBITO: item.ajusteextrato.VRDEBITO,
      VRCREDITO: item.ajusteextrato.VRCREDITO,
      HISTORICO: item.ajusteextrato.HISTORICO,
      STCANCELADO: item.ajusteextrato.STCANCELADO,
      
      saldoAnterior: saldoAnterior,
    }
  });

  const colunasAjuste = [
    {
      header: 'Dt. Lançamento',
      field: 'DTCADASTROFORMATADA',
      body: row => <p style={{margin:  '0px', width: '150px'}}>{row.DTCADASTROFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'HISTORICO',
      body: row => <p style={{margin:  '0px', }}> {row.HISTORICO}</p>,
      
      sortable: true,
    },
    {
      header: 'Pago A',
      field: '',
      body: row => <p style={{margin:  '0px'}} >Ajuste de Extrato</p>,
      sortable: true,
    },
    {
      field: '',
      header: 'Despesa',
      body: row => <p style={{margin:  '0px'}} >{}</p>
    },
    {
      field: 'VRDEBITO',
      header: 'Débito',
      body: row => <p style={{margin:  '0px'}}>{row.VRDEBITO}</p>,
      sortable: true,
    },
    {
      header: 'Crédito',
      field: 'VRCREDITO',
      body: row => {
        if(row.VRCREDITO > 0) {
          return (
            
            <p style={{margin:  '0px', }}>
             {row.saldoAnterior} - {formatMoeda(row.VRCREDITO)}
            </p>
          )

        } else {
          return (
            <p style={{margin:  '0px', }}>
            {row.saldoAnterior} +  {formatMoeda(row.VRDEDITO)}
            </p>
          )
        }
      },
      sortable: true,
    },
    {
      header: 'Saldo',
      field: 'saldoAnterior',
      body: row => <p style={{margin:  '0px'}}>{parseFloat(row.saldoAnterior).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</p>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <p 
        style={{color: row.STCANCELADO == 'True' ? 'blue' : 'red', margin:  '0px' }}
      >{row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}</p>,
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
        {colunasAjuste.map(coluna => (
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