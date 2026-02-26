import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";

export const useCancelarConciliacaoDeposito = ({ optionsModulos, usuarioLogado, handleClick }) => {
    const [ipUsuario, setIpUsuario] = useState('');

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

    const handleCancelar = async (IDDEPOSITOLOJA) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para cancelar a conciliação do depósito!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        Swal.fire({
            title: 'Tem Certeza que Deseja Cancelar a Conciliação do Depósito?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-success mx-2',
                cancelButton: 'btn btn-danger mx-2',
                loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const putData = {
                        IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                    }

                    const response = await put('/atualizar-deposito-loja/:id', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario()
                    let textoFuncao = 'FINANCEIRO/CANCELADO CONCILIAÇÃO DO DEPOSITO';

                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível',
                    }

                    await post('/log-web', postData)

                    Swal.fire({
                        title: 'Cancelado',
                        text: 'Conciliação do Depósito cancelado com Sucesso',
                        icon: 'success'
                    })
                    handleClick()

                    return response.data;
                } catch (error) {
                    const putData = {
                        IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                    }
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR CONCILIAÇÃO DO DEPOSITO';
                    const ipUsuario = await getIPUsuario()
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível',
                    }

                    const responsePost = await post('/log-web', postData)


                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Erro ao cancelar a conciliação do depósito!',
                        customClass: {
                            container: 'custom-swal',
                        },
                        showConfirmButton: false,
                        timer: 4000
                    });
                    handleClick()
                    return responsePost.data;
                }
            }
        })

    }

    return {
        handleCancelar,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}