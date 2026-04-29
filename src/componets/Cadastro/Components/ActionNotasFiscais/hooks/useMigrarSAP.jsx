import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { post, put } from "../../../../../api/funcRequest"


export const useMigrarSAP = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
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


    const onSubmit = async (IDRESUMOENTRADA) => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para migrar uma Nota Fiscal para SAP!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        
        const putData = {
            IDRESUMOENTRADA: IDRESUMOENTRADA
        }

        try {
            
            const response = await put('/nf-avulsa/:id', putData)

            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO / MIGRANDO NOTA FISCAL PARA SAP';
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
                text: 'Nota fiscal migrada para SAP com sucesso.',
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
            let textFuncao = 'CADASTRO / ERRO AO MIGRAR NOTA FISCAL PARA SAP';
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
                title: 'Ocorreu um erro ao migrar a nota fiscal para SAP. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao migrar nota fiscal para SAP:', error);
        }
    }

    return {
        onSubmit,
    }
}

