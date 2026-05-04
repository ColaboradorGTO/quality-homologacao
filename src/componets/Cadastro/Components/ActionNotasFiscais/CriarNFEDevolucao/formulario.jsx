import { Fragment, useState } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { useCadastrarNFEdeEntrada } from "../hooks/useCadastrarNFEdeEntrada";
import { schema } from "./schema/useCadastrarSchema"
import { ActionListaNotasNFE } from "./actionListaProduto";
import { mascaraCNPJ } from "../../../../../utils/mascaraCNPJ";
import Swal from "sweetalert2";

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });


    return (
        <Fragment>
            <form onSubmit>
            
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    // onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                    tipoBtnCadastrar={"submit"}
                    textButtonCadastrar={"Cadastrar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}