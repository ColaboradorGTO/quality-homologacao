import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";


export const useCancelarQuebraCaixa = ({usuarioLogado, optionsModulos, handleClick}) => {
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

    const handleCancelar = async (IDQUEBRACAIXA, status) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
            title: 'Acesso Negado',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para acessar esta funcionalidade.`,
            icon: 'warning',
            timer: 5000,
            customClass: {
                container: 'custom-swal',
            }
            })
            return;
        }
        
        const putData = {  
            IDQUEBRACAIXA: IDQUEBRACAIXA,
            STATIVO: status ? 'True' : 'False'
        }

        try {
            const response = await put('/atualizar-status-quebra', putData)
            
            const textDados = JSON.stringify(putData)
            let textoFuncao = status ? 'FINANCEIRO/ATIVADO QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
            const ipUsuario = await getIPUsuario();
            const postData = {  
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO:  textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }
            
            await post('/log-web', postData)
            Swal.fire({
                title: 'Sucesso',
                text: `Quebra de Caixa ${status ? 'Ativada' : 'Cancelada'} com Sucesso`,
                icon: 'success',
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
            return response.data;

        } catch (error) {

            let textoFuncao = status ? 'FINANCEIRO/ATIVADO QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {  
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO:  textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            const responsePost = await post('/log-web', postData)
            handleClick();
            Swal.fire({
                title: 'Erro',
                text: `Erro ao Tentar ${status ? 'Ativar' : 'Cancelar'} a Quebra de Caixa`,
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data;
        }
    
    }

    return {
        handleCancelar
    }
}