import { Fragment } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { FaCheck } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";

export const ActionListaDepositos = ({ dadosExtratoLojaPeriodo, dados }) => {
 
  const dadosDepositos = dadosExtratoLojaPeriodo.map((item) => {
      // const saldoAnteriorDepositos = toFloat(dados[0].saldoAnteriorQuebra) - toFloat(deposito?.VRDEPOSITO);
      const saldoAnteriorDepositos = toFloat(dados[0].saldoAnteriorDepositos)

      return {
        IDDEPOSITOLOJA: item.totalDepositos[0]?.IDDEPOSITOLOJA,
        DTDEPOSITOFORMATADA: item.totalDepositos[0]?.DTDEPOSITOFORMATADA,
        DTMOVIMENTOCAIXAFORMATADA: item.totalDepositos[0]?.DTMOVIMENTOCAIXAFORMATADA,
        FUNCIONARIO: item.totalDepositos[0]?.FUNCIONARIO,
        VRDEPOSITO: toFloat(item.totalDepositos[0]?.VRDEPOSITO),
        DSBANCO: item.totalDepositos[0]?.DSBANCO,
        STCANCELADO: item.totalDepositos[0]?.STCANCELADO,
        STCONFERIDO: item.totalDepositos[0]?.STCONFERIDO,
        NUDOCDEPOSITO: item.totalDepositos[0]?.NUDOCDEPOSITO,
        saldoAnteriorDepositos: toFloat(saldoAnteriorDepositos),
      };
    })


  const renderButtons = (item) => {
    if (
      item.STCANCELADO === "False" &&
      (item.STCONFERIDO === "False" ||
        item.STCONFERIDO === null ||
        item.STCONFERIDO === "")
    ) {
      return (
        <Fragment>
          <ButtonTable
            titleButton={"Confirmar Conferência"}
            cor={"success"}
            Icon={FaCheck}
            IconSize={20}
            onClickButton={() => console.log("Confirmar Conferência")}
          />
          <ButtonTable
            titleButton={"Cancelar Depósito"}
            cor={"danger"}
            Icon={BsTrash3}
            IconSize={20}
            onClickButton={() => console.log("Cancelar Depósito")}
          />
          <ButtonTable
            titleButton={"Editar Depósito"}
            cor={"warning"}
            Icon={CiEdit}
            IconSize={20}
            onClickButton={() => console.log("Editar Depósito")}
          />
        </Fragment>
      );
    } else if (item.STCANCELADO === "False" && item.STCONFERIDO === "True") {
      return <td></td>;
    } else if (
      item.STCANCELADO === "True" &&
      (item.STCONFERIDO === "False" ||
        item.STCONFERIDO === null ||
        item.STCONFERIDO === "")
    ) {
      return (
        <ButtonTable
          titleButton={"Confirmar Conferência"}
          cor={"success"}
          Icon={FaCheck}
          IconSize={20}
          onClickButton={() => console.log("Confirmar Conferência")}
        />
      );
    } else if (item.STCANCELADO === "True" && item.STCONFERIDO === "True") {
      return <td></td>;
    }
  };

  return (
    <Fragment>
      {dadosDepositos.map((item, index) => (
        <tr className="table-warning" key={index}>
          <td>{item.DTDEPOSITOFORMATADA}</td>
          <td>
            {item.FUNCIONARIO} Dep. Dinh {item.DTMOVIMENTOCAIXAFORMATADA}
          </td>
          <td colSpan={2}>
            {item.DSBANCO} {item.NUDOCDEPOSITO}
          </td>
          <td>{formatMoeda(item.VRDEPOSITO)}</td>
          <td>0,00</td>
          <td>{formatMoeda(parseFloat(item.saldoAnteriorDepositos))}</td>
          <td
            style={{
              color:
                item.STCONFERIDO === "False" ||
                item.STCONFERIDO == null ||
                item.STCONFERIDO === ""
                  ? "red"
                  : "blue",
            }}
          >
            {item.STCONFERIDO === "False" ||
            item.STCONFERIDO == null ||
            item.STCONFERIDO === ""
              ? "Sem Conferir"
              : "Conferido"}
          </td>
          <td>{renderButtons(item)}</td>
        </tr>
      ))}
    </Fragment>
  );
};