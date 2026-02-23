import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useCadastroCores } from "../hooks/useCadastroCores";
import { useForm } from "react-hook-form";



export const FormularioCadastro = ({
    handleClose,
    usuarioLogado,
    refetchListaCores,
    optionsModulos
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        grupoCorSelecionado,
        setGrupoCorSelecionado,
        dadosGrupoCores,
        cadastrarCores
    } = useCadastroCores({handleClose, usuarioLogado, refetchListaCores, optionsModulos})

    return (
        <Fragment>
                
            <form onSubmit={handleSubmit(cadastrarCores)}>

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

                        <label htmlFor="">Grupo Cor *</label>
                            <Select
                                defaultValue={grupoCorSelecionado}
                                options={dadosGrupoCores.map((item) => {
                                    return {
                                        value: item.IDGRUPOCOR,
                                        label: item.DSGRUPOCOR
                                    }
                                })}
                                onChange={(e) => setGrupoCorSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select

                                defaultValue={statusSelecionado}
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
                    <h3 className="form-label" style={{ color: 'red' }}>* Campos Obrigatórios *</h3>
                </div>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={cadastrarCores}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}

                />
            </form>
        </Fragment>
    )
}