import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

export const useConferirTodasFaturas = ({
    optionsModulos, 
    usuarioLogado, 
    handleClick,
    selectedItems,
}) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [isSubmitting, setisSubmitting] = useState(true)
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

    const conferirTodas = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Você não tem permissão para alterar a fatura.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        Swal.fire({
            title: 'Deseja confirmar a conferência destas faturas?',
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
                setisSubmitting(true)
                const idsFaturas = selectedItems.map(item => item.IDDETALHEFATURA).join(',');
                const putData = {   
                    IDS_FATURAS: idsFaturas.replace(/(^,|,$)/g, ''),
                    STCONFERIDO: 'True',
                    IDFUNCIONARIO: parseInt(usuarioLogado.id),
                }
        
                try {
        
                    const response = await put('/conferencia-fatura/:id', putData)
             
                    await registrarLogAuditoria({
                        idFuncionario: usuarioLogado?.id,
                        pathFuncao: 'FINANCEIRO/CONFERIR TODAS FATURAS SELECIONADAS',
                        dados: putData
                    })

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
                    await registrarLogAuditoria({
                        idFuncionario: usuarioLogado?.id,
                        pathFuncao: 'FINANCEIRO/ERRO AO CONFERIR TODAS FATURAS SELECIONADAS',
                        dados: putData
                    })
        
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocorreu um erro ao enviar os dados. Por favor, tente novamente.',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal', 
                        },
                    });
                    console.error('Erro Conferir Todas Faturas:', error);
                    return;
                } finally {
                    setisSubmitting(false)
                }
            } else {
                return;
            }
        });
        
    }

    
    return {
        conferirTodas,
        isSubmitting
    }
}