import { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaResumoVoucher = ({ dadosResumoVoucher }) => {
  const dados =  dadosResumoVoucher.map((item, index) => {
    console.log(item.VRVOUCHER, 'item.VRVOUCHER')
    return {
      VRVOUCHER: toFloat(item.VRVOUCHER),
    }
  });

  const calcularTotalVoucher = () => {
    let total = 0;
    for(let resultado of dados) {
      total += toFloat(resultado.VRVOUCHER); 
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
                Total Voucher
              </td>
              <td style={{ textAlign: 'right' }}>{formatMoeda(calcularTotalVoucher()) } </td>
            </tr>

          </tbody>
        </table>
      </div>

    </Fragment>
  )
}
