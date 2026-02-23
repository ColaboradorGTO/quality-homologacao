import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";


export const useCancelarVenda = ({ 
    optionsModulos, 
    usuarioLogado, 
    handleClose,
    dadosCancelarVenda
}) => {
    const [motivo, setMotivo] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');

    const { data: dadosMotivoDevolucao = [], error: errorMotivoDevolucao, isLoading: isLoadingMotivoDevolucao, refetch: refetchMotivoDevolucao } = useQuery(
    'lista-motivo-devolucao',
    async () => {
        const response = await get(`/lista-motivo-devolucao`);
        return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, }
    );

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

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
            icon: 'warning',
            title: 'Acesso Negado!',
            text: 'Você não tem permissão para alterar a venda vendedor.',
            confirmButtonText: 'OK',
            customClass: {
                container: 'custom-swal',
            },
            });
            return;
        }
    

        const putData = {
            IDVENDA: dadosCancelarVenda?.IDVENDA,
            IDUSUARIOCANCELAMENTO: usuarioLogado.id,
            TXTMOTIVOCANCELAMENTO: motivo,
        }

        try {

            const response = await put('/venda-cancelamento/:id', putData)
            const textDados = JSON.stringify(putData)
            let textFuncao = 'ADMINISTRATIVO/CANCELAMENTO DE VENDAS';
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)

            Swal.fire({
                icon: 'success',
                title: 'Venda Cancelada com Sucesso!',
                text: 'Venda cancelada com sucesso!',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                },
            });

            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textFuncao = 'ADMINISTRATIVO/ERRO CANCELAR VENDA';
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const response = await post('/log-web', postData)

            Swal.fire({
                icon: 'error',
                title: 'Erro ao cancelar a venda!',
                text: 'Erro ao cancelar a venda!',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                },
            });

            return response.data;
        }
    }

    return {
        motivo,
        setMotivo,
        dadosMotivoDevolucao,
        onSubmit,
    }
}
