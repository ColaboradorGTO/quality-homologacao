import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";

export const useUpdateStatusDeposito = ({ handleClick, optionsModulos, usuarioLogado, empresaSelecionada }) => {
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

    const handleCancelar = async (IDDEPOSITOLOJA, STCANCELADO) => {
        
        if (optionsModulos[0]?.ALTERAR == 'True') {
            try {

                Swal.fire({
                    title: 'Certeza que Deseja Cancelar o Depósito?',
                    text: 'Você não poderá reverter o cancelamento!',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const dados = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            STCANCELADO: 'True',
                        };

                        const response = await put("/deposito-loja-atualizacao-status/:id", dados);


                        const textdados = JSON.stringify(dados);
                        const textoFuncao = 'FINANCEIRO/CANCELAR DEPOSITO VIA EXTRATO';
                        const ipUsuario = await getIPUsuario();
                        const dadosLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textdados,
                            IP: ipUsuario
                        };

                        await post("/log-web", dadosLog);
                        handleClick();
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Depósito cancelado com sucesso.',
                            icon: 'success',
                            customClass: {
                                container: 'custom-swal',
                            },
                        });
                        return response.data;
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        const dados = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            STCANCELADO: 'True',
                        };
                        const textdados = JSON.stringify(dados);
                        const ipUsuario = await getIPUsuario();
                        const textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR DEPOSITO VIA EXTRATO';
                        const dadosLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textdados,
                            IP: ipUsuario
                        };
                        await post("/log-web", dadosLog);
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao Cancelar Depósito.',
                            icon: 'error',
                            customClass: {
                                container: 'custom-swal',
                            },
                        });
                    }
                });
            } catch (error) {
                console.error('Erro: ', error);
            }
        } else {
            Swal.fire({
                title: 'Atenção!',
                text: 'Você não tem permissão para cancelar este registro.',
                icon: 'warning',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

   
    return {
        handleCancelar
    };

}