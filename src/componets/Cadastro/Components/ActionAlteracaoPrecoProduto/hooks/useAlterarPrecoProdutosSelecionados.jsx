import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";


export const useAlterarPrecoProdutosSelecionados = ({
    optionsModulos,
    usuarioLogado,
    produtosSelecionados
}) => {
    const [ipUsuario, setIpUsuario] = useState('');


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



    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para editar alteração de preço!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const putData = {
            IDRESUMOALTERACAOPRECO: ''
        }

        try {
            const response = await put('/alteracoes-de-precos-resumo/:id', putData)
            
                        
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO/EDITAR ALTERACAO DE PRECO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            await post('/log-web', createtLog)


            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO/ERRO AO EDITAR ALTERACAO DE PRECO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            await post('/log-web', createtLog)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao editar alteração de preço:', error);
        }
    }

    return {
        onSubmit
    }
}