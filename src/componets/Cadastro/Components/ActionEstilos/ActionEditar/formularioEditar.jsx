import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { useForm } from "react-hook-form"
import { useEstilos } from "../../../hooks/useEstilos";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";

export const FormularioEditarEstilos = ({dadosDetalheEstilos }) => {
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
        atualzarEstilo,
    } = useEstilos(dadosDetalheEstilos)


    // console.log(descricao, 'formulario')
    // console.log(subGrupoSelecionado)
      
    return (
        <Fragment>
            <form action="">
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
                                 options={dadosGrupoEstrutura.map((item) => {
                              
                                    return {
                                        value: Number(item.IDGRUPOESTRUTURA),
                                        label: `${item.CODGRUPOESTRUTURA} - ${item.DSGRUPOESTRUTURA}`
                                    }
                                })}
                                value={dadosGrupoEstrutura.find(option => Number(option.value) == subGrupoSelecionado.value)}
                                onChange={(selectedOption) => {setSubGrupoSelecionado(selectedOption?.value)}}

                            />
                              {/* <Select

                                closeMenuOnSelect={false}
                                options={optionsEmpresas.map((item) => ({
                                value: item.IDEMPRESA,
                                label: item.NOFANTASIA
                                }))}
                                value={optionsEmpresas.find((option) => option.value === empresaSelecionada)}
                                onChange={(selectedOption) => { setEmpresaSelecionada(selectedOption?.value) }}
                                /> */}
                        </div>
                        <div className="col-sm-6 col-xl-3">

                            <label htmlFor="">Situação *</label>
                            <Select
                                options={optionsStatus.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={optionsStatus.find(option => option.value === statusSelecionado.value)}
                                onChange={(e) => setStatusSelecionado(e.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <h3 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h3>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={'handleClose'}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={atualzarEstilo}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />

            </form>
        </Fragment>
    )
}