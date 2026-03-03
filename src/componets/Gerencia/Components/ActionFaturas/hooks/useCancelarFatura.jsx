import Swal from "sweetalert2"
import { post, put } from "../../../../../api/funcRequest"
import { useState } from "react";
import axios from "axios";


export const useCancelarFatura = ({
    dadosCancelarFatura,
    usuarioLogado,
    optionsModulos,
    refetchListaFaturas,
    handleClose
}) => {

    const [motivo, setMotivo] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');

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

    const onSubmit = async () => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para cancelar a fatura!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const putData = {
            IDDETALHEFATURA: parseInt(dadosCancelarFatura[0]?.IDDETALHEFATURA),
            TXTMOTIVOCANCELAMENTO: motivo,
            STCANCELADO: 'True',
            IDUSRCACELAMENTO: parseInt(usuarioLogado.id),
        }

        try {

            const response = await put('/atualizar-detalhe-fatura-loja', putData)
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'GERENCIA/ATUALIZAR FATURA CANCELAMENTO';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP NÃO DISPONIVEL'
            }

            await post('/log-web', postData)

            Swal.fire({
                title: 'Atualização',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose()
            refetchListaFaturas()
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'GERENCIA/ERRO AO ATUALIZAR FATURA CANCELAMENTO';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP NÃO DISPONIVEL'
            }

            await post('/log-web', postData)

            Swal.fire({
                title: 'Cadastro',
                text: 'Erro ao realizar a atualização',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao Atualizar:', error);
        }
    }

    return {
        motivo,
        setMotivo,
        onSubmit
    }
}