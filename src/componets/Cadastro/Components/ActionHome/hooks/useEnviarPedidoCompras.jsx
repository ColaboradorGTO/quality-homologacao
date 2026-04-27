import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useEnviarPedidoCompras = () => {
    const [loading, setLoading] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        const usuarioArmazenado = localStorage.getItem('usuario');
    
        if (usuarioArmazenado) {
          try {
            const parsedUsuario = JSON.parse(usuarioArmazenado);
            setUsuarioLogado(parsedUsuario);;
          } catch (error) {
            console.error('Erro ao parsear o usuário do localStorage:', error);
          }
        } else {
          navigate('/');
        }
      }, [navigate]);
    
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


    const enviarPedidoCompras = async (IDPEDIDO) => {

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
           
            const dados = {
                IDANDAMENTO: parseInt(15),
                TXTOBSDEVPEDIDO: motivo.toUpperCase(),
                IDRESUMOPEDIDO: parseInt(IDPEDIDO),
            };

            const response = await put("/andamentoPedido/:id", dados);

            const postData  = {
                IDFUNCIONARIO: usuarioLogado?.id, 
                PATHFUNCAO: "CADASTRO/ENVIAR PEDIDO PARA COMPRAS",
                DADOS: JSON.stringify(dados),
                IP: ipUsuario
            }
            // Registra o log da ação
            const responsePost = await post("/log-web", postData);
            
            await Swal.fire({
                icon: "success",
                title: "Pedido Enviado!",
                text: "O pedido foi enviado com sucesso.",
            });
           
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro ao Enviar Pedido",
                text: "Não Foi Possível Devolver o Pedido, TENTE NOVAMENTE OU ENTRE EM CONTATO COM O SUPORTE!.",
            });
        } finally {
            setLoading(false);
        }
    };

    return { enviarPedidoCompras, loading };
};
