import { Fragment, } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useCancelarFatura } from "../hooks/useCancelarFatura";

export const Formulario = ({ 
    handleClick, 
    handleClose, 
    dadosCancelarFatura, 
    usuarioLogado, 
    optionsModulos,
    refetchListaFaturas
}) => {
    const { register, handleSubmit, errors } = useForm();
    const {
        motivo,
        setMotivo,
        onSubmit
    } = useCancelarFatura({ handleClick, handleClose, dadosCancelarFatura, usuarioLogado, optionsModulos, refetchListaFaturas })


    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)} >

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-6">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Empresa"
                                value={usuarioLogado?.NOFANTASIA}
                                onChangeModal={(e) => setEmpresa(e.target.value)}
                                {...register("empresa", { required: true })}

                            />

                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Caixa - Cód. Autorização da Fatura"
                                value={`${dadosCancelarFatura[0]?.IDDETALHEFATURA} - ${dadosCancelarFatura[0]?.DSCAIXA} - ${dadosCancelarFatura[0]?.NUCODAUTORIZACAO}`}
                                onChangeModal={(e) => setNumeroMovimento(e.target.value)}
                                {...register("numeroMovimento", { required: true })}

                            />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={false}
                                label="Motivo do Cancelamento"
                                value={motivo}
                                onChangeModal={(e) => setMotivo(e.target.value)}
                                placeholder={"Motivo"}
                                {...register("valorFatura", { required: true })}

                            />
                        </div>
                    </div>
                </div>

                <FooterModal
                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={onSubmit}
                    textButtonCadastrar={"Confirmar Cancelamento"}
                    corCadastrar="success"

                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar="secondary"
                />

            </form>
        </Fragment>
    )
}