import { useState } from "react";
import { post } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useIntegrarQuebra = ({optionsModulos, usuarioLogado, selectedItems, handleClick}) => {
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

    const integrarQuebra = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Você não tem permissão para alterar a Quebra de Caixa.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        Swal.fire({
            title: 'Deseja confirmar a Integração da Quebra de Caixa?',
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
            
                const putData = {
                    IDQUEBRACAIXA: parseInt(selectedItems[0]?.IDQUEBRACAIXA),
                    STCONFERIDO: 'True',
                    IDFUNCIONARIO: parseInt(usuarioLogado.id),
                }
        
                try {
        
                    const response = await post('/quebras-de-caixas-integracao', putData)
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/INTEGRAR QUEBRA DE CAIXA SELECIONADA`,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível'
                    }
                    
                    await post('/log-web', postData)
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
                    return response.data;
                } catch (error) {
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/ERRO AO INTEGRAR QUEBRA DE CAIXA SELECIONADA`,
                        DADOS: textDados,
                        IP: ipUsuario || 'IP não disponível'
                    }
                    
                    const responsePost = await post('/log-web', postData)
        
        
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocorreu um erro ao integrar a Quebra de Caixa selecionada. Por favor, tente novamente.',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    });
                    console.error('Erro Integrar Quebra de Caixa:', error);
                    return responsePost.data;
                }
            } else {
                return;
            }
        });
        
    }

    
    return {
        integrarQuebra,
    }
}