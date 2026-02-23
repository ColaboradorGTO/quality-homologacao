import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form";
import { useCadastrarMotivoDevolucao } from "../hooks/useCadastrarMotivoDevolucao";
import { Message } from 'primereact/message';

export const FormularioCadastrar = ({ handleClose, optionsModulos, usuarioLogado }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        motivo,
        setMotivo,
        onSubmit,
    } = useCadastrarMotivoDevolucao({optionsModulos, usuarioLogado, handleClose});
    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Motivo Devolução"}
                                type="text"
                                placeholder={"Digite o motivo de devolução"}
                                value={motivo}
                                onChangeModal={(e) => setMotivo(e.target.value)}

                            />
                              {/* <Message severity="error" text="Motivo Devolução Não pode ter menos que 8 caracteres" /> */}
                        </div>

                    </div>
                </div>
                
                <FooterModal
    
                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(onSubmit)}
                    textButtonCadastrar={"Criar"}
                    corCadastrar={"success"}
        
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}
                />  
            </form>
        </Fragment>
    )
}