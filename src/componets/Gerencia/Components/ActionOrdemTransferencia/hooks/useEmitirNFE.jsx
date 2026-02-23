import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";

export const useEmitirNFE = ({ usuarioLogado, optionsModulos, handleClick }) => {
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

    const handleFaturarOT = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para Emitir NFE.',
                icon: 'warning',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        Swal.fire({
            icon: 'question',
            title: `Deseja Realmente Emitir NFE?`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonColor: '#FD1381',
            confirmButtonColor: '#7352A5',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                container: 'custom-swal',
            },
            timer: 3000,
            preConfirm: async () => {
                const putData = {
                    IDRESUMOOT: Number(row.IDRESUMOOT),
                    IDEMPRESAORIGEM: Number(row.IDEMPRESAORIGEM), 
                    IDSTATUSOT: 3,
                    NUTOTALVOLUMES: 0,
                    TPVOLUME: "",
                };

                try {
                    const response = await put('/resumo-ordem-transferencia/:id', putData);

                    const textDados = JSON.stringify(putData);
                    const textoFuncao = `GERENCIA/NFE Emitida com sucesso!`;
                    const ipUsuario = await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    }

                    await post('/log-web', createData);

                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'NFE Emitida com Sucesso',
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
                    const textoFuncao = 'GERENCIA/ERRO AO EMITIR NFE';
                    const ipUsuario = await getIPUsuario();
                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    };

                    await post('/log-web', createData);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao emitir NFE',
                        text: error.message,
                        timer: 5000,
                    });
                    handleClick();
                    throw error;
                }
            }
        })
    };

    return {
        handleFaturarOT
    }
}