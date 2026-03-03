import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";

export const useCancelarOT = ({ usuarioLogado, optionsModulos, handleClick }) => {
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

    const handleCancelar = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para cancelar essa OT.',
                icon: 'warning',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
        const putData = {
            IDSTATUSOT: parseInt(2),
            IDRESUMOOT: parseInt(row.IDRESUMOOT),
            IDUSRCANCELAMENTO: parseInt(usuarioLogado?.id),
        };

        Swal.fire({
            icon: 'question',
            title: `Deseja realmente CANCELAR essa OT?`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonColor: '#FD1381',
            confirmButtonColor: '#7352A5',
            confirmButtonText: 'Sim, quero Cancelar!',
            cancelButtonText: 'Não',
            customClass: {
                container: 'custom-swal',
            },
            timer: 3000,
            preConfirm: async () => {
                try {

                    const response = await put('/resumo-ordem-transferencia/:id', putData);
                    const textDados = JSON.stringify(putData);
                    let textoFuncao = 'GERENCIA/CANCELAR OT';
                    const ipUsuario = await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || "IP NÃO DISPONIVEL"
                    };

                    await post('/log-web', createData)
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'OT Cancelada com Sucesso',
                        icon: 'success',
                        confirmButtonColor: '#7352A5',
                        customClass: {
                            container: 'custom-swal',
                        }
                    });
                    handleClick();
                    return response.data;
                } catch (error) {
                    const textDados = JSON.stringify(putData);
                    let textoFuncao = 'GERENCIA/ERRO AO CANCELAR OT';
                    const ipUsuario = await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || "IP NÃO DISPONIVEL"
                    };

                    const responsePost = await post('/log-web', createData)
                    Swal.fire({
                        title: 'Erro',
                        text: 'Ocorreu um erro ao cancelar a OT!',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        customClass: {
                            container: 'custom-swal',
                        }
                    });
                    handleClick();
                    return responsePost.data;
                }
            }
        });
    };

    return {
        handleCancelar,
    }
}