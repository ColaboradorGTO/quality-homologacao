import { useState } from "react";
import Swal from "sweetalert2";
import { get, post  } from "../../../../../api/funcRequest";
import axios from 'axios';
import { useQuery } from "react-query";


export const useCadastrarEstilos = ({ handleClose, handleClick, usuarioLogado, optionsModulos }) => {
    const [descricao, setDescricao] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState([])
    const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
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
        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            let usuarioIP = ipWhoisData?.ip;

            if (!usuarioIP) {
                const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
                usuarioIP = ipifyData?.ip;
            }

            setIpUsuario(usuarioIP);
            return usuarioIP;
        } catch (error) {
            console.error("Erro ao buscar IP:", error);
            return null;
        }
    };

    const cadastrarEstilo = async () => {

        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para cadastrar o Estilo!`,
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

        const putData = [{
            DSESTILO: descricao,
            IDESTILO: null,
            IDGRUPOESTRUTURAANTIGA: null,
            IDVINCESTILOSESTRUTURA: null,
            IDGRUPOESTRUTURA: Number(subGrupoSelecionado?.value),
            STATIVO: statusSelecionado?.value,
        }]
        try {

            const response = await post('/criarlistaEstilos', putData)
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS / CADASTRO DE ESTILOS';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            const responseLog = await post('/log-web', createtLog)

            Swal.fire({
                position: 'top-end',
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
              
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS / CADASTRO DE ESTILOS';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            const responseLog = await post('/log-web', createtLog)
            Swal.fire({
                position:   'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao cadastrar estilo:', error);
            return responseLog.data;
        }
    }




    return {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        usuarioLogado,
        ipUsuario,
        dadosGrupoEstrutura,
        getIPUsuario,
        optionsStatus,
        cadastrarEstilo
    };
};