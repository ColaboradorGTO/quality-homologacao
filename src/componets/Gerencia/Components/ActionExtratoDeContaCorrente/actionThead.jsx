import { Fragment } from "react"

export const ActionThead = () => {
    return (
        <Fragment>
            <tbody className="bg-primary-700">
                <tr>
                    <th>
                        Dt. Lançamento
                    </th>
                    <th>
                        Histórico
                    </th>
                    <th>
                        Pago A
                    </th>
                    <th>
                        Despesa
                    </th>
                    <th>
                        Débito
                    </th>
                    <th>
                        Crédito
                    </th>
                    <th>
                        Saldo
                    </th>
                    <th>
                        Situação
                    </th>
                    <th>
                        Opção
                    </th>
                </tr>
            </tbody>
        </Fragment>
    )
}