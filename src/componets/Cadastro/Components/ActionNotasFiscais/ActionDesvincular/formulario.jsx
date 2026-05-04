
import { Controller, useForm } from "react-hook-form";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { ActionListaDesvincularNFE } from "./actionListaDesvincularNFE";
import { useDesvincularPedidoNFE } from "../hooks/useDesvincularPedidoNFE";

export const Formulario = ({ 
    handleClose, 
    handleClick,
    dadosPedidosVinculados,
    usuarioLogado,
    optionsModulos, 
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });

    const {
        selectedItems,
        setSelectedItems,    
        onSubmit
    } = useDesvincularPedidoNFE({
        dadosPedidosVinculados, 
        usuarioLogado, 
        optionsModulos, 
        handleClose,
        handleClick
    })
  
    return (
        <form onSubmit={handleSubmit(onSubmit)}>   
            <ActionListaDesvincularNFE
                dadosPedidosVinculados={dadosPedidosVinculados}
                usuarioLogado={usuarioLogado}
                optionsModulos={optionsModulos}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />

            <FooterModal 
                ButtonTypeFechar={ButtonTypeModal}
                onClickButtonFechar={handleClose}
                textButtonFechar={"Fechar"}
                corFechar={"secondary"}

                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar={handleSubmit(onSubmit)}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Desvincular Pedidos"}
                corCadastrar={"success"}
                loadingTextCadastrar={"Desvinculando..."}
                autoLoadingCadastrar={true}

            />
        </form>

    )
}