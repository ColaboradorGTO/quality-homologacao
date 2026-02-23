import { Fragment } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { FaLockOpen } from "react-icons/fa"
import { CiEdit } from "react-icons/ci"
import { MdAdd } from "react-icons/md"
import { formatMoeda } from "../../../../utils/formatMoeda"

export const HeaderTable = ({ dados }) => {
  return (
    <Fragment>
      <header>
        <div style={{ padding: "10px" }}>

          <h1 style={{ textAlign: 'center', color: '#7a59ad' }}>INFORMATIVO</h1>
        </div>

        <div style={{ display: 'flex', marginBottom: '20px' }}>

          <ButtonType
            type="button"
            className="btn btn-success"
            title="Extrato Loja"
            onClickButtonType={() => setModalCadastro(true)}
            textButton="Cadastrar Depósitos"
            Icon={MdAdd}
            iconSize={18}
            style={{ marginRight: '10px' }}
          />
          <ButtonType
            type="button"
            className="btn btn-danger"
            title="Extrato Loja"
            onClickButtonType={() => setModalAjuste(true)}
            textButton="Ajustar Extrato"
            Icon={CiEdit}
            iconSize={18}
          />


          <ButtonType
            type="button"
            className="btn btn-success "
            title="Extrato Loja"
            onClick={() => { }}
            textButton="Bloquear Data Depósito"
            Icon={FaLockOpen}
            iconSize={18}
          />



        </div>
      </header>
      <div className="panel-hdr">
        <h2>Lista de Extrato do Dia</h2>
      </div>

      <thead style={{ width: '100%' }}>
          <tr>
            <th>Informativo</th>
          </tr>
          <tr>
            <td colspan="9"><b >Extrato a partir do dia 11 de dezembro de 2020</b ></td>
          </tr>
        </thead>
        <tbody>

          <tr class="table-primary" style={{ width: '100%' }}>
            <td colspan="4" style={{ textAlign: "right", fontSize: "12px" }}><b>Saldo Anterior</b></td>
            <td></td>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right", fontSize: "12px" }}><b> {`${formatMoeda(saldoAnterior)}`}</b></td>
            <td colSpan={2}></td>
          </tr>

          <tr>
            <td colspan="9"></td>
          </tr>

          <tr>
            <td colspan="9"></td>
          </tr>
        </tbody>
    </Fragment>
  )
}