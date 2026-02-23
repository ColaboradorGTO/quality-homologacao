import { Fragment } from "react";
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";


export const ActionListaAjusteExtratos = ({dadosExtratoLojaPeriodo, dados}) => {
  const dadosExtrato = dadosExtratoLojaPeriodo.flatMap((item) => 
    item.ajusteextrato.map((ajusteextrato) => {
    let saldoAnterior = toFloat(dados[0].saldoAnteriorDepositos) 


    if(ajusteextrato.STCANCELADO == 'False')  {
      if (ajusteextrato.VRCREDITO > 0) {
        saldoAnterior - toFloat(ajusteextrato.VRCREDITO)

      } else {
        saldoAnterior + toFloat(ajusteextrato.VRDEBITO)
      }
      return saldoAnterior
    }

    

    return {

      IDAJUSTEEXTRATO: ajusteextrato.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: ajusteextrato.DTCADASTROFORMATADA,
      VRDEBITO: toFloat(ajusteextrato.VRDEBITO),
      VRCREDITO: toFloat(ajusteextrato.VRCREDITO),
      HISTORICO: ajusteextrato.HISTORICO,
      STCANCELADO: ajusteextrato.STCANCELADO,
      saldoAnterior: toFloat(saldoAnterior),
    }
  })
)

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
