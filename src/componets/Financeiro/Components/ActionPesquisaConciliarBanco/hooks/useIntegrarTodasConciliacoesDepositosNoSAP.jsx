import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, } from "../../../../../api/funcRequest";

export const useIntegrarTodasConciliacoesDepositosNoSAP = ({ optionsModulos, usuarioLogado, handleClick }) => {
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            let usuarioIP = ipWhoisData?.ip;

            if (!usuarioIP) {
            const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
            usuarioIP = ipifyData?.ip;
            }

            setIpUsuario(usuarioIP);
            return usuarioIP;
        } catch (error) {
            console.error("Erro ao buscar IP:", error);
            return null;
        }
    };

    const handleSubmit = async (IDDEPOSITOLOJA) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para integrar a conciliação do depósito!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000 
            });
            return
        }

        Swal.fire({
            title: 'Certeza que Deseja Integrar todas as Conciliações de Depósitos deste período no SAP?',
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

                const response = await post('/deposito-integracao', putData)         
                const textDados = JSON.stringify(putData)
                const ipUsuario = await getIPUsuario()
                let textoFuncao = 'FINANCEIRO/INTEGRACAO TODAS CONCILIAÇÕES DE DEPOSITOS'
            
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario.ip,
                }
        
                await post('/log-web', postData)
            
                Swal.fire({
                    title: 'Cancelado', 
                    text: 'Conciliação de Depósitos Integrada no SAP com Sucesso!', 
                    icon: 'success',
                    customClass: {
                        container: 'custom-swal',
                    },
                    showConfirmButton: false,
                    timer: 4000
                })
                handleClick()
          
                return response.data;
            } catch (error) {
                const putData = {  
                    IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                }
                const textDados = JSON.stringify(putData)
                const ipUsuario = await getIPUsuario()
                let textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR CONCILIAÇÃO DO DEPOSITO';
                
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario.ip,
                }
        
                const responsePost = await post('/log-web', postData)

          
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao cancelar ao conciliar os depósitos no SAP!',
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
        handleSubmit,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}