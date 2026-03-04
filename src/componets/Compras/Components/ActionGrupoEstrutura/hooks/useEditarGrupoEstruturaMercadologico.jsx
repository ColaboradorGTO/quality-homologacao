import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { put, post } from "../../../../../api/funcRequest"

export const useEditarGrupoEstruturaMercadologica = ({ dadosDetalheGrupo, handleClose, usuarioLogado, optionsModulos, handleClick  }) => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
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


    useEffect(() => {

        if (dadosDetalheGrupo) {
            setDescricao(dadosDetalheGrupo[0]?.DSGRUPOESTRUTURA)
            setStatusSelecionado({ value: dadosDetalheGrupo[0]?.STATIVO, label: dadosDetalheGrupo[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
        }
    }, [dadosDetalheGrupo])

    const onSubmit = async () => {

        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar um grupo de estrutura.`,
                showConfirmButton: false,
                timer: 5000
            });
            return;
        }

        const postData = {
            IDGRUPOESTRUTURA: Number(dadosDetalheGrupo[0]?.IDGRUPOESTRUTURA),
            IDGRUPOEMPRESARIAL: dadosDetalheGrupo[0]?.IDGRUPOEMPRESARIAL,
            DSGRUPOESTRUTURA: descricao,
            STATIVO: statusSelecionado.value,
        }

        try {
            const response = await put('/grupo-estrutura/:id', postData)
            
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DO GRUPO DA ESTRUTURA MERCADOLÓGICA';
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
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DO GRUPO DA ESTRUTURA MERCADOLÓGICA';
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
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        onSubmit
    }
}