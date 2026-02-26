import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useState } from "react";

export const useAtualizarTodosCaixas = ({ usuarioLogado, optionsModulos }) => {
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

    const atualizarDiariaEmpresa = async () => {
        if (optionsModulos[0]?.ALTERAR === 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Você não tem permissão!',
                text: 'Acesso Negado para Atualizar Caixas',
                showConfirmButton: true,
                timer: 3000
            })
            return;
        }

        const putData = {
            STATUALIZA: 'True',
        }

        try {


            const response = await put('/atualizar-todos-caixa', putData)
            const textDados = JSON.stringify(putData);
            let textFuncao = 'INFORMATICA/ATUALIZAR TODOS OS CAIXA';

            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            await post('/log-web', postData)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Caixas atualizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            })

            return response.data;

        } catch (error) {
            const textDados = JSON.stringify(putData);
            let textFuncao = 'INFORMATICA/ATUALIZAR TODOS OS CAIXA';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            await post('/log-web', postData)

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro ao atualizar Caixas!',
                showConfirmButton: false,
                timer: 1500
            });

            console.error('Erro na atualização:', error);
            return;

        }

    }

    return {
        atualizarDiariaEmpresa,
    }
}