import { Fragment } from "react";
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";


export const ActionListaAdiantamentos = ({dadosExtratoLojaPeriodo, dados}) => {

  const dadosAdiantamentos = dadosExtratoLojaPeriodo.flatMap((item) => 
    item.adiantamentos.map((adiantamentos) => {
      const saldoAnteriorAdiantamentos = dados[0].saldoAnteriorDespesas - toFloat(adiantamentos.VRVALORDESCONTO)
      return {
        DTLANCAMENTOADIANTAMENTO: adiantamentos.DTLANCAMENTOADIANTAMENTO,
        NOFUNCIONARIO: adiantamentos.NOFUNCIONARIO,
        DSMOTIVO: adiantamentos.DSMOTIVO,
        VRVALORDESCONTO: toFloat(adiantamentos.VRVALORDESCONTO),
        saldoAnteriorAdiantamentos: toFloat(saldoAnteriorAdiantamentos),
      };
    })
    
  );
 
  
  return (
    <Fragment>
      {dadosAdiantamentos.map((item, index) => (
        <tr className="table-danger" key={index}>
            <td>{item.DTLANCAMENTOADIANTAMENTO}</td>
            <td>Adiantamento de Salário </td>
            <td>{item.NOFUNCIONARIO}</td>
            <td>{item.DSMOTIVO}</td>
            <td>{formatMoeda(item.VRVALORDESCONTO)}</td>
            <td>0,00</td>
            <td>{formatMoeda(item.saldoAnteriorAdiantamentos) ? formatMoeda(item.saldoAnteriorAdiantamentos) : 0}</td>
            <td></td>
            <td></td>
        </tr>
      ))}
    </Fragment>
  )
}