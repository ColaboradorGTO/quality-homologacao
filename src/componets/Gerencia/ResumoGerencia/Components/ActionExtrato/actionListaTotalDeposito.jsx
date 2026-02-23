import { Fragment, useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { mascaraValor } from "../../../../../utils/mascaraValor";

export const ActionListaTotalDeposito = ({ 
  dadosTotalDepositos, 
  dadosVendas,
  dadosTotalFaturas,
  dadosTotalDespesas,
  dadosTotalAdiantamentos,
  dadosExtratoQuebra
}) => {

  const calcularTotalDinheiroInformado = () => {
    let totalDinheiroInformado = 0;
    if (dadosExtratoQuebra.VRAJUSTDINHEIRO > 0) {
      totalDinheiroInformado = toFloat(dadosExtratoQuebra.VRAJUSTDINHEIRO);
    } else {
      totalDinheiroInformado = toFloat(dadosExtratoQuebra.VRRECDINHEIRO);
    }
    return totalDinheiroInformado;
  };
  
  const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO);
  const saldoAnteriorFaturas = saldoAnteriorVendas + parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO);
  const saldoAnteriorDespesas = saldoAnteriorFaturas - parseFloat(dadosTotalDespesas[0]?.VRDESPESA ?? 0);
  const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0);
  const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(dadosExtratoQuebra.VRFISICODINHEIRO)
  const saldoInicial = saldoAnteriorAdiantamentos  - totalQuebraCaixa;
  // console.log('saldoInicial', saldoInicial)
  // console.log('totalQuebraCaixa', totalQuebraCaixa)
  
  
  let saldoAcumulado = saldoInicial;
  const dados = dadosTotalDepositos.map((item) => {
    
    
    const saldoAnteriorQuebra = saldoAcumulado + totalQuebraCaixa;
    const saldoAnteriorDepositos = saldoAnteriorQuebra - parseFloat(item.VRDEPOSITO);
    
    saldoAcumulado = saldoAnteriorDepositos;


    return {
      IDDEPOSITOLOJA: item.IDDEPOSITOLOJA,
      DTDEPOSITOFORMATADA: item.DTDEPOSITOFORMATADA,
      DTMOVIMENTOCAIXAFORMATADA: item.DTMOVIMENTOCAIXAFORMATADA,
      FUNCIONARIO: item.FUNCIONARIO,
      VRDEPOSITO: item.VRDEPOSITO,
      DSBANCO: item.DSBANCO,
      STCANCELADO: item.STCANCELADO,
      STCONFERIDO: item.STCONFERIDO,
      NUDOCDEPOSITO: item.NUDOCDEPOSITO,
      saldoAnteriorDepositos: saldoAnteriorDepositos,
    };
  });

  const colunasDepositos = [
    {
      header: 'Dt. Lançamento',
      field: 'DTDEPOSITOFORMATADA',
      body: row => <p style={{margin:  '0px', width: '150px'}} >{row.DTDEPOSITOFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Histórico',
      field: 'FUNCIONARIO',
      body: row => <p style={{margin:  '0px',maxWidth: '18rem' }}>{row.FUNCIONARIO} Dep. Dinh  - Data do Movimento: {row.DTMOVIMENTOCAIXAFORMATADA}</p>,
      sortable: true,
    },
    {
      header: 'Pago A',
      field: 'DSBANCO',
      body: row => <p style={{margin:  '0px'}}>{row.DSBANCO} - {row.NUDOCDEPOSITO}</p>,
      sortable: true,
    },
    {
      header: 'Despesa',
      field: 'VRDEPOSITO',
      body: row => <p style={{margin:  '0px'}}>{formatMoeda(row.VRDEPOSITO)} </p>,
    },
    {
      header: 'Débito',
      field: '',
      body: row => <p style={{margin:  '0px'}}>0,00</p>,
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
      field: 'saldoAnteriorDepositos',
      body: row => <p style={{margin:  '0px'}}>{formatMoeda(row.saldoAnteriorDepositos)}</p>,
      sortable: true,
    },
    {
      header: 'Situação',
      field: 'STCONFERIDO',
      body: row => {
        if(row.STCONFERIDO == 'False' || row.STCONFERIDO == null || row.STCONFERIDO == ''){
          return (
            <p style={{ color: 'red' }}> Sem Conferir </p>
          )
        } else {
          return (
            <p style={{ color: 'blue' }}> Conferido </p>
          )
        }
      },
      sortable: true,
    },
  ];

  return (
    <Fragment>
      <DataTable
        title="Extrato de Depósitos"
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
        {colunasDepositos.map(coluna => (
          <Column
            key={coluna.field}
            field={coluna.field}
            header={coluna.header}
            body={coluna.body}
            headerStyle={{display: 'none'}}
            footer={coluna.footer}
            footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
            bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#3e2a00', border: '1px solid #7a59ad' }} />
        ))}
      </DataTable>
    </Fragment>
  );
}








// import { Fragment } from "react"
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { toFloat } from "../../../../../utils/toFloat";
// import { formatMoeda } from "../../../../../utils/formatMoeda";

// export const ActionListaTotalDeposito = ({ 
//   dadosTotalDepositos, 
//   dadosVendas,
//   dadosTotalFaturas,
//   dadosTotalDespesas,
//   dadosTotalAdiantamentos
// }) => {

//   const dados = dadosTotalDepositos.map((item) => {
//     // console.log('dadosVendas', dadosVendas[0].venda?.VRRECDINHEIRO)
//     // console.log('dadosTotalFaturas', dadosTotalFaturas[0]?.VRRECEBIDO)
//     // console.log('dadosTotalDespesas', dadosTotalDespesas[0]?.VRDESPESA ?? 0)
//     // console.log('dadosTotalAdiantamentos', dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0)
//     const saldoAnteriorVendas = parseFloat(dadosVendas[0].venda?.VRRECDINHEIRO)
//     const saldoAnteriorFaturas = saldoAnteriorVendas + parseFloat(dadosTotalFaturas[0]?.VRRECEBIDO)
//     const saldoAnteriorDespesas = saldoAnteriorFaturas - parseFloat(dadosTotalDespesas[0]?.VRDESPESA ?? 0)

//     const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(dadosTotalAdiantamentos[0]?.VRVALORDESCONTO ?? 0)
    
//     const calcularTotalDinheiroInformado = () => {
//       let totalDinheiroInformado = 0;
//       if (item.VRAJUSTDINHEIRO > 0) {
//         totalDinheiroInformado = toFloat(item.VRAJUSTDINHEIRO);
        
//       } else {
//         totalDinheiroInformado = toFloat(item.VRRECDINHEIRO);
//       }
//       return totalDinheiroInformado;
//     };
//     const saldoAnterior = saldoAnteriorAdiantamentos
//     const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.VRFISICODINHEIRO);
//     const saldoAnteriorQuebra = saldoAnterior + totalQuebraCaixa;

//     const saldoAnteriorDepositos = saldoAnteriorQuebra - parseFloat(item.VRDEPOSITO)
//     return {
//       IDDEPOSITOLOJA: item.IDDEPOSITOLOJA,
//       DTDEPOSITOFORMATADA: item.DTDEPOSITOFORMATADA,
//       DTMOVIMENTOCAIXAFORMATADA: item.DTMOVIMENTOCAIXAFORMATADA,
//       FUNCIONARIO: item.FUNCIONARIO,
//       VRDEPOSITO: item.VRDEPOSITO,
//       DSBANCO: item.DSBANCO,
//       STCANCELADO: item.STCANCELADO,
//       STCONFERIDO: item.STCONFERIDO,
//       NUDOCDEPOSITO: item.NUDOCDEPOSITO,
//       saldoAnteriorDepositos: saldoAnteriorDepositos,
//     }
//   });

//   const colunasDepositos = [
//     {
//       header: 'Dt. Lançamento',
//       field: 'DTDEPOSITOFORMATADA',
//       body: row => <p style={{margin:  '0px', width: '7.2rem'}} >{row.DTDEPOSITOFORMATADA}</p>,
//       sortable: true,
//     },
//     {
//       header: 'Histórico',
//       field: 'FUNCIONARIO',
//       body: row => <p style={{margin:  '0px',maxWidth: '18rem' }}>{row.FUNCIONARIO} Dep. Dinh  - Data do Movimento: {row.DTMOVIMENTOCAIXAFORMATADA}</p>,
//       sortable: true,
//     },
//     {
//       header: 'Pago A',
//       field: 'DSBANCO',
//       body: row => <p style={{margin:  '0px'}}>{row.DSBANCO} - {row.NUDOCDEPOSITO}</p>,
//       sortable: true,
//     },
//     {
//       header: 'Despesa',
//       field: 'VRDEPOSITO',
//       body: row => <p style={{margin:  '0px'}}>{formatMoeda(row.VRDEPOSITO)} </p>,
//     },
//     {
//       header: 'Débito',
//       field: '',
//       body: row => <p style={{margin:  '0px'}}>0,00</p>,
//       sortable: true,
//     },
//     {
//       header: 'Crédito',
//       field: '',
//       body: row => <p style={{margin:  '0px'}}>0,00</p>,
//       sortable: true,
//     },
//     {
//       header: 'Saldo',
//       field: 'saldoAnteriorDepositos',
//       body: row => {
       
//             return (

//               <p style={{margin:  '0px'}}> {formatMoeda(row.saldoAnteriorDepositos)}</p>
//             )
          
//       },
//       sortable: true,
//     },
//     {
//       header: 'Situação',
//       field: 'STCONFERIDO',
//       body: row => {
//         if(row.STCONFERIDO == 'False' || row.STCONFERIDO == null || row.STCONFERIDO == ''){
//           return (
//             <p style={{ color: 'red' }}> Sem Conferir </p>
//           )
//         } else {
//           return (
//             <p style={{ color: 'blue' }}> Conferido </p>
//           )
//         }
//       } ,
//       sortable: true,
//     },
//   ]

//   return (

//     <Fragment>
     
//       <DataTable
//         title="Extrato de Depósitos"
//         value={dados}
//         tableStyle={{ minWidth: '50rem' }}
//         // headerStyle={{display: 'none'}}
//         selectionMode={"single"}
//         dataKey="IDEMPRESA"
//         sortField="VRTOTALPAGO"
//         sortOrder={-1}
//         showGridlines
//         stripedRows
//         emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
//       >
//         {colunasDepositos.map(coluna => (
//           <Column
//             key={coluna.field}
//             field={coluna.field}
//             header={coluna.header}
//             body={coluna.body}
//             headerStyle={{display: 'none'}}
//             // headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
//             footer={coluna.footer}
//             footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
//             bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#3e2a00', border: '1px solid #7a59ad' }} />
//         ))}
//       </DataTable>
  
//     </Fragment>
//   )
// }