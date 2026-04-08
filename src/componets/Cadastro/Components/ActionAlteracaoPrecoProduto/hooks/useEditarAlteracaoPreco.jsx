import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";


export const useEditarAlteracaoPreco = ({
    handleClose,
    dadosVisualizarDetalhe,
    optionsModulos,
    usuarioLogado
}) => {
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [stAlteracaoImediato, setStAlteracaoImediato] = useState(false)
    const [authEdit, setAuthEdit] = useState(true);
    const [dataCriacao, setDataCriacao] = useState('');
    const [dataAlteracao, setDataAlteracao] = useState('');
    const [qtdProdutos, setQtdProdutos] = useState(0);
    const [funcionario, setFuncionario] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [ipUsuario, setIpUsuario] = useState('');

    const optionsStatus = [
        { value: 'True', label: 'CANCELADA' },
        { value: 'False', label: 'EM ESPERA' },
        { value: 'FINALIZADA', label: 'FINALIZADA' }
    ]

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ifconfig.me:", error);
        }

        if (!usuarioIP) {
        try {
            const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
            usuarioIP = ipifyData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipify.org:", error);
        }
        }
        setIpUsuario(usuarioIP);
        return usuarioIP;
    };

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

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar alteração de preço!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const putData = {
            IDRESUMOALTERACAOPRECO: dadosVisualizarDetalhe[0]?.IDRESUMOALTERACAOPRECO,
            STAGENDAMENTOIMEDIATO: stAlteracaoImediato,
            STAGENDAMENTOPERSONALIZADO: !stAlteracaoImediato,
            DTAGENDAMENTOPERSONALIZADO: dataAlteracao,
            STATIVO: statusSelecionado?.value
        }

        try {
            const response = await put('/fornecedor/:id', putData)
            
                        
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO/EDITAR ALTERACAO DE PRECO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            await post('/log-web', createtLog)


            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO/ERRO AO EDITAR ALTERACAO DE PRECO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            await post('/log-web', createtLog)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao editar alteração de preço:', error);
        }
    }
}