import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { getDataAtual, getHoraAtual } from "../../../../../utils/dataAtual";
import { toFloat } from "../../../../../utils/toFloat";

export const useCreateAjusteExtrato = ({ handleClose, optionsModulos, usuarioLogado, empresaSelecionada }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [vrDebito, setVrDebito] = useState('');
    const [dsHistorico, setDsHistorico] = useState('');
    const [vrCredito, setVrCredito] = useState('');
    const [dataMovimento, setDataMovimento] = useState('')
    const [horaMovimento, setHoraMovimento] = useState('')

    useEffect(() => {
        const dataAtual = getDataAtual()
        const horaAtual = getHoraAtual()
        setDataMovimento(dataAtual)
        setHoraMovimento(horaAtual)
    }, [usuarioLogado]);

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

    const submit = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False'){
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
        const postData = {
            IDEMPRESA: parseInt(empresaSelecionada),
            HISTORICO: dsHistorico,
            VRDEBITO: toFloat(vrDebito),
            VRCREDITO: toFloat(vrCredito),
            STATIVO: 'True',
            STCANCELADO: 'False',
            IDOPERADOR: parseInt(usuarioLogado.id),
            DATACADASTRO: dataMovimento + ' ' + horaMovimento,
        }

        try {

            const response = await post('/ajuste-extrato', postData)
            const dados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/AJUSTE EXTRATO CRIADO`,
                DADOS: dados,
                IP: ipUsuario || 'IP não disponível'
            }
    
            await post('/log-web', postLogData)

            Swal.fire({
                position: 'center',
                title: 'Sucesso',
                text: 'Ajuste criado com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose()
            return response.data
        } catch (error) {
            const dados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO CRIAR AJUSTE EXTRATO`,
                DADOS: dados,
                IP: ipUsuario || 'IP não disponível'
            }
    
            const responsePost = await post('/log-web', postLogData)
            handleClose()

             Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao Criar Ajuste de Extrato!',
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
        horaMovimento,
        dsHistorico,
        vrDebito,
        vrCredito,
        setVrDebito,
        setVrCredito,
        setDsHistorico,
        setDataMovimento,
        setHoraMovimento,
        submit,
    }
}