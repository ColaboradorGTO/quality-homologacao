import { Fragment } from "react"


export const ComprasActionTransferenciasDistribuicao = () => {
  return (

    <Fragment>
      <section className="sc-iVCKna smeyc">
        <div><button
            style={{padding: "5px;", backgroundColor: "rgb(67, 71, 103);", color: "rgb(255, 255, 255);", margin: "5px;", borderRadius: "5px;", border: "none;"}}>Marcar
            todos confere</button><button
            style={{padding: "5px;", backgroundColor: "rgb(67, 71, 103);", color: "rgb(255, 255, 255);", margin: "5px;", borderRadius: "5px;", border: "none;"}}>Desmarcar
            todos confere</button><button type="button"
            style={{padding: "5px;", backgroundColor: "rgb(67, 71, 103);", color: "rgb(255, 255, 255);", margin: "5px;", borderRadius: "5px;", border: "none;"}}>Gerar
            pedidos para todos</button></div>
        <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
          <thead className="bg-primary-600">
            <tr>
              <th>Histórico</th>
              <th>Filial</th>
              <th>Status</th>
              <th>Parceiro</th>
              <th>Incoterms</th>
              <th>Confere</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
    </Fragment>
  )
}