import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { getDataAtual, getHoraAtual } from "../../../../../utils/dataAtual.js";
import { useQuery } from "react-query";

export const useCreateDeposito = ({ handleClose, optionsModulos, usuarioLogado, empresaSelecionada }) => {
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

    useEffect(() => {
        const dataAtual = getDataAtual()
        const horaAtual = getHoraAtual()
        setData(dataAtual)
        setHora(horaAtual)

    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
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

    const submit = async () => {
        if(optionsModulos[0]?.CRIAR == 'False'){
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
            IDUSR: parseInt(usuarioLogado.id),
            IDCONTABANCO: parseInt(contaSelecionada?.value),
            DTDEPOSITO: data + ' ' + hora,
            DTMOVIMENTOCAIXA: dataMovimento + ' ' + horaMovimento,
            DSHISTORIO: historico,
            NUDOCDEPOSITO: documento,
            VRDEPOSITO: parseFloat(vrDeposito),
            STATIVO: 'True',
            STCANCELADO: 'False',
            DSPATHDOCDEPOSITO: '',
            DSMOTIVOCANCELAMENTO: '',
            IDUSRCACELAMENTO: '',
        }
      
        try {
        
            const response = await post('/cadastrar-deposito-loja', postData)
            const textDados = JSON.stringify(postData)
            let textoFuncao = 'FINANCEIRO/CADASTRO DEPOSITO PELO EXTRATO DE CONTAS';
            const ipUsuario = await getIPUsuario();

            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
    
            await post('/log-web', postLogData)

            Swal.fire({
                position: 'center',
                title: 'Sucesso',
                text: 'Deposito criado com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                container: 'custom-swal',
                }
            })
            handleClose()
            return response.data
        } catch (error) {
            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            const postLogData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO CRIAR DEPOSITO PELO EXTRATO DE CONTAS`,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
    
            const response = await post('/log-web', postLogData)
            handleClose()

             Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao Criar Deposito de Extrato!',
                customClass: {
                container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000 
            });

            return response.data
            
        }

    }

    return {
        dataMovimento,
        hora,
        historico,
        vrDeposito,
        documento,
        contaSelecionada,
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