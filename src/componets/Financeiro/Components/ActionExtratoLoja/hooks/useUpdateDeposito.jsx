import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { toFloat } from "../../../../../utils/toFloat";
import { useQuery } from "react-query";


export const useUpdateDeposito = ({ handleClose, optionsModulos, usuarioLogado, dadosDeposito }) => {
    const [empresa, setEmpresa] = useState('')
    const [data, setData] = useState('')
    const [hora, setHora] = useState('')
    const [contaSelecionada, setContaSelecionada] = useState('')
    const [historico, setHistorico] = useState('')
    const [documento, setDocumento] = useState('')
    const [vrDeposito, setVrDeposito] = useState('')
    const [dataMovimento, setDataMovimento] = useState('')
    const [horaMovimento, setHoraMovimento] = useState('')
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

    const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco } = useQuery(
        'contaBanco',
        async () => {
            const response = await get(`/contaBanco`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
    );

    useEffect(() => {
        if (dadosDeposito) {
            setEmpresa(dadosDeposito[0]?.NOFANTASIA)
            setData(dadosDeposito[0]?.DTDEP)
            setDataMovimento(dadosDeposito[0]?.DTMOVDEP)
            setContaSelecionada({
                value: dadosDeposito[0]?.IDCONTABANCO,
                label: dadosDeposito[0]?.DSCONTABANCO
            })
            setHistorico(dadosDeposito[0]?.DSHISTORIO)
            setDocumento(dadosDeposito[0]?.NUDOCDEPOSITO)
            setVrDeposito(toFloat(dadosDeposito[0]?.VRDEPOSITO))
        }
    }, [])

    const submit = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para criar ajuste de extrato!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(historico == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe o Histórico',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(contaSelecionada == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Conta',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(data == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Data do depósito',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(hora == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Hora',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(vrDeposito == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe o Valor do Depósito',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(dataMovimento == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Data Movimento',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        if(horaMovimento == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Campo obrigatório Informe a Hora Movimento',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        
        const putData = {
            IDDEPOSITOLOJA: parseInt(dadosDeposito[0]?.IDDEPOSITOLOJA),
            IDEMPRESA: parseInt(empresa),
            IDUSR: parseInt(usuarioLogado.id),
            IDCONTABANCO: parseInt(contaSelecionada.value),
            DTDEPOSITO: data + ' ' + hora,
            DTMOVIMENTOCAIXA: dataMovimento + ' ' + horaMovimento,
            DSHISTORIO: historico,
            NUDOCDEPOSITO: documento,
            VRDEPOSITO: parseFloat(vrDeposito),
            STATIVO: 'True',
            STCANCELADO: 'False',
        }
        try {

            const response = await put('/deposito-loja/:id', putData)
            const textDados = JSON.stringify(putData)
            const textoFuncao = 'FINANCEIRO/EDIÇÃO DEPOSITO PELO EXTRATO DE CONTAS';
            const ipUsuario = await getIPUsuario();

            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postLogData)

            Swal.fire({
                position: 'center',
                title: 'Sucesso',
                text: 'Deposito Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            // handleClose()
            return response.data
        } catch (error) {
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO ATUALIZAR DEPOSITO`,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postLogData)
            // handleClose()

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao Atualizar Deposito de Extrato!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });

            return responsePost.data

        }

    }

    return {
        dataMovimento,
        hora,
        historico,
        vrDeposito,
        documento,
        contaSelecionada,
        empresa,
        setVrDeposito,
        setContaSelecionada,
        setDocumento,
        setHistorico,
        setDataMovimento,
        setHora,
        setEmpresa,
        horaMovimento,
        setHoraMovimento,
        data,
        setData,
        dadosContaBanco,
        submit,
    }
}