import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { useEditarCores } from "../hooks/useEditarCores";

export const FormularioEditar = ({ 
    handleClose, 
    dadosDetalheCores, 
    usuarioLogado, 
    optionsModulos,
    refetchListaCores 
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
        atualzarCores,
    } = useEditarCores({ dadosDetalheCores, usuarioLogado, optionsModulos, refetchListaCores });
 
    return (
        <Fragment>
            <form onSubmit={handleSubmit(atualzarCores)}>

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
                                options={dadosGrupoCores.map((item) => {
                                    return {
                                        value: item.IDGRUPOCOR,
                                        label: item.DSGRUPOCOR
                                    }
                                })}
                                value={grupoCorSelecionado}
                                onChange={(e) => setGrupoCorSelecionado(e)}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-3 ">

                            <label htmlFor="">Situação *</label>
                            <Select
                                options={optionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={statusSelecionado}
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
                    onClickButtonCadastrar={atualzarCores}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />
            </form>
        </Fragment>
    )
}