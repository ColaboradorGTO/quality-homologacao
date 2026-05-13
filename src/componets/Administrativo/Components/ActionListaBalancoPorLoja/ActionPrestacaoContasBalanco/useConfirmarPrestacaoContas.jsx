import Swal from "sweetalert2"
import { put, post } from "../../../../../api/funcRequest"
import { useState, useEffect } from "react";
import axios from "axios";


export const useConfirmarPrestacaoContas = ({
    optionsModulos,
    usuarioLogado,
    dadosListaContasBalanco,
    handleClose,
    handleClickResumoBalanco
}) => {
    const [ipUsuario, setIpUsuario] = useState('');


    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

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

    const handleSubmit = async () => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Atenção!',
                text: 'Você não tem permissão para alterar esta prestação de contas.',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    container: 'custom-swal',
                }
            })
            return;
        }

        const putData = {
            IDRESUMOBALANCO: Number(dadosListaContasBalanco[0]?.listagem.IDRESUMOBALANCO),
        }

        try {

            const response = await put('/prestacao-contas-balanco/:id', putData)


            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/CONFIRMAR PRESTAÇÃO DE CONTAS';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualizado com Sucesso!',
                text: 'Atualizado com Sucesso',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClickResumoBalanco()
            handleClose();
            return responsePost.data;

        } catch (error) {
            const putData = {
                IDRESUMOBALANCO: Number(dadosListaContasBalanco[0]?.IDRESUMOBALANCO),
            }

            let textoFuncao = 'ADMINISTRATIVO/ERRO AO CONFIRMAR PRESTAÇÃO DE CONTAS';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: JSON.stringify(putData),
                IP: ipUsuario
            }
            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Atualizar!',
                text: 'Erro ao Atualizar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao Tentar Confirmar a Prestação de Contas: ', error);
            return responsePost.data;
        }
    }

    return {
        handleSubmit
    }
}