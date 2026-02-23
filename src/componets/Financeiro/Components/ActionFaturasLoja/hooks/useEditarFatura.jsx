import { useEffect, useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useEditarFatura = ({ dadosDetalheFaturaCaixa, optionsModulos, handleClose, usuarioLogado }) => {
    const [horarioAtual, setHorarioAtual] = useState('');
    const [despesaSelecionada, setDespesaSelecionada] = useState(null);
    const [valorFatura, setValorFatura] = useState('');
    const [codAutorizacao, setCodAutorizacao] = useState('');
    const [codPix, setCodPix] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [stPixSelecionado, setStPixSelecionado] = useState('')
    const [empresaSelecionada, setEmpresaSelecionada] = useState('');
    const [caixa, setCaixa] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipwho.is:", error);
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
        if (dadosDetalheFaturaCaixa.length > 0) {
            setEmpresaSelecionada(dadosDetalheFaturaCaixa[0].NOFANTASIA);
            setCaixa(`${dadosDetalheFaturaCaixa[0]?.IDDETALHEFATURA} - ${dadosDetalheFaturaCaixa[0]?.DSCAIXA} - ${dadosDetalheFaturaCaixa[0].NUCODAUTORIZACAO} `);
            setCodAutorizacao(dadosDetalheFaturaCaixa[0].NUCODAUTORIZACAO);
            setCodPix(dadosDetalheFaturaCaixa[0].NUAUTORIZACAO);
            setValorFatura(dadosDetalheFaturaCaixa[0].VRRECEBIDO);
            setStPixSelecionado({ value: dadosDetalheFaturaCaixa[0].STPIX, label: dadosDetalheFaturaCaixa[0].STPIX ? 'SIM' : 'NÃO' });
            setStatusSelecionado({ value: dadosDetalheFaturaCaixa[0].STCANCELADO, label: dadosDetalheFaturaCaixa[0].STCANCELADO ? 'CANCELADO' : 'ATIVO' });
        }

    }, [dadosDetalheFaturaCaixa]);


    useEffect(() => {
        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setHorarioAtual(formattedTime);
    }, []);



    const onSubmit = async (data) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Você não tem permissão para alterar a fatura.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const putData = {
            IDDETALHEFATURA: parseInt(dadosDetalheFaturaCaixa[0].IDDETALHEFATURA),
            NUCODAUTORIZACAO: codAutorizacao,
            VRRECEBIDO: parseFloat(valorFatura),
            NUAUTORIZACAO: codPix,
            STPIX: stPixSelecionado?.value,
            STCANCELADO: statusSelecionado?.value,
        }

        try {
            
            const response = await put('/atualizarFatura/:id', putData)
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ALTERAÇÃO DE FATURA`,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            })

            handleClose();
            return response.data;
        } catch (error) {
            
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO ALTERAR FATURA`,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)


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
            console.error('Erro Alterar Fatura:', error);
            return responsePost.data;
        }
    }

    const OptionsStatus = [
        { id: 0, value: "True", label: "CANCELADO" },
        { id: 1, value: "False", label: "ATIVO" },
    ]
    const OptionsPIX = [
        { id: 0, value: "True", label: "SIM" },
        { id: 1, value: "False", label: "NÃO" },
    ]

    return {
        valorFatura,
        despesaSelecionada,
        caixa,
        empresaSelecionada,
        codAutorizacao,
        codPix,
        statusSelecionado,
        stPixSelecionado,
        OptionsStatus,
        OptionsPIX,
        setCodAutorizacao,
        setCodPix,
        setStatusSelecionado,
        setStPixSelecionado,
        setValorFatura,
        setEmpresaSelecionada,
        setCaixa,
        onSubmit

    }
}