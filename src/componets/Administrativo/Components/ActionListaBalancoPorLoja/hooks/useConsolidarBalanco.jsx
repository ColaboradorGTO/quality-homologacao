import Swal from "sweetalert2"
import { put, post, get } from "../../../../../api/funcRequest"
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";

export const useConsolidarBalanco = ({ 
    optionsModulos, 
    usuarioLogado, 
    dadosBalanco,
    handleClose,
    handleClickResumoBalanco 
}) => {
    const [ipUsuario, setIpUsuario] = useState('');


    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
        const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
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
    
    const { data: dadosBalancoConsolidado = [], error: error, isLoading: isLoading, refetch: refetchConsolidado } = useQuery(
        'consolidar-balanco',
        async () => {
          const response = await get(`/consolidar-balanco?idResumo=${dadosBalanco[0]?.IDRESUMOBALANCO}`);
          return response.data;
        },
        { enabled: false, staleTime: 60 * 60 * 1000, }
    );

    const handleConsolidar = async () => {
        const putData = {
            IDRESUMOBALANCO: Number(dadosBalanco[0]?.IDRESUMOBALANCO),
            IDEMPRESA: Number(dadosBalanco[0]?.IDEMPRESA),
        }

        try {

            const response = await put('/consolidar-balanco/:id', putData)


            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/CONSOLIDAR BALANCO';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)

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
            refetchConsolidado();
            return response.data;

        } catch (error) {
            let textoFuncao = 'ADMINISTRATIVO/ERRO AO CONSOLIDAR BALANCO';
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(putData)
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            const response = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Atualizar!',
                text: 'Erro ao Atualizar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao Tentar Consolidar o Balanço: ', error);
            return response.data;
        }
    }

    return {
        dadosBalancoConsolidado,
        handleConsolidar
    }
}