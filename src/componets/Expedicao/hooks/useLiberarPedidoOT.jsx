import Swal from "sweetalert2";
import { useState } from "react";
import { post, put } from "../../../api/funcRequest";

export const useLiberarPedidoOT = ({
    refetchListaConferencia,
    optionsModulos,
    usuarioLogado,
}) => {

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

    const handleLiberarPedido = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para finalizar a OT!`,
                icon: 'error',
                customClass: { container: 'custom-swal' }
            });
            return;
        }

        const confirmacao = await Swal.fire({
            title: 'Deseja Liberar o Pedido?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, quero Liberar o Pedido!',
            cancelButtonText: 'Não',
            customClass: { container: 'custom-swal' }
        });

        if (!confirmacao.isConfirmed) return;

        const putData = {
            IDOPERADORRECEPTOR: usuarioLogado?.id,
            IDSTATUSOT: 10,
            IDRESUMOOT: row.IDRESUMOOT,
        };

        Swal.fire({
            title: 'Liberando o pedido OT, aguarde...',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const response = await put('/resumo-ordem-transferencia/:id', putData);

            const textDados = JSON.stringify(putData);
            let textoFuncao = 'EXPEDICAO/LIBERAÇÃO DO PEDIDO REALIZADA COM SUCESSO';
            const ipUsuario = await getIPUsuario();

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado?.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || "INDISPONÍVEL"
            };

            await post('/log-web', createData);

            Swal.fire({
                title: 'Sucesso!',
                text: 'Pedido Liberado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: { container: 'custom-swal' }
            });

            refetchListaConferencia();

            return response.data;

        } catch (error) {

            console.error('Erro ao finalizar OT:', error);
            const textDados = JSON.stringify(putData);
            let textoFuncao = 'EXPEDICAO/ERRO AO LIBERAR PEDIDO';
            const ipUsuario = await getIPUsuario();

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado?.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || "INDISPONÍVEL"
            };

            const responsePost = await post('/log-web', createData);

            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao liberar o pedido.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: { container: 'custom-swal' }
            });

            return responsePost.data;
        }
    };

    return {
        handleLiberarPedido,
    }
};