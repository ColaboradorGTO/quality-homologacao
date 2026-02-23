import { Fragment, useEffect, useState } from "react";
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionListaAdiantamentos = ({ dadosExtratoLojaPeriodo, dados }) => {


  let saldoAnterior = toFloat(dados[0]?.saldoAnteriorDespesas);

  const dadosAdiantamentos = dadosExtratoLojaPeriodo.map((item) => {
    const saldoAnteriorAdiantamentos = saldoAnterior - toFloat(item.adiantamentos[0]?.VRVALORDESCONTO);
    saldoAnterior = saldoAnteriorAdiantamentos;
    return {
      DTLANCAMENTOADIANTAMENTO: item.adiantamentos[0]?.DTLANCAMENTOADIANTAMENTO,
      NOFUNCIONARIO: item.adiantamentos[0]?.NOFUNCIONARIO,
      DSMOTIVO: item.adiantamentos[0]?.DSMOTIVO,
      VRVALORDESCONTO: toFloat(item.adiantamentos[0]?.VRVALORDESCONTO),
      saldoAnteriorAdiantamentos: saldoAnteriorAdiantamentos,
    };
  })




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