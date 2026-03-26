import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useAtivarCancelar = ({ usuarioLogado, handleClick, status }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual()
        setData(dataAtual);
    }, [])

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

    
    const enviarPedidoCompras = async (IDRESUMOPEDIDO) => {

        try {
            const confirmacao = await Swal.fire({
                title: "Certeza que Deseja Enviar o Pedido para o Dep. Compras?",
                text: "Você não poderá reverter esta ação!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, Enviar",
                cancelButtonText: "Cancelar",
                customClass: {
                    confirmButton: "btn btn-primary btn-lg",
                    cancelButton: "btn btn-danger btn-lg",
                },
            });

            if (!confirmacao.isConfirmed) return;

            const { value: motivo } = await Swal.fire({
                title: "Motivo da Devolução do Pedido?",
                input: "text",
                inputPlaceholder: "Motivo da Devolução do Pedido!",
                width: "25rem",
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Voltar",
                cancelButtonColor: "#3085d6",
                inputValidator: (value) => {
                    if (!value) {
                        return Swal.showValidationMessage("Coloque o Motivo da Devolução do Pedido!");
                    } else if (value.length < 10) {
                        return Swal.showValidationMessage("Motivo muito curto, deve conter no mínimo 10 caracteres!");
                    }
                },
            });

            if (!motivo) return;
            
            setLoading(true);
            
            const putData = {
                IDRESUMOPEDIDO: parseInt(IDRESUMOPEDIDO),
                IDRESPREATIVACAO: parseInt(usuarioLogado.id),
                TXTMOTIVOREATIVACAO: motivo
            };

            const response = await put("/andamentoPedido/:id", putData);
            const textDados = JSON.stringify(putData)
            const textoFuncao = "COMPRASADM/REATIVAR PEDIDO"
            const ipUsuario = await getIPUsuario();

            const postData  = {
                IDFUNCIONARIO: String(usuarioLogado?.id), 
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            // Registra o log da ação
            await post("/log-web", postData);
            
            await Swal.fire({
                icon: "success",
                title: "Pedido Enviado!",
                text: "O pedido foi enviado com sucesso.",
            });
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao =  'COMPRASADM/ERRO AO ENVIAR PEDIDO PARA COMPRAS';
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado?.id), 
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                icon: "error",
                title: "Erro ao Enviar Pedido",
                text: "Não Foi Possível Devolver o Pedido, TENTE NOVAMENTE OU ENTRE EM CONTATO COM O SUPORTE!.",
            });
            return responsePost.data;
        } finally {
            setLoading(false);
        }
    };

    const handleReativarPedido = async (IDRESUMOPEDIDO, STATIVO) => {
        
        
        const putData = {
            IDRESUMOPEDIDO: parseInt(IDRESUMOPEDIDO),
            IDRESPREATIVACAO: parseInt(usuarioLogado.id),
            TXTMOTIVOREATIVACAO: textoCancelaPedido
        }
        
        try {

            Swal.fire({
                title: `Deseja Realmente ${txtAcao} o Pedido?`,
                text: 'Você não poderá reverter a ação!',
                icon: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-danger',
                    actions: 'swal-button-spacing'
                },
                buttonsStyling: false,
            })

            const response = await put('/atualizacao-status-pedido/:id', putData)
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
         
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            
            await post('/log-web', postData)
            
            
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: `Pedido ${msgRetorno} com Sucesso!`,
            });
            handleClick()
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao =  'COMPRAS/ERRO AO ATUALIZAR STATUS DO PEDDIO';
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao atualizar status do pedido, mas o log de erro foi registrado com sucesso.',
            });

            return responsePost.data;
        }
            
        
    }


    return { handleAtivarCancelarPedido };
}