import { useState } from "react";
import { post } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useIntegrarTodasQuebras = ({
    optionsModulos, 
    usuarioLogado, 
    handleClick,
    selectedItems,
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

    const integrarQuebraCaixa = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Você não tem permissão para Integrar as Quebras de Caixa.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        Swal.fire({
            title: 'Deseja Integrar Todas as Quebras de Caixa Selecionadas?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'btn btn-success',
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
                    for(let i = 0; i < selectedItems.length; i++) {
                        const rowData = selectedItems[i];
                        const putData = {   
                            IDQUEBRACAIXA: Number(rowData.IDQUEBRACAIXA),
                            IDFUNCIONARIO: Number(usuarioLogado.id),
                        }

                        const response = await post('/quebras-de-caixas-integracao', putData)
                        const textDados = JSON.stringify(putData)
                        const ipUsuario = await getIPUsuario();
                        const postData = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: `FINANCEIRO/INTEGRAR TODAS QUEBRAS DE CAIXA SELECIONADAS`,
                            DADOS: textDados,
                            IP: ipUsuario || 'IP não disponível'
                        }
                        
                        await post('/log-web', postData)
                    }
        
        
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Atualizado com sucesso!',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    })
        
                    await handleClick();
           
                } catch (error) {
                    const textDados = JSON.stringify(postData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/ERRO AO INTEGRAR TODAS QUEBRAS DE CAIXA SELECIONADAS`,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível'
                    }
                    
                    const responsePost = await post('/log-web', postData)
        
        
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    });
                    console.error('Erro Integrar Todas Quebras de Caixa:', error);
                    return responsePost.data;
                }
            } else {
                return;
            }
        });
        
    }

    return {
        integrarQuebraCaixa,
    }
}