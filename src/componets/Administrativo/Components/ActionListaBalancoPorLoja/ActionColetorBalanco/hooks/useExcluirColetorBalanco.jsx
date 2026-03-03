import { useState } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { put } from "../../../../../../api/funcRequest";

export const useExcluirColetorBalanco = ({ optionsModulos, usuarioLogado }) => {
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

    const handleClickExcluir = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Você não tem permissão para acessar esta funcionalidade.',
                icon: 'warning',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return;
        }

        const data = {
            IDRESUMOBALANCO: row.IDRESUMOBALANCO,
            NUMEROCOLETOR: row.NUMEROCOLETOR
        }

        try {

            Swal.fire({
                title: 'Deseja excluir o Coletor?',
                text: 'Caso exclua, será necessário subir novamente pelo PDV!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                  customClass: {
                    container: 'custom-swal',
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'O coletor foi excluido com sucesso.',
                        icon: 'success',
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal',
                        }
                    })

                    const response = await put(`/coletor-balanco/:id`, data)
                    const ipUsuario = await getIPUsuario();
                    let textoFuncao = 'ADMINISTRATIVO/EXCLUIR COLETOR BALANÇO';
                    const postData = {
                        IDFUNCIONARIO: String(usuarioLogado.id),
                        PATHFUNCAO: textoFuncao,
                        DADOS: JSON.stringify(data),
                        IP: ipUsuario || 'IP não disponível'
                    }

                    await post('/log-web', postData)


                    return response.data;
                }
            })
        } catch (error) {
            let textoFuncao = 'ADMINISTRATIVO/ERRO AO EXCLUIR COLETOR BALANÇO';
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: JSON.stringify(data),
                IP: ipUsuario || 'IP não disponível'    
            }

            const responsePost = post('/log-web', postData)


            Swal.fire({
                title: 'Erro',
                text: 'Não foi possível excluir o coletor.',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            console.error('Erro ao excluir coletor:', error);
            return responsePost.data;

        }
    }

    return {
        handleClickExcluir
    }
}
