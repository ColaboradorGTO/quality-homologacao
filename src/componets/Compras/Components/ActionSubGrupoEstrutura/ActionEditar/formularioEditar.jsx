import { Fragment } from "react"

import { useEditarEstruturaMercadologica } from "../hooks/useEditarEstruturaMercadologica"
import Select from 'react-select';
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";

export const FormularioEditar = ({  
    handleClose, 
    dadosDetalheSubGrupo,  
    usuarioLogado,
    optionsModulos,
    handleClick  
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosGrupoEstrutura,
        atualzarSubGrupoEstrutura,
    
    } = useEditarEstruturaMercadologica({ handleClose, dadosDetalheSubGrupo,  usuarioLogado, optionsModulos, handleClick });

    return (
        <Fragment>
            <form onSubmit={handleSubmit(atualzarSubGrupoEstrutura)}>
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
                <div className="form-group">
                    <h3 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h3>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    // onClickButtonCadastrar={() => console.log('clicou')}
                    onClickButtonCadastrar={atualzarSubGrupoEstrutura}
                    tipoBtnCadastrar={"submit"}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />

            </form>
        </Fragment>
    )
}