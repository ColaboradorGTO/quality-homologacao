import { useEffect, useState } from "react"
import { get, post, put } from "../../../../../api/funcRequest"
import axios from "axios"
import Swal from 'sweetalert2'
import { useQuery } from "react-query"

export const useEditarEstruturaMercadologica = ({
    handleClose, 
    dadosDetalheSubGrupo,  
    usuarioLogado,
    optionsModulos,
    handleClick  
}) => {
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
 
    useEffect(() => {
        if (dadosDetalheSubGrupo) {
            setDescricao(dadosDetalheSubGrupo[0]?.DSSUBGRUPOESTRUTURA)
            setStatusSelecionado({ value: dadosDetalheSubGrupo[0]?.STATIVO, label: dadosDetalheSubGrupo[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
            setSubGrupoSelecionado({ value: dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA, label: `${dadosDetalheSubGrupo[0]?.CODGRUPOESTRUTURA} - ${dadosDetalheSubGrupo[0]?.DSGRUPOESTRUTURA}` })
        }
    }, [dadosDetalheSubGrupo])


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
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão para alterar a Estrutura Mercadológica.`,
                showConfirmButton: false,
                timer: 3500 
            })
            return;
        }
        
        const putData = {
            IDGRUPOESTRUTURAANTIGA: Number(dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA),
            IDGRUPOESTRUTURA: Number(subGrupoSelecionado.value),
            DSSUBGRUPOESTRUTURA: descricao,
            DSSUBGRUPOESTRUTURAFIM: dadosDetalheSubGrupo[0]?.DSSUBGRUPOESTRUTURA.split('-')[1] || '',
            CODSUBGRUPOESTRUTURA: dadosDetalheSubGrupo[0]?.CODSUBGRUPOESTRUTURA,
            IDSUBGRUPOESTRUTURA: Number(dadosDetalheSubGrupo[0]?.IDSUBGRUPOESTRUTURA),
            STATIVO: statusSelecionado.value,
        }

        try {
            
            const response = await put('/sub-grupo-estrutura/:id', putData)
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DA ESTRUTURA MERCADOLÓGICA';
            const ip = await getIPUsuario();
          
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
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
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS/ERRO AO ALTERAR ESTRUTURA MERCADOLÓGICA';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
            }
            
            const responseLog = await post('/log-web', createtLog)

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
            console.error('Erro ao alterar SubGrupo:', error);
            return responseLog.data;
        }
    }

    return {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosDetalheSubGrupo,
        dadosGrupoEstrutura,
        onSubmit
    }
}