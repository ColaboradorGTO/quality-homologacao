import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";

export const useAtivarCancelar = ({ usuarioLogado, handleClick, status }) => {
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

    const handleAtivar = async (IDADIANTAMENTOSALARIO, STATIVO) => {
        
        Swal.fire({
            title: `Tem Certeza que Deseja ${status ? 'Ativar' : 'Cancelar'} o Adiantamento?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger',
                actions: 'swal-button-spacing'
            },
            buttonsStyling: false,
            didOpen: () => {
                const style = document.createElement('style');
                style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
                document.head.appendChild(style);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const putData = {
                        IDADIANTAMENTOSALARIO: parseInt(IDADIANTAMENTOSALARIO),
                        STATIVO: 'True' 
                    }
                    const response = await put('/atualizacao-adiantamento-status', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    let textoFuncao = status ? 'FINANCEIRO/ATIVADO O ADIANTAMENTO SALARIAL' : 'FINANCEIRO/CANCELADO O ADIANTAMENTO SALARIAL';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível'
                    }
                    
                    await post('/log-web', postData)
                    
                    
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });
                    handleClick()
                    return response.data;
                } catch (error) {
                    const putData = {
                        IDADIANTAMENTOSALARIO: parseInt(IDADIANTAMENTOSALARIO),
                        STATIVO: 'True' 
                    }
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = status ? 'FINANCEIRO/ERRO ADIANTAMENTO SALARIAL' : 'FINANCEIRO/ERRO CANCELAR ADIANTAMENTO SALARIAL';
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível'
                    }
 
                    const responsePost = await post('/log-web', postData)
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });

                    return responsePost.data;
                }
            }
        })
    }

    const handleCancelar = async (IDADIANTAMENTOSALARIO, STATIVO) => {
    
        Swal.fire({
            title: `Tem Certeza que Deseja ${status ? 'Ativar' : 'Cancelar'} o Adiantamento?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger',
                actions: 'swal-button-spacing'
            },
            buttonsStyling: false,
            didOpen: () => {
                const style = document.createElement('style');
                style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
                document.head.appendChild(style);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const putData = {
                        IDADIANTAMENTOSALARIO: parseInt(IDADIANTAMENTOSALARIO),
                        STATIVO: 'False' 
                    }
                    const response = await put('/atualizacao-adiantamento-status', putData)
                    const textDados = JSON.stringify(putData)
                    let textoFuncao = status ? 'FINANCEIRO/ATIVADO O ADIANTAMENTO SALARIAL' : 'FINANCEIRO/CANCELADO O ADIANTAMENTO SALARIAL';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: textDados,
                        IP: ipUsuario
                    }
                    
                    const responsePost = await post('/log-web', postData)
                    
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });
                    
                    handleClick()
                    return responsePost.data;
                } catch (error) {
                    let textoFuncao = status ? 'FINANCEIRO/ERRO ADIANTAMENTO SALARIAL' : 'FINANCEIRO/ERRO CANCELAR ADIANTAMENTO SALARIAL';

                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: '',
                        IP: ipUsuario
                    }

                    const responsePost = await post('/log-web', postData)
                    Swal.fire({
                        title: status ? 'Ativado' : 'Cancelado',
                        text: `Adiantamento ${status ? 'ativado' : 'cancelado'} com Sucesso`,
                        icon: 'success'
                    });

                    return responsePost.data;
                }
            }
        })
    }

    return { handleAtivar, handleCancelar, ipUsuario };
}