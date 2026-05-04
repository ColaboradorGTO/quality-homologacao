import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";

export const useCancelarNFEntrada = ({
    handleClick,
    optionsModulos,
    usuarioLogado,

}) => {
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
        if (optionsModulos[0]?.ALTERAR !== 'True') {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para cancelar esta nota fiscal.',
                confirmButtonColor: '#7352A5',
            });
            return;
        }

        const putData = {
            IDRESUMOENTRADA: Number(row.IDRESUMOENTRADA),
        };

        Swal.fire({
            icon: 'question',
            title: `Deseja realmente CANCELAR essa nota fiscal?`,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonColor: '#FD1381',
            confirmButtonColor: '#7352A5',
            confirmButtonText: 'Sim, quero Cancelar!',
            cancelButtonText: 'Não',
            customClass: {
                container: 'custom-swal',
            },

            preConfirm: async () => {
                try {
                    const response = await put('/cancelar-nf-entrada', putData);

                    const textDados = JSON.stringify(putData);
                    let textoFuncao = 'CADASTRO / SUCESSO AO CANCELAR NOTA FISCAL';
                    const ipUsuario = await getIPUsuario();

                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || "indisponivel"
                    };

                    await post('/log-web', createData)

                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'Nota fiscal cancelada com sucesso.',
                        icon: 'success',
                        customClass: {
                            container: 'custom-swal'
                        }
                    });

                    handleClick()

                    return response.data;
                }
                catch (error) {

                    const textDados = JSON.stringify(putData);
                    let textoFuncao = 'CADASTRO / ERRO AO CANCELAR NOTA FISCAL';
                    const ipUsuario = await getIPUsuario();

                    const createData = {
                        IDFUNCIONARIO: String(usuarioLogado?.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || "indisponivel"
                    };

                    const responsePost = await post('/log-web', createData)

                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao cancelar nota fiscal.',
                        icon: 'error',
                        customClass: {
                            container: 'custom-swal'
                        }
                    });

                    return responsePost.data;
                }
            }
        });
    };

    return {
        handleCancelar,
    };
};
