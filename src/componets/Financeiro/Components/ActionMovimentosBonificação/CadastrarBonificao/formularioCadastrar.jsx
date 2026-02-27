import { Fragment } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useCadastrarBonificaoca } from "../hooks/useCadastrarBonificacao"
import Select from 'react-select'
import { useForm } from "react-hook-form"
import { mascaraValor } from "../../../../../utils/mascaraValor"

export const FormularioCadastrar = ({ 
    handleClose, 
    usuarioLogado, 
    funcionarioSelecionado, 
    setFuncionarioSelecionado, 
    optionsModulos,
    optionsFuncionarios 
}) => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const {
        funcionario,
        setFuncionario,
        valorBonificao,
        setValorBonificacao,
        tipoSelecionado,
        txtHistorico,
        OptionsStatus,
        setTipoSelecionado,
        setTxtHistorico,
        onSubmit,
    } = useCadastrarBonificaoca({handleClose, usuarioLogado, optionsModulos});

   
    const handleValorBonificacaoChange = (e) => {
        const valor = e.target.value.replace(/,/g, '.');
        setValorBonificacao(valor);
    };

    return (
        <Fragment>
            <form >

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-12">
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                options={optionsFuncionarios?.map((item) => {
                                    return { value: item.IDFUNCIONARIO, label: ` ${item.NOFUNCIONARIO}` }
                                })}
                                defaultValue={funcionario}
                                onChange={(e) => setFuncionario(e.value)}
                                // value={funcionarioSelecionado}
                            />

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <label htmlFor="">Tipo</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                // value={tipoSelecionado}
                                options={OptionsStatus}
                                defaultValue={tipoSelecionado}
                                onChange={(e) => setTipoSelecionado(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                label="Valor (R$)"
                                value={mascaraValor(valorBonificao)}
                                onChangeModal={handleValorBonificacaoChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="">
                    
                    <InputFieldModal
                        id="VrValorDesconto"
                        type="text"
                        className="form-control input"
                        label="Histórico"
                        placeholder="digite o histórico do depósito..."
                        value={txtHistorico}
                        onChangeModal={(e) => setTxtHistorico(e.target.value)}
                    />
                 
                </div>
                
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleSubmit(onSubmit)}
                    textButtonCadastrar={"Cadastrar"}
                    corCadastrar={"success"}
                />
            </form>
        </Fragment>
    )
}