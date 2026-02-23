import { Fragment } from "react";
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";


export const ActionListaQuebraCaixa = ({ dadosExtratoLojaPeriodo, dados }) => {


  const dadosQuebra = dadosExtratoLojaPeriodo.flatMap((item) =>
    item.quebracaixa.map((quebracaixa) => {
      const saldoAnteriorAdiantamentos = dados[0].saldoAnteriorDespesas - toFloat(dados[0].VRVALORDESCONTO)


      const calcularTotalDinheiroInformado = () => {
        let dinheiroInformado = 0;
        if (toFloat(quebracaixa.VRAJUSTDINHEIRO) > 0) {
          dinheiroInformado = toFloat(quebracaixa.VRAJUSTDINHEIRO);
        } else {
          dinheiroInformado = toFloat(quebracaixa.VRRECDINHEIRO);
        }
        return dinheiroInformado;
      };
      

      const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(quebracaixa.VRFISICODINHEIRO);
     
      const saldoAnteriorQuebra = toFloat(saldoAnteriorAdiantamentos) + toFloat(totalQuebraCaixa);
      return {
        IDMOV: quebracaixa.IDMOV,
        DTMOVCAIXA: quebracaixa.DTMOVCAIXA,
        FUNCIONARIOMOV: quebracaixa.FUNCIONARIOMOV,
        VRFISICODINHEIRO: quebracaixa.VRFISICODINHEIRO,
        VRRECDINHEIROQUEBRA: quebracaixa.VRRECDINHEIRO,
        VRAJUSTDINHEIRO: quebracaixa.VRAJUSTDINHEIRO,
        totalQuebraCaixa: toFloat(totalQuebraCaixa),
        saldoAnteriorQuebra: toFloat(saldoAnteriorQuebra)
      };
    })
  );
  return (
    <Fragment>
      {dadosQuebra.map((item, index) => (
        <tr className="table-primary" key={index}>
          <td>{item.DTMOVCAIXA}</td>
          <td>Quebra Caixa Mov.: {item.IDMOV} </td>
          <td colSpan={2}>Operador: {item.FUNCIONARIOMOV}</td>


          <td>0,00</td>
          <td>{item.totalQuebraCaixa > 0 ? formatMoeda(item.totalQuebraCaixa) : '0,00'}</td>
          <td>{formatMoeda(item.saldoAnteriorQuebra)}</td>
          <td></td>
          <td></td>
        </tr>

      ))}
    </Fragment>
  )
}