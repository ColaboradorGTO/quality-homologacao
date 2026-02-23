import { Fragment, useEffect, useState } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaQuebraCaixa = ({ dadosExtratoLojaPeriodo, dados }) => {
  const [dadosQuebra, setDadosQuebra] = useState([]);


    let saldoAnteriorAdiantamentos = dados[0]?.saldoAnteriorAdiantamentos;
    const dadosCalculados = dadosExtratoLojaPeriodo.map((item) => {
      const calcularTotalDinheiroInformado = () => {
        let dinheiroInformado = 0;
        if (toFloat(item.quebracaixa.VRAJUSTDINHEIRO) > 0) {
          dinheiroInformado = toFloat(item.quebracaixa.VRAJUSTDINHEIRO);
        } else {
          dinheiroInformado = toFloat(item.quebracaixa.VRRECDINHEIRO);
        }
        return dinheiroInformado;
      };
    
        
        const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.quebracaixa.VRFISICODINHEIRO);
        const saldoAnteriorQuebra = saldoAnteriorAdiantamentos + totalQuebraCaixa;
    
        return {
          IDMOV: item.quebracaixa.IDMOV,
          DTMOVCAIXA: item.quebracaixa.DTMOVCAIXA,
          FUNCIONARIOMOV: item.quebracaixa.FUNCIONARIOMOV,
          VRFISICODINHEIRO: item.quebracaixa.VRFISICODINHEIRO,
          VRRECDINHEIROQUEBRA: item.quebracaixa.VRRECDINHEIRO,
          VRAJUSTDINHEIRO: item.quebracaixa.VRAJUSTDINHEIRO,
          totalQuebraCaixa: totalQuebraCaixa,
          saldoAnteriorQuebra: saldoAnteriorQuebra
        };
      }
    );

  
  return (
    <Fragment>
      {dadosQuebra.map((item, index) => (
        <tr className="table-primary" key={index}>
          <td>{item.DTMOVCAIXA}</td>
          <td>Quebra Caixa Mov.: {item.IDMOV} </td>
          <td colSpan={2}>Operador: {item.FUNCIONARIOMOV}</td>
          <td>{item.totalQuebraCaixa > 0 ? '0,00' : formatMoeda(item.totalQuebraCaixa)}</td>
          <td>{item.totalQuebraCaixa > 0 ? formatMoeda(item.totalQuebraCaixa) : '0,00'}</td>
          <td>{formatMoeda(item.saldoAnteriorQuebra)}</td>
          <td></td>
          <td></td>
        </tr>

      ))}
    </Fragment>
  )
}