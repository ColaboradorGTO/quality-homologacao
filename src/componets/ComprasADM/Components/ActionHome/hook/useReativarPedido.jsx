import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useReativarPedido = ({ usuarioLogado, optionsModulos, handleClick }) => {
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

    
    const handleReativarPedido = async (IDRESUMOPEDIDO) => {

        try {
            const confirmacao = await Swal.fire({
                title: `Certeza que Deseja Reativar o Pedido(${IDRESUMOPEDIDO}) ?`,
                text: "Você não poderá reverter esta ação!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                customClass: {
                    confirmButton: "btn btn-primary btn-lg",
                    cancelButton: "btn btn-danger btn-lg",
                },
            });

            if (!confirmacao.isConfirmed) return;

            const { value: motivo } = await Swal.fire({
                title: "Motivo da Reativação do Pedido?",
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
                        return Swal.showValidationMessage("Adicione o Motivo da Reativação Com no Mínimo 10 Caracteres!");
                    } else if (value.length > 200) {
                        return Swal.showValidationMessage("Motivo da Reativação Está Muito Grande, Abrevie!");
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

            const response = await put("/reativar-pedido/:id", putData);
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
                title: "Pedido Reativado!",
                text: "Reativação Realizada Com Sucesso!",
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return response.data;
        } catch (error) {
            const putData = {
                IDRESUMOPEDIDO: parseInt(IDRESUMOPEDIDO),
                IDRESPREATIVACAO: parseInt(usuarioLogado.id),
                TXTMOTIVOREATIVACAO: motivo
            };
            const textDados = JSON.stringify(putData)
            let textoFuncao =  'COMPRASADM/ERRO AO REATIVAR PEDIDO';
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
                title: "Erro ao Reativar Pedido",
                text: "Não Foi Possível Reativar o Pedido!",
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return responsePost.data;
        } 
    };

 

    return { handleReativarPedido };
}