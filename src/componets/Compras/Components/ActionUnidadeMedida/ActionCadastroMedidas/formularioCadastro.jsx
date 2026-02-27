import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { useCadastroUnidadeMedida } from "../hooks/useCadastroUnidadeMedida"

export const FormularioCadatro = ({ handleClose, usuarioLogado, refetchListaUnidadesMedidas, optionsModulos }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        sigla,
        setSigla,
        optionsStatus,
        handleCadastro
    } = useCadastroUnidadeMedida({ handleClose, usuarioLogado, refetchListaUnidadesMedidas, optionsModulos });
    
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleCadastro)}>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Descrição *"}
                                type={"text"}
                                id={"IDCatPedido"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}

                                {...register("IDCatPedido", { required: "Campo obrigatório Informe a Descrição da Unidade de Medida", })}
                                required={true}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <InputFieldModal
                                label={"Sigla *"}
                                type={"text"}
                                id={"sigla"}
                                value={sigla}
                                onChangeModal={(e) => setSigla(e.target.value)}

                                {...register("sigla", { required: "Campo obrigatório Informe a Sigla da Unidade de Medida", })}
                                required={true}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                value={statusSelecionado}
                                options={optionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                onChange={(e) => setStatusSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <h3 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h3>
                </div>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleCadastro}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}