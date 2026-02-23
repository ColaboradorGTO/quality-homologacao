import { Fragment } from "react";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { FaCheck } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";

export const ActionListaDepositos = ({ dadosExtratoLojaPeriodo, dados }) => {
  
  const dadosDepositos = dadosExtratoLojaPeriodo.flatMap((item) =>

    item.totalDepositos.map((deposito) => {
      let saldoAnteriorDepositos = toFloat(dados[0].saldoAnteriorQuebra);
      if(deposito.STCANCELADO == "False" && (deposito.STCONFERIDO == 'False' || deposito.STCONFERIDO == null || deposito.STCONFERIDO == '')) {
        saldoAnteriorDepositos = toFloat(dados[0].saldoAnteriorQuebra) - toFloat(deposito?.VRDEPOSITO);
        
      }

      return {
        IDDEPOSITOLOJA: deposito.IDDEPOSITOLOJA,
        DTDEPOSITOFORMATADA: deposito.DTDEPOSITOFORMATADA,
        DTMOVIMENTOCAIXAFORMATADA: deposito.DTMOVIMENTOCAIXAFORMATADA,
        FUNCIONARIO: deposito.FUNCIONARIO,
        VRDEPOSITO: toFloat(deposito.VRDEPOSITO),
        DSBANCO: deposito.DSBANCO,
        STCANCELADO: deposito.STCANCELADO,
        STCONFERIDO: deposito.STCONFERIDO,
        NUDOCDEPOSITO: deposito.NUDOCDEPOSITO,
        saldoAnteriorDepositos: toFloat(saldoAnteriorDepositos),
      };
    })
  );

  const renderButtons = (item) => {
    if (item.STCANCELADO === "False" && (item.STCONFERIDO === "False" ||  item.STCONFERIDO === null || item.STCONFERIDO === "")
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
    } else if ( item.STCANCELADO === "True" && (item.STCONFERIDO === "False" || item.STCONFERIDO === null || item.STCONFERIDO === "")
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