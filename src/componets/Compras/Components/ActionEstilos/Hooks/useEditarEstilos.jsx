import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import axios from 'axios';
import { useQuery } from "react-query";


export const useEditarEstilos = ({dadosDetalheEstilos, handleClose, handleClick, usuarioLogado, optionsModulos}) => {
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

    useEffect(() => {
        if (dadosDetalheEstilos) {
            setDescricao(dadosDetalheEstilos[0]?.DS_ESTILOS || '')
            setStatusSelecionado({ value: dadosDetalheEstilos[0]?.STATIVO, label: dadosDetalheEstilos[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
            setSubGrupoSelecionado({ value: dadosDetalheEstilos[0]?.ID_GRUPOESTILOS, label: `${dadosDetalheEstilos[0]?.COD_GRUPOESTILOS} - ${dadosDetalheEstilos[0]?.DS_GRUPOESTILOS}` })
        }
    }, [dadosDetalheEstilos])

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
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar o Estilo!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },

            });
            return;
        }

        const postData = {
            IDVINCESTILOSESTRUTURA: parseInt(dadosDetalheEstilos[0]?.IDVINCESTILOSESTRUTURA),
            IDGRUPOESTRUTURAANTIGA: parseInt(dadosDetalheEstilos[0]?.ID_GRUPOESTILOS),
            IDESTILO: parseInt(dadosDetalheEstilos[0]?.ID_ESTILOS),
            DSESTILO: descricao,
            IDGRUPOESTRUTURA: subGrupoSelecionado.value,
            STATIVO: statusSelecionado.value,
        }
        
        try {

            const response = await put('/listaEstilos/:id', postData)
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS / ATUALIZAÇÃO DE ESTILOS';
            const ip = await getIPUsuario();

            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
            }

            await post('/log-web', createtLog)

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
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS / ERRO AO ATUALIZAR ESTILOS';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
            }

            const responseLog = await post('/log-web', createtLog)


            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao alterar estilo:', error);
            
            handleClick();
            handleClose();
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
        dadosGrupoEstrutura,
        onSubmit
    };
};