import { Fragment } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export const ActionListaTotalRecebidoPeriodo = ({ dadosTotalRecebidoPeriodo }) => {
 


  const dados = Array.isArray(dadosTotalRecebidoPeriodo) ? dadosTotalRecebidoPeriodo.map((item, index) => {
  
    return {
      
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORTOTALADIANTAMENTOSALARIAL: item.VALORTOTALADIANTAMENTOSALARIAL,

    }
  }): [];

  const calcularTotalConvenio = () => {
    let total = 0;
    for(let resultado of dados){
      total += parseFloat(resultado.VALORTOTALCONVENIO)
    }
    return total;
  }

  const calcularTotalDinheiro = () => {
    let total = 0;
    for(let resultado of dados){
      total += parseFloat(resultado.VALORTOTALDINHEIRO)
    }
    return total;
  }
  return (

    <Fragment>

     
      <div className="mt-4">

        {dados.map((row, index) => (
          <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
            <thead className="bg-primary-600">
              <tr>
                <th>Vendas Formas de Pagamentos </th>
                <th>Parcelas</th>
                <th>Qtd Pagamento</th>
                <th>Vr.Venda</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px" }}>CONVÊNIO</td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              <td style={{ textAlign: "center", fontSize: "14px" }}>{formatMoeda(calcularTotalConvenio())}</td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px" }} >DINHEIRO</td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              <td style={{ textAlign: "center", fontSize: "14px" }}>{formatMoeda(calcularTotalDinheiro())}</td>
              <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              
            </tr>

          </table>
        ))}

      </div>
 
    </Fragment>
  )
}
