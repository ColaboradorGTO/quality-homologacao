import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { put } from "../../../../../api/funcRequest";


export const useIncluirProduto = ({ usuarioLogado, optionsModulos, handleClick }) => {
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

    const handleIncluirProduto = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: "error",
                title: "Permissão Negada!",
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão.`,
            });
            return;
        }

        const data = {
            IDDETALHEPRODUTOPEDIDO: row.IDDETALHEPRODUTOPEDIDO,
        }

        try {
            const response = await put(`/incluir-produto-avulso/:id`, data);
          
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(data);
            const textFuncao = 'CADASTRO/PRODUTO AVULSO - INCLUINDO NO PDV';
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: 'Produto Avulso incluído no PDV com sucesso.',
            });
            handleClick();

            return response.data;
        } catch (error) {
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(data);
            const textFuncao = 'CADASTRO/PRODUTO AVULSO - ERRO AO INCLUIR NO PDV';
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: 'Ocorreu um erro ao incluir o Produto Avulso no PDV.',
            });
        }
    }

    return { handleIncluirProduto };
}