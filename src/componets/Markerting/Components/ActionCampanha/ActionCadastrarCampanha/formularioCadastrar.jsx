import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from "react-select"
import { useForm } from "react-hook-form"
import { useCadastrarCampanha } from "./hooks/useCadastrarCampanha"

export const FormularioCadastrarCampanha = ({ handleClose, optionsModulos, usuarioLogado }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        descricao,
        setDescricao,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        marcaSelecionada,
        setMarcaSelecionada,
        empresaSelecionada,
        setEmpresaSelecionada,
        percentDesconto,
        setPercentDesconto,
        optionsMarcas,
        optionsEmpresas,
        onSubmit
    } = useCadastrarCampanha({ optionsModulos, usuarioLogado, handleClose });
    
    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <InputFieldModal
                                label={"Descrição da Campanha"}
                                type="text"
                                id={"dsCampanha"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}
                                {...register("dsCampanha", { required: "Campo obrigatório Informe a Descrição", })}
                            />

                            {errors.dsCampanha && <span className="text-danger">{errors.dsCampanha.message}</span>}
                        </div>

                        <div className="col-sm-6 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Data Início"}
                                type="date"
                                id={"dtInicio"}
                                value={dataInicio}
                                onChangeModal={(e) => setDataInicio(e.target.value)}
                                {...register("dtInicio", { required: "Campo obrigatório Informe a Data Início", })}
                            />
                            {errors.dtInicio && <span className="text-danger">{errors.dtInicio.message}</span>}
                        </div>
                        <div className="col-sm-6 col-md-3 col-xl-3">
                            <InputFieldModal
                                label={"Data Fim"}
                                type="date"
                                id={"dtFim"}
                                value={dataFim}
                                onChangeModal={(e) => setDataFim(e.target.value)}
                                {...register("dtFim", { required: "Campo obrigatório Informe a Data Fim", })}
                            />
                            {errors.dtFim && <span className="text-danger">{errors.dtFim.message}</span>}
                        </div>

                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-sm-6 col-xl-6">
                        <label className="form-label" htmlFor={""}>Por Marca</label>
                        <Select
                            closeMenuOnSelect={false}
                            options={optionsMarcas.map((item) => ({
                                value: item.IDGRUPOEMPRESARIAL,
                                label: item.GRUPOEMPRESARIAL
                            }
                            ))}
                            value={optionsMarcas.find(option => option.value === marcaSelecionada)}
                            onChange={(e) => setMarcaSelecionada(e.value)}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">
                        <label className="form-label" htmlFor={""}>Por Empresa</label>
                        <Select
                            closeMenuOnSelect={false}
                            options={optionsEmpresas.map((item) => ({
                                value: item.IDEMPRESA,
                                label: item.NOFANTASIA
                            }
                            ))}
                            isMulti
                            defaultValue={[empresaSelecionada]}
                            // Mudança no campo de seleção de empresas
                            onChange={(selectedOptions) => setEmpresaSelecionada(selectedOptions.map(option => option.value))}


                        />
                    </div>

                </div>
                <div className="row mt-4">
                    <div className="col-sm-6 col-md-6 col-xl-6">
                        <InputFieldModal
                            label={"Percentual de Desconto"}
                            type="text"
                            id={"percentDesconto"}
                            value={percentDesconto}
                            onChangeModal={(e) => setPercentDesconto(e.target.value)}
                            {...register("percentDesconto", { required: "Campo obrigatório Informe o Percentual de Desconto", })}
                        />
                        {errors.percentDesconto && <span className="text-danger">{errors.percentDesconto.message}</span>}
                    </div>
                </div>

            </form>


            <FooterModal
                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Atualizar"}
                onClickButtonConfirmar={onSubmit}
                corConfirmar={"success"}

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}