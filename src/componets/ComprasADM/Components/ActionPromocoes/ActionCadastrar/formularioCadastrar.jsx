import { Fragment } from "react"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { useCadastrarPromocaoLoja } from "../hooks/useCadastrarPromocaoLoja";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";

export const FormularioCadastrar = ({ handleClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        descricao,
        setDescricao,
        aplicacaoSelecionada,
        setAplicacaoSelecionada,
        qtdAplicacao,
        setQtdAplicacao,
        valor,
        setValor,
        valorProduto,
        setValorProduto,
        fatorSelecionado,
        setFatorSelecionado,
        valorDesconto,
        setValorDesconto,
        percentual,
        setPercentual,
        aplicacaoSaida,
        setAplicacaoSaida,
        optionsAplicaocao,
        optionsFator,
        handleCadastrar
    } = useCadastrarPromocaoLoja();
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleCadastrar)}>

                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-lg-6">
                            <InputFieldModal
                                label={"Descrição *"}
                                type={"text"}
                                id={"descricao"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}
                                {...register("descricao", { required: "Campo obrigatório Informe a Descrição.", })}
                                required={true}
                                placeholder={"Informe a Descrição da Categoria do Pedido."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <InputFieldModal
                                label={"Data Início *"}
                                type={"date"}
                                id={"dataInicio"}
                                value={dataInicio}
                                onChangeModal={(e) => setDataInicio(e.target.value)}
                                {...register("dataInicio", { required: "Campo obrigatório Informe a Data de Início.", })}
                                required={true}
                                placeholder={"Informe a Data de Início."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <InputFieldModal
                                label={"Data Fim *"}
                                type={"date"}
                                id={"dataFim"}
                                value={dataFim}
                                onChangeModal={(e) => setDataFim(e.target.value)}
                                {...register("dataFim", { required: "Campo obrigatório Informe a Data de Fim.", })}
                                required={true}
                                placeholder={"Informe a Data de Fim."}
                                readOnly={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3 col-md-3 col-lg-3">
                            <label className="form-label" htmlFor="promoaplicst">Aplicação</label>
                            <Select
                                options={optionsAplicaocao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={aplicacaoSelecionada}
                                onChange={(e) => setAplicacaoSelecionada(e)}
                            />
                        </div>
                        <div className="col-sm-3 col-md-3 col-lg-3">

                            <InputFieldModal
                                label={"QTD Apartir De"}
                                type={"text"}
                                id={"qtd"}
                                value={qtdAplicacao}
                                onChangeModal={(e) => setQtdAplicacao(e.target.value)}
                                {...register("qtd", { required: "Campo obrigatório Informe a Quantidade.", })}
                                required={true}
                                placeholder={"0"}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-sm-3 cold-md-3 col-lg-3">
                            <InputFieldModal
                                label={"Valor Produto"}
                                type={"text"}
                                id={"vrAplicao"}
                                value={valor}
                                onChangeModal={(e) => setValor(e.target.value)}
                                {...register("vrAplicao", { required: "Campo obrigatório Informe o Valor.", })}
                                required={true}
                                placeholder={"0"}

                                readOnly={true}
                            />
                        </div>

                        {/* <div className="col-sm-3 col-md-3 col-lg-3">
                            <label className="form-label" htmlFor="promoaplicst">Aplicação Saída*</label>
                            <Select
                                options={optionsAplicaocao.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={aplicacaoSelecionada}
                                onChange={(e) => setAplicacaoSelecionada(e)}
                            />
                        </div> */}

                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3 col-lg-3">
                            <label className="form-label" htmlFor="promofatorst">Fator *</label>
                            <Select
                                options={optionsFator.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={fatorSelecionado}
                                onChange={(e) => setFatorSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-3 col-lg-3">

                            <InputFieldModal
                                label={"Valor Produto"}
                                type={"text"}
                                id={"vrProduto"}
                                value={valorProduto}
                                onChangeModal={(e) => setValorProduto(e.target.value)}
                                {...register("vrProduto", { required: "Campo obrigatório Informe o Valor do Produto.", })}
                                required={true}
                                placeholder={"0"}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-sm-3 col-lg-3">
                            <InputFieldModal
                                label={"Valor Desconto"}
                                type={"text"}
                                id={"vrDesconto"}
                                value={valorDesconto}
                                onChangeModal={(e) => setValorDesconto(e.target.value)}
                                {...register("vrDesconto", { required: "Campo obrigatório Informe o Valor do Desconto.", })}
                                required={true}
                                placeholder={"0"}
                                readOnly={true}
                            />
                        </div>
                        <div className="col-sm-3 col-lg-3">
                            <InputFieldModal
                                label={"Percentual"}
                                type={"text"}
                                id={"percentual"}
                                value={percentual}
                                onChangeModal={(e) => setPercentual(e.target.value)}
                                {...register("percentual", { required: "Campo obrigatório Informe o Percentual.", })}
                                required={true}
                                placeholder={"0"}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="row">
                        <h3 style={{ color: "red" }}>* Campos Obrigatórios *</h3>
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar="secondary"

                    ButtonTypeCadastrar={ButtonTypeModal}
                    textButtonCadastrar={"Cadastrar"}
                    onClickButtonCadastrar={handleCadastrar}
                    corCadastrar="success"
                />
            </form>
        </Fragment>
    )
}