import { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaAdiantamentoSalarial = ({ dadosAdiantamentoSalarial }) => {

  const dados =  dadosAdiantamentoSalarial.map((item, index) => {

    return {
      IDADIANTAMENTOSALARIO: item.IDADIANTAMENTOSALARIO,
      VRVALORDESCONTO: toFloat(item.VRVALORDESCONTO),
      TXTMOTIVO: item.TXTMOTIVO,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOLOGIN: item.NOLOGIN,
    }
  });

  const calcularTotalAdiantamento = () => {
    let total = 0;
    for(let resultado of dados) {
      total += toFloat(resultado.VRVALORDESCONTO); 
    }
    return total;
  }

  return (

    <Fragment>

      <div className="card">
        <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
          <tbody className="thead-themed">
            <tr>
              <td style={{ textAlign: 'center', fontSize: '1rem', width: '60%' }}>
                Total Despesa de Adiantamento
              </td>
              <td style={{ textAlign: 'right' }}>{formatMoeda(calcularTotalAdiantamento()) } </td>
            </tr>

          </tbody>
        </table>
      </div>

    </Fragment>
  )
}
