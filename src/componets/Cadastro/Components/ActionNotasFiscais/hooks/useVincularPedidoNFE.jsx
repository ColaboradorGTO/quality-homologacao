import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { post, put } from "../../../../../api/funcRequest"


export const useVincularPedidoNFE = ({ 
    handleClose, 
    usuarioLogado, 
    optionsModulos, 
    handleClick,
    selectedIds, 
    setSelectedIds
}) => {
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


    const onSubmit = async (selectedIds) => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para vincular pedidos!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        
        const putData = {
            IDRESUMOPEDIDO: selectedIds?.IDRESUMOPEDIDO,
            IDRESUMOENTRADA: selectedIds?.IDRESUMOENTRADA
        }

        try {
            
            const response = await put('/nf-avulsa/:id', putData)

            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO / VINCULANDO PEDIDOS';
            const ipUsuario = await getIPUsuario();

            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado!',
                text: 'Pedidos vinculados com sucesso.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
   
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO / ERRO AO VINCULAR PEDIDOS';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao vincular os pedidos. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao vincular os pedidos:', error);
        }
    }

    return {
        onSubmit,
    }
}

