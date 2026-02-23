import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from "react-select"
import { useForm } from "react-hook-form"
import { useCadastrarPromocao } from "./hooks/useCadastrarPromocao"


export const FormularioCadatrarPromocao = ({ handleClose }) => {
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();
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
        qtdApartir,
        setQtdApartir,
        qtdLimite,
        setQtdLimite,
        vrDescPromo,
        setVrDescPromo,
        vrApartir,
        setVrApartir,
        vrLimite,
        setVrLimite,
        produtoPromocao,
        setProdutoPromocao,
        optionsMarcas,
        optionsEmpresas,
        errorMarcas,
        errorEmpresas,
        isLoadingMarcas,
        isLoadingEmpresas,
        refetchEmpresas,
        onSubmit
    } = useCadastrarPromocao()
    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            onChange={(selectedOptions) => setEmpresaSelecionada(selectedOptions.map(option => option.value))}


                        />
                    </div>

                </div>


                <div className="row mt-4">
                    <div className="col-sm-6 col-md-6 col-xl-6">
                        <InputFieldModal
                            label={"Descrição da Promoção"}
                            type="text"
                            id={"dsCampanha"}
                            value={[descricao]}
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


                <div className="row mt-4">
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"QTD A partir de"}
                            type="text"
                            id={"qtdApartir"}
                            value={qtdApartir}
                            onChangeModal={(e) => setQtdApartir(e.target.value)}
                            {...register("qtdApartir", { required: "Campo obrigatório Informe a Quantidade", })}
                        />
                        {errors.qtdApartir && <span className="text-danger">{errors.qtdApartir.message}</span>}
                    </div>
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"QTD A limite de"}
                            type="text"
                            id={"qtdLimite"}
                            value={qtdLimite}
                            onChangeModal={(e) => setQtdLimite(e.target.value)}
                            {...register("qtdLimite", { required: "Campo obrigatório Informe a Quantidade Limite", })}
                        />
                        {errors.qtdLimite && <span className="text-danger">{errors.qtdLimite.message}</span>}
                    </div>
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"Vr Desconto"}
                            type="text"
                            id={"vrDescPromo"}
                            {...register("vrDescPromo", {
                                required: "Campo obrigatório Informe o Valor do Desconto",
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/,
                                    message: "Informe um valor válido"
                                }
                            })}
                            value={vrDescPromo}
                            onChangeModal={(e) => setVrDescPromo(formatarValor(e.target.value))}
                        />
                        {errors.vrDescPromo && <span className="text-danger">{errors.vrDescPromo.message}</span>}
                    </div>
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"% Desconto"}
                            type="text"
                            id={"percentDesconto"}
                            value={percentDesconto}
                            onChangeModal={(e) => setPercentDesconto(formatarValor(e.target.value))}
                            {...register("percentDesconto", { required: "Campo obrigatório Informe o Percentual de Desconto", })}
                        />
                        {errors.percentDesconto && <span className="text-danger">{errors.percentDesconto.message}</span>}
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"Vr A partir de"}
                            type="text"
                            id={"vrApartir"}
                            value={vrApartir}
                            onChangeModal={(e) => setVrApartir(formatarValor(e.target.value))}
                            {...register("vrApartir", { required: "Campo obrigatório Informe o Valor ", })}
                        />
                        {errors.vrApartir && <span className="text-danger">{errors.vrApartir.message}</span>}
                    </div>
                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <InputFieldModal
                            label={"Vr Limite de"}
                            type="text"
                            id={"vrLimite"}
                            value={vrLimite}
                            onChangeModal={(e) => setVrLimite(formatarValor(e.target.value))}
                            {...register("vrLimite", { required: "Campo obrigatório Informe o Valor ", })}
                        />
                        {errors.vrLimite && <span className="text-danger">{errors.vrLimite.message}</span>}
                    </div>
                    <div className="col-sm-6 col-md-6 col-xl-6">
                        <InputFieldModal
                            label={"Cód.Barras / Nome Produto"}
                            type="text"
                            id={"produtoPromocao"}
                            value={produtoPromocao}
                            onChangeModal={(e) => setProdutoPromocao(e.target.value)}
                            {...register("produtoPromocao", { required: "Campo obrigatório Informe o Cód Barras / Nome do Produto ", })}
                        />
                        {errors.produtoPromocao && <span className="text-danger">{errors.produtoPromocao.message}</span>}
                    </div>
                </div>

            </form>


            <FooterModal
                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Cadastrar"}
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