import { useState } from "react"
import { get, post, } from "../../../../../api/funcRequest"
import axios from "axios"
import Swal from 'sweetalert2'
import { useQuery } from "react-query"


export const useCadastrarGrupoEstruturaMercadologica = ({handleClose, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
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
    
    
    const cadastrarGrupoEstrutura = async () => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Você não tem permissão para criar um novo grupo de estrutura.',
                showConfirmButton: false,
                timer: 1500
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

        const postData = {
            DSGRUPOESTRUTURA: descricao,
            IDGRUPOEMPRESARIAL: usuarioLogado?.IDGRUPOEMPRESARIAL,
            STATIVO: statusSelecionado.value,
        }

        try {
            const response = await post('/cadastro-grupoEstrutura', postData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO DO GRUPO DA ESTRUTURA MERCADOLÓGICA';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            await post('/log-web', createtLog)
            handleClick();
            handleClose();

            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ERRO AO CADASTRAR GRUPO DA ESTRUTURA MERCADOLÓGICA';
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
            console.error('Erro ao Cadastrar:', error);
        }
    }

    return {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        dadosGrupoEstrutura,
        cadastrarGrupoEstrutura,
    
    }
}