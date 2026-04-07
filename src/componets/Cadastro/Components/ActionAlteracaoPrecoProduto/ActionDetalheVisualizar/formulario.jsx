import { useEffect, useState } from "react";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { toFloat } from "../../../../../utils/toFloat";

export const Formulario = ({
    handleClose,
    dadosVisualizarDetalhe,
    optionsModulos,
    usuarioLogado
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [authEdit, setAuthEdit] = useState(true);
    const [dataCriacao, setDataCriacao] = useState('');
    const [dataAlteracao, setDataAlteracao] = useState('');
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [disabled, setDisabled] = useState(true);

    const optionsStatus = [
        { value: 'True', label: 'CANCELADA' },
        { value: 'False', label: 'EM ESPERA' },
        { value: 'FINALIZADA', label: 'FINALIZADA' }
    ]


    useEffect(() => {
        if (dadosVisualizarDetalhe?.length > 0) {
            const dados = dadosVisualizarDetalhe[0]?.alteracaoPreco || {};

            const stCancelado = dados.STCANCELADO;
            const stExecutado = dados.STEXECUTADO === "True" ? "FINALIZADA" : "False";
            const dtAlterAgendada = new Date(dados.AGENDAMENTOALTERACAO);
            const dataHoraHoje = new Date();

            // Verifica se é permitido editar
            const authEditCheck = stExecutado === "False" && stCancelado !== "True" && dtAlterAgendada.getTime() > dataHoraHoje.getTime();
            setAuthEdit(authEditCheck);
            if (!authEditCheck && (stExecutado != 'False' || stCancelado == 'True')) {
                setDisabled(true);
            } else {
                setDisabled(false);
                setStatusSelecionado('FINALIZADA')
            }
            // Determina o status da alteração
            const stAlteracao = stCancelado === "False" && stExecutado === "FINALIZADA" ? stExecutado : stCancelado;

            // Verifica se há correspondência no optionsStatus
            const selectedOption = optionsStatus.find(opt => opt.value === stAlteracao) || null;

            setStatusSelecionado(selectedOption); // Define null se não encontrar
            console.log(selectedOption, 'selectedOption');
            console.log(statusSelecionado, 'statusSelecionado');
            console.log(dadosVisualizarDetalhe, "dadosVisualizarDetalhe");
        }
    }, [dadosVisualizarDetalhe]);

    return (
        <form action="">
            <div className="form-group">
                <div className="row">
                    <div className="col-sm-3 col-xl-3">
                        <InputFieldModal
                            label={"Data Criação *"}
                            type={"text"}

                            id={"dtCreateListaPreco"}
                            value={dadosVisualizarDetalhe[0]?.alteracaoPreco.DATACRIACAOFORMATADA}
                            onChangeModal={""}
                            readOnly={true}
                            {...register("dtCreateListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}

                        />
                    </div>
                    <div className="col-sm-3 col-xl-3">
                        <InputFieldModal
                            label={"Data Alteração *"}
                            type={"date"}

                            id={"dtAlterListaPreco"}
                            value={dadosVisualizarDetalhe[0]?.alteracaoPreco.AGENDAMENTOALTERACAOFORMATADO}
                            onChangeModal={""}
                            readOnly={disabled}
                            {...register("dtAlterListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}

                        />
                    </div>

                    <div className="col-sm-3 col-xl-3">

                        <label htmlFor="">Status Alteração *</label>
                        <Select
                            value={statusSelecionado}
                            options={optionsStatus}
                            onChange={(selectedOption) => setStatusSelecionado(selectedOption)}
                            isDisabled={disabled}
                        />
                    </div>
                    <div className="col-sm-3 col-xl-2">
                        <InputFieldModal
                            label={"Alteração "}
                            type={"text"}
                            styleInputFieldModal={{textAlign: 'center'}}
                            id={"idListaPreco"}
                            value={dadosVisualizarDetalhe[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                            onChangeModal={""}
                            readOnly={true}
                            {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}

                        />
                    </div>
                </div>


                <div className="row mt-4">
                    <div className="col-sm-2 col-xl-3">
                        <InputFieldModal
                            label={"Lista Alvo de Alteração *"}
                            type={"text"}
                            id={"nomeListaPreco"}
                            value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOMELISTA || dadosVisualizarDetalhe[0]?.alteracaoPreco.NOEMPRESA}
                            onChangeModal={""}
                            readOnly={true}
                            {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}

                        />
                    </div>

                    <div className="col-sm-3 col-xl-2">
                        <InputFieldModal
                            label={"Qtd. Produtos"}
                            type={"text"}
                            styleInputFieldModal={{textAlign: 'center'}}
                            id={"idListaPreco"}
                            value={toFloat(dadosVisualizarDetalhe[0]?.alteracaoPreco.QTDITENS)}
                            onChangeModal={""}
                            readOnly={true}
                            {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}

                        />
                    </div>
                    <div className="col-sm-6 col-xl-6">
                        <InputFieldModal
                            label={"Responsável "}
                            type={"text"}
                           
                            id={"nomeListaPreco"}
                            value={dadosVisualizarDetalhe[0]?.alteracaoPreco.NOFUNCIONARIO}
                            onChangeModal={""}

                            {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                            readOnly={true}
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