import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm } from "react-hook-form"
import { useEditarEstilos } from "../Hooks/useEditarEstilos"

export const FormularioEditarEstilos = ({ dadosDetalheEstilos, handleClose, handleClick, usuarioLogado, optionsModulos }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosGrupoEstrutura,
        optionsStatus,
        atualizarEstilo,

    } = useEditarEstilos({dadosDetalheEstilos, handleClose, handleClick, usuarioLogado, optionsModulos});
    return (
        <Fragment>
            <form action="" onSubmit={handleSubmit(atualizarEstilo)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Descrição *"}
                                type={"text"}

                                id={"IDCatPedido"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}

                                {...register("IDCatPedido", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                                required={true}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Grupo Estrutura *</label>
                            <Select
                                value={subGrupoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosGrupoEstrutura.map((item) => {
                                        return {
                                            value: item.IDGRUPOESTRUTURA,
                                            label: `${item.CODGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`
                                        }
                                    })]}
                                onChange={(e) => setSubGrupoSelecionado(e)}
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

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={atualizarEstilo}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />

            </form>
        </Fragment>
    )
}