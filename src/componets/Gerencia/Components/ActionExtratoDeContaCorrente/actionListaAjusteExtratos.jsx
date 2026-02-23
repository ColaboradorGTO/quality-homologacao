import { Fragment } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaAjusteExtratos = ({dadosExtratoLojaPeriodo, dados}) => {
  const dadosExtrato = dadosExtratoLojaPeriodo.map((item) => {
    // let saldoAnterior = toFloat(dados[0].saldoAnteriorDepositos) 
    let saldoAnterior = toFloat(dados[0].totalSaldoAnteriorExtrato) 

    if(item.ajusteextrato[0]?.STCANCELADO == 'False')  {
      if (item.ajusteextrato[0]?.VRCREDITO > 0) {
        saldoAnterior - toFloat(item.ajusteextrato[0]?.VRCREDITO)
      } else {
        saldoAnterior + toFloat(item.ajusteextrato[0]?.VRDEBITO)
      }
      return saldoAnterior
    }

    return {
      IDAJUSTEEXTRATO: item.ajusteextrato[0]?.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: item.ajusteextrato[0]?.DTCADASTROFORMATADA,
      VRDEBITO: toFloat(item.ajusteextrato[0]?.VRDEBITO),
      VRCREDITO: toFloat(item.ajusteextrato[0]?.VRCREDITO),
      HISTORICO: item.ajusteextrato[0]?.HISTORICO,
      STCANCELADO: item.ajusteextrato[0]?.STCANCELADO,
      saldoAnterior: toFloat(saldoAnterior),
    }
  })


  return (
    <Fragment>
      {dadosExtrato.map((item, index) => (

       <tr className="table-secondary">
          <td>{item.DTCADASTROFORMATADA}</td>
          <td>{item.HISTORICO} </td>
          <td colSpan={2}>Ajuste de Extrato</td>
          <td style={{ color: 'red' }}>{formatMoeda(item.VRDEBITO)}</td>
          <td style={{ color: 'red' }}>{formatMoeda(item.VRCREDITO)}</td>
          <td>{formatMoeda(item.saldoAnterior)}</td>
          <td style={{ color: item.STCANCELADO == 'False' ? 'blue' : 'red' }} >
            {item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
          </td>
          <td></td>
        </tr>
      ))}
    </Fragment>
  )
}
