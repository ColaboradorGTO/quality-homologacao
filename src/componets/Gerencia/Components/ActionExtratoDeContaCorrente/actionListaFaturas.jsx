import { Fragment, useEffect, useState } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaFaturas = ({ dadosExtratoLojaPeriodo, dados }) => {



  let saldoAnterior = toFloat(dados[0]?.saldoAnteriorVendas);

  const dadosFaturas = dadosExtratoLojaPeriodo.map((item) => {

    const saldoAnteriorFaturas = saldoAnterior + toFloat(item.totalFaturas[0]?.VRRECEBIDO);
    saldoAnterior = saldoAnteriorFaturas;

    return {
      DTPROCESSAMENTOFORMATADA: item.totalFaturas[0]?.DTPROCESSAMENTOFORMATADA,
      VRRECEBIDO: toFloat(item.totalFaturas[0]?.VRRECEBIDO),
      saldoAnteriorFaturas: saldoAnteriorFaturas,
    };

  });



  return (
    <Fragment>


      {dadosFaturas.map((item, index) => (
        <tr className="table-success" key={index}>
          <td>{item?.DTPROCESSAMENTOFORMATADA}</td>
          <td>Mov. Fatura {item?.DTPROCESSAMENTOFORMATADA}</td>
          <td>Recebimento de Faturas</td>
          <td></td>
          <td>0,00</td>
          <td>{formatMoeda(item.VRRECEBIDO)}</td>
          <td>{formatMoeda(item.saldoAnteriorFaturas)}</td>
          <td></td>
          <td></td>
        </tr>

      ))}
    </Fragment>
  )
}