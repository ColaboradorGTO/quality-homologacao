import { useState } from "react"
import { get, post } from "../../../../../api/funcRequest"
import axios from "axios"
import Swal from 'sweetalert2'
import { useQuery } from "react-query"


export const useCadastrarEstruturaMercadologica = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
    const [ipUsuario, setIpUsuario] = useState('');



    const { data: dadosGrupoEstrutura = [], error: errorGrupoEstrutura, isLoading: isLoadingGrupoEstrutura, refetch: refetchGrupoEstrutura } = useQuery(
        'grupoEstrutura',
        async () => {
            const response = await get(`/grupoEstrutura`);

            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]

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


    const cadastrarSubGrupoEstrutura = async () => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar a Estrutura Mercadológica!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        if (descricao == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (subGrupoSelecionado == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo Grupo Cor é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const postData = {
            IDGRUPOESTRUTURA: parseInt(subGrupoSelecionado.value),
            DSSUBGRUPOESTRUTURA: descricao,
            STATIVO: statusSelecionado.value,
            CODSUBGRUPOESTRUTURA: '',
        }
        try {

            const response = await post('/cadastro-sub-grupo-estrutura', postData)

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO DA ESTRUTURA MERCADOLÓGICA';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            await post('/log-web', createtLog)
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

            handleClick();  
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ERRO AO CADASTARA ESTRUTURA MERCADOLÓGICA';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
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
            console.error('Erro ao alterar a Cor:', error);
        }
    }

    return {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosGrupoEstrutura,
        cadastrarSubGrupoEstrutura,

    }
}