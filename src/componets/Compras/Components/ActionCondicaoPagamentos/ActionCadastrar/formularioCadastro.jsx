import { Fragment, useState } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { useCadastrarCondicaoPagamento } from "../hooks/useCadastrarCondicaoPagamento";

export const FormularioCadastro = ({ 
    handleClose,
    usuarioLogado,
    optionsModulos,
    handleClick 
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        parceladoSelecionado,
        setParceladoSelecionado,
        numeroParcelas,
        setNumeroParcelas,
        dias1Pagamento,
        setDias1Pagamento,
        qtdDiasPagamento,
        setQtdDiasPagamento,
        tipoDocumentoSelecionado,
        setTipoDocumentoSelecionado,
        optionsStatus,
        optionsParcelado,
        dadosTipoDocumentos,
        cadastrar,
    } = useCadastrarCondicaoPagamento({handleClose, usuarioLogado, optionsModulos, handleClick});
    return (
        <Fragment>
            <form onSubmit={handleSubmit(cadastrar)}>
                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-lg-6">

                            <InputFieldModal
                                label={"Descrição *"}
                                type={"text"}
                                id={"desccondpag"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}
                                {...register("desccondpag", { required: "Campo obrigatório Informe a Descrição da condição de Pagamento", })}
                                required={true}
                                placeholder={"Informe a Descrição da condição de Pagamento"}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <label htmlFor="">Parcelado *</label>
                            <Select
                                options={optionsParcelado.map((item) => {
                                    return {
                                        value: item.value,
                                        label: item.label
                                    }
                                })}
                                value={parceladoSelecionado}
                                onChange={(e) => setParceladoSelecionado(e)}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <InputFieldModal
                                label={"Número Parcelas *"}
                                type={"number"}
                                id={"numeroparcelacondpag"}
                                value={numeroParcelas}
                                onChangeModal={(e) => setNumeroParcelas(e.target.value)}
                                {...register("numeroparcelacondpag", { required: "Campo obrigatório Informe o Número de Parcelas", })}
                                required={true}
                                readOnly={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <InputFieldModal
                                label={"Dias 1 Pagamento"}
                                type={"number"}
                                id={"dia1condpag"}
                                value={dias1Pagamento}
                                {...register("dia1condpag", { required: "Campo obrigatório Informe o Número de Dias para o 1º Pagamento", })}
                                required={true}
                                onChangeModal={(e) => setDias1Pagamento(e.target.value)}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">

                            <InputFieldModal
                                label={"QTD Dias Pagamento"}
                                type={"number"}
                                id={"qtdcondpag"}
                                value={qtdDiasPagamento}
                                {...register("qtdcondpag", { required: "Campo obrigatório Informe o Número de Dias para o Pagamento", })}
                                required={true}
                                onChangeModal={(e) => setQtdDiasPagamento(e.target.value)}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-6">

                            <label htmlFor="">Tipo Documentos</label>
                            <Select
                                options={dadosTipoDocumentos.map((item) => {
                                    return {
                                        value: item.IDTPDOCUMENTO,
                                        label: `${item.IDTPDOCUMENTO} - ${item.DSTPDOCUMENTO}`
                                    }
                                })}
                                value={tipoDocumentoSelecionado}
                                onChange={(e) => setTipoDocumentoSelecionado(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">

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


                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={cadastrar}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}   