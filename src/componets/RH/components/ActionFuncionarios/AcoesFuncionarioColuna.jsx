import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUserAltSlash, FaUserTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export const AcoesFuncionarioColuna = ({ row, optionsModulos, onEditar, onDesconto, onAtivar, onDesligar }) => {
  if (row.STATIVO !== 'True') {
    return (
      <div className="p-1">
        <ButtonTable
          titleButton={"ativar"}
          textButton={"Ativar"}
          textFontSize={10}
          onClickButton={() => onAtivar(row, true)}
          Icon={FaCheck}
          iconSize={25}
          width="35px"
          height="35px"
          iconColor={"#fff"}
          cor={"danger"}
        />
      </div>
    );
  }

  const permitidoAdministrador = optionsModulos[0]?.ADMINISTRADOR == 'True';
  const permitidoDesconto = optionsModulos[0]?.N1 == 'True';

  return (
    <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
      <div className="p-1">
        <ButtonTable
          titleButton={"Alterar"}
          onClickButton={() => onEditar(row)}
          Icon={CiEdit}
          iconSize={30}
          iconColor={"#fff"}
          cor={"primary"}
          width="35px"
          height="35px"
          disabledBTN={!permitidoAdministrador}
        />
      </div>
      <div className="p-1">
        <ButtonTable
          titleButton={"Alterar Desconto Autorizado"}
          onClickButton={() => onDesconto(row)}
          Icon={MdOutlineAttachMoney}
          iconSize={30}
          iconColor={"#fff"}
          cor={"info"}
          width="35px"
          height="35px"
          styleBtn={{display: permitidoDesconto ? 'block' : 'none'}}
        />
      </div>
      <div className="p-1">
        <ButtonTable
          titleButton={"Inativar"}
          onClickButton={() => onAtivar(row, false)}
          Icon={FaUserAltSlash}
          iconSize={30}
          iconColor={"#fff"}
          cor={"warning"}
          width="35px"
          height="35px"
          disabledBTN={!permitidoAdministrador}
        />
      </div>
      <div className="p-1">
        <ButtonTable
          titleButton={"Desligar"}
          onClickButton={() => onDesligar(row)}
          Icon={FaUserTimes}
          iconSize={30}
          iconColor={"#fff"}
          cor={"danger"}
          width="35px"
          height="35px"
          disabledBTN={!permitidoAdministrador}
        />
      </div>
    </div>
  );
};
