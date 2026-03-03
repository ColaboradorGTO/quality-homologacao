import Swal from "sweetalert2"
import { post, put } from "../../../../../../api/funcRequest"
import { useState } from "react";
import axios from "axios";

export const useAlterarQauntidadeProduto = ({ usuarioLogado, optionsModulos }) => {
    const [ipUsuario, setIpUsuario] = useState('')

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

    const handleAlterarQuantidade = async (IDDETALHEBALANCO, TOTALCONTAGEMGERAL) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar a quantidade do produto no Balanço!`,
                icon: 'error',
                showConfirmButton: true,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
        const putData = {
            IDDETALHEBALANCO: IDDETALHEBALANCO,
            TOTALCONTAGEMGERAL: TOTALCONTAGEMGERAL,
        }

        try {
            const response = await put('/detalhe-balanco/:id', putData)

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
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

            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'ADMNISTRATIVO/ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                icon: 'error',
                title: 'Erro ao Atualizar!',
                text: 'Erro ao Atualizar',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })

            return responsePost.data;
        }
    }
    return {
        handleAlterarQuantidade
    }
}