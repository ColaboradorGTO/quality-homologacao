import { useState } from "react";
import axios from "axios";
import { post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";

export const useConsultarNFe = ({dadosSefaz, usuarioLogado, optionsModulos }) => {
    const [dadosNFe, setDadosNFe] = useState(null);
    const [ipUsuario, setIpUsuario] = useState("");
    
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

    const onSubmitNFe = async () => {
        const postData = {
            idVenda: dadosSefaz.IDVENDA,
        };

        try {

            const response = await post(`/consultar-nfe`, postData)

            const textDados = JSON.stringify(postData)
            const textoFuncao = 'CONTABILIDADE / CONSULTA NFe SEFAZ';

            const ipUsuario = await getIPUsuario();
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createData)

            Swal.fire({
                title: 'Atualização',
                text: 'Atualizção Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })


            return response.data;
        } catch (error) {
            const textoFuncao = 'CONTABILIDADE / ERRO AO CONSULTAR NFe SEFAZ';
            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', createData)

            console.error("Erro ao consultar NFFe:", error);
            return responsePost.data;
        }
    }

    return {
        onSubmitNFe,
    }
}