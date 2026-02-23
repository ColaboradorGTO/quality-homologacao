import { Fragment } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaVendas = ({ dados, dadosExtratoLojaPeriodo }) => {

  const dadosVendas = dadosExtratoLojaPeriodo.map((item) => {

    const saldoAnteriorVendas = dados[0].saldoAnterior2 + toFloat(item.venda.VRRECDINHEIRO)
    return {

      VRRECDINHEIRO: toFloat(item.venda.VRRECDINHEIRO),
      DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,
      saldoAnteriorVendas: toFloat(saldoAnteriorVendas),
    }
  })

  return (
    <Fragment>

      {dadosVendas.map((item, index) => (
        <tr key={index} className="table-success">
          <td>{item.DTHORAFECHAMENTOFORMATADA}</td>
          <td>Mov. Dinheiro do Caixa {item.DTHORAFECHAMENTOFORMATADA}</td>
          <td>Vendas Dinheiro</td>
          <td></td>
          <td>0,00</td>
          <td>{formatMoeda(item.VRRECDINHEIRO)}</td>
          <td>{formatMoeda(item.saldoAnteriorVendas)}</td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </Fragment>
  );
};