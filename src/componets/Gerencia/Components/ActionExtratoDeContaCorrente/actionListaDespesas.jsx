import { Fragment, useState, useEffect } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaDespesas = ({ dadosExtratoLojaPeriodo, dados }) => {
  let saldoAnterior = toFloat(dados[0]?.saldoAnteriorFaturas);

  const dadosDespesas = dadosExtratoLojaPeriodo.map((item) => {

    const saldoAnteriorDespesas = saldoAnterior - toFloat(item.despesas[0]?.VRDESPESA);
    // const saldoAnteriorDespesas = saldoAnterior;
    // saldoAnterior = saldoAnteriorDespesas; 

    return {
      DTDESPESAFORMATADA: item.despesas[0]?.DTDESPESAFORMATADA,
      DSHISTORIO: item.despesas[0]?.DSHISTORIO,
      DSCATEGORIA: item.despesas[0]?.DSCATEGORIA,
      VRDESPESA: toFloat(item.despesas[0]?.VRDESPESA),
      DSPAGOA: item.despesas[0]?.DSPAGOA,
      saldoAnteriorDespesas: saldoAnteriorDespesas,
    };

  });



  return (
    <Fragment>
      {dadosDespesas.map((item, index) => (
        <tr className="table-danger" key={index}>
          <td>{item?.DTDESPESAFORMATADA}</td>
          <td>{item?.DSHISTORIO}</td>
          <td>{item?.DSPAGOA}</td>
          <td>{item?.DSCATEGORIA}</td>
          <td>{formatMoeda(item?.VRDESPESA)}</td>
          <td>0,00</td>
          <td>{formatMoeda(item?.saldoAnteriorDespesas)}</td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </Fragment>
  );
};