import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";

export const useMigrarTodasDespesasSAP = ({optionsModulos, usuarioLogado, selectedItems, handleClick}) => {
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

    
    const handleMigrarDespesa = async (data) => {
        if (optionsModulos[0]?.CRIAR !== 'True') {
            Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Acesso Negado!',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar esta despesa.`,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
                container: 'custom-swal',
            }
            });
            return;
        }

        Swal.fire({
            title: 'Deseja Integrar Estas Despesas no SAP?',
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
                
                const idsDespesas = selectedItems.map(item => Number(item.IDDESPESASLOJA));
                const putData = {
                    IDDESPESASLOJA: idsDespesas,
                    IDFUNCIONARIO: parseInt(usuarioLogado.id),
                }
        
            
                try {
        
                    const response = await post('/integrar-despesa', putData)
                
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/INTEGRAR DESPESAS`,
                        DADOS: textDados,
                        IP: ipUsuario || 'Indisponível'
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
        
                    handleClick();
                    return response.data;
                } catch (error) {
                    const textDados = JSON.stringify(putData)
                    const ipUsuario = await getIPUsuario();
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: `FINANCEIRO/ERRO AO INTEGRAR DESPESA`,
                        DADOS: textDados,
                        IP: ipUsuario || 'Indisponível'
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
                    console.error('Erro Integrar Despesa:', error);
                    return responsePost.data;
                }
            } else {
                return;
            }
        });
        
    }

    
    return {
        handleMigrarDespesa,
    }
}