import { useEffect, useState } from "react";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { toFloat } from "../../../../../utils/toFloat";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";

export const Formulario = ({
    handleClose,
    dadosVisualizarDetalhe,
    optionsModulos,
    usuarioLogado
}) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [authEdit, setAuthEdit] = useState(true);
    const [dataCriacao, setDataCriacao] = useState('');
    const [dataAlteracao, setDataAlteracao] = useState('');
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [funcionario, setFuncionario] = useState('');
    const [disabled, setDisabled] = useState(true);

    const optionsStatus = [
        { value: 'True', label: 'CANCELADA' },
        { value: 'False', label: 'EM ESPERA' },
        { value: 'FINALIZADA', label: 'FINALIZADA' }
    ]


    useEffect(() => {
        if (dadosVisualizarDetalhe?.length > 0) {
            const dados = dadosVisualizarDetalhe[0]?.alteracaoPreco || {};
            setDataCriacao(dados.DATACRIACAOFORMATADA);
            setDataAlteracao(dados.AGENDAMENTOALTERACAO);
            setQtdProdutos(toFloat(dados.QTDITENS));
            setFuncionario(dados.NOFUNCIONARIO);
    
            const stCancelado = dados.STCANCELADO;
            const stExecutado = dados.STEXECUTADO === "True" ? "FINALIZADA" : "False";
            const dtAlterAgendada = new Date(dados.AGENDAMENTOALTERACAO);
            const dataHoraHoje = new Date();

     
            const authEditCheck = stExecutado === "False" && stCancelado !== "True" && dtAlterAgendada.getTime() > dataHoraHoje.getTime();
            setAuthEdit(authEditCheck);
            if (!authEditCheck && (stExecutado != 'False' || stCancelado == 'True')) {
                setDisabled(true);
            } else {
                setDisabled(false);
                setStatusSelecionado('FINALIZADA')
            }
          
            const stAlteracao = stCancelado === "False" && stExecutado === "FINALIZADA" ? stExecutado : stCancelado;

            const selectedOption = optionsStatus.find(opt => opt.value === stAlteracao) || null;

            setStatusSelecionado(selectedOption);
        }
    }, [dadosVisualizarDetalhe]);

    return (
        <form action="">
            <div className="form-group">
                <div className="row">
                    <div className="col-sm-3 col-xl-3">
                        <Controller
                            name="dtCreateListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data Criação *"}
                                    name="dtCreateListaPreco"
                                    type="datetime"
                                    value={dataCriacao}
                                    onChange={(e) => setDataCriacao(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-3 col-xl-3">
                        <Controller
                            name="dtAlterListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Data Alteração *"}
                                    name="dtAlterListaPreco"
                                    type="datetime-local"
                                    value={dataAlteracao}
                                    onChange={(e) => setDataAlteracao(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                    </div>

                    <div className="col-sm-3 col-xl-3">

                        <label htmlFor="">Status Alteração *</label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="statusAlteracao"
                            value={statusSelecionado}
                            options={optionsStatus}
                            onChange={(selectedOption) => { 
                                setStatusSelecionado(selectedOption)
                                clearErrors("statusAlteracao");
                            }}
                            isDisabled={disabled} 
                        />
                        {errors.statusAlteracao && (
                            <AlertError
                                error={errors.statusAlteracao}
                                onClose={clearErrors}
                                fieldName="statusAlteracao"
                            />
                        )}
                    </div>
                    <div className="col-sm-3 col-xl-2">
                        <Controller
                            name="idListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Alteração *"}
                                    name="idListaPreco"
                                    type="text"
                                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                                    onChange
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-2 col-xl-3">
                        <Controller
                            name="idListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Lista Alvo de Alteração *"}
                                    name="nomeListaPreco"
                                    type="text"
                                    value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOMELISTA || dadosVisualizarDetalhe[0]?.alteracaoPreco.NOEMPRESA}
                                    onChange
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />

                            )}
                        />
                    </div>

                    <div className="col-sm-3 col-xl-2">
                        <Controller
                            name="qtdListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Qtd. Produtos *"}
                                    name="qtdListaPreco"
                                    type="text"
                                    value={qtdProdutos}
                                    onChange={(e) => setQtdProdutos(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                    style={{textAlign: 'center'}}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">
                        <Controller
                            name="responsavelListaPreco"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Responsável *"}
                                    name="responsavelListaPreco"
                                    type="text"
                                    value={funcionario}
                                    onChange={(e) => setFuncionario(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    readOnly={true}
                                />
                            )}
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
                onClickButtonCadastrar
                textButtonCadastrar={"Salvar"}
                corCadastrar={"success"}
                loadingTextCadastrar={"Cadastrando..."}
                autoLoadingCadastrar={true}
            />

        </form>
    )
}