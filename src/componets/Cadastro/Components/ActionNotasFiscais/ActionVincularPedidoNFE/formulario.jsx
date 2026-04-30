
import { Controller, useForm } from "react-hook-form";
import { useVincularPedidoNFE } from "../hooks/useVincularPedidoNFE";
import { ActionListaPedidosSemVinculoNFE } from "./actionListaPedidosSemVinculoNF";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";

export const Formulario = ({ 
    handleClose, 
    handleClick,
    dadosListaPedidosSemVinculoNFE,
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
    } = useVincularPedidoNFE({
        dadosListaPedidosSemVinculoNFE, 
        usuarioLogado, 
        optionsModulos, 
        handleClose,
        handleClick
    })
  
    return (
        <form onSubmit={handleSubmit(onSubmit)}>   
            <ActionListaPedidosSemVinculoNFE
                dadosListaPedidosSemVinculoNFE={dadosListaPedidosSemVinculoNFE}
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
                textButtonCadastrar={"Cadastrar"}
                corCadastrar={"success"}
                loadingTextCadastrar={"Cadastrando..."}
                autoLoadingCadastrar={true}
            />
        </form>

    )
}