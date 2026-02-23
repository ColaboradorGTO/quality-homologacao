import { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaDetalheFatura = ({ dadosDetalheFatura }) => {
  const dados = dadosDetalheFatura.map((item, index) => {
    
    return {
      
      VRRECEBIDO: toFloat(item.VRRECEBIDO),
    
    }
  });

  const calcularTotalFaturas = () => {
    let total = 0;
    for(let resultado of dados) {
      total += toFloat(resultado.VRRECEBIDO); 
    }
    console.log(total, 'total')
    return total;
  }
  return (

    <Fragment>

      <div className="card">
        <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
          <tbody className="thead-themed">
            <tr>
              <td style={{ textAlign: 'center', fontSize: '1rem', width: '60%' }}>
                Total Faturas
              </td>
              <td style={{ textAlign: 'right' }}>{formatMoeda(calcularTotalFaturas()) } </td>
            </tr>

          </tbody>
        </table>
      </div>

    </Fragment>
  )
}
