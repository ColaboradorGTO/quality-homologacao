import { useState } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { post, put } from "../../../../../../api/funcRequest";


export const useUpdateQTDProduto = ({ optionsModulos, usuarioLogado }) => {
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

    const onSubmit = async (IDDETALHEBALANCO, TOTALCONTAGEMGERAL) => {
        
        const putData = {
            IDDETALHEBALANCO: IDDETALHEBALANCO,
            TOTALCONTAGEMGERAL: TOTALCONTAGEMGERAL,
        }

        try {
            const response = await put('/detalhe-balanco/:id', putData)
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


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

            return response.data;
        } catch (error) {
            let textoFuncao = 'ADMNISTRATIVO/ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(putData)
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Alterar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data;
        }
    }

    const onSubmitExcluir = async (IDDETALHEBALANCO, TOTALCONTAGEMGERAL) => {

        const putData = {
            IDDETALHEBALANCO: IDDETALHEBALANCO,
            TOTALCONTAGEMGERAL: 0,
        }

        try {
            const response = await put('/detalhe-balanco/:id', putData)
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';


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

            return response.data;
        } catch (error) {
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMNISTRATIVO/ERRO AO ALTERAR QUANTIDADE DE PRODUTO NO BALANÇO';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', postData)
            Swal.fire({
                title: 'Erro ao Alterar',
                icon: 'error',
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data;
        }
    }

    return {
        onSubmit,
        onSubmitExcluir
    }
}
