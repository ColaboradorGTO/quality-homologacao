import { useEffect, useState } from "react"
import { post, put } from "../../../../../api/funcRequest"
import Swal from 'sweetalert2'
import axios from "axios"


export const useEditarCategoriaPedido = ({dadosDetalheCategoriaPedido, handleClose, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tipoCategoriaSelecionado, setTipoCategoriaSelecionado] = useState('')
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

    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]

    const optionsTipoCategoria = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALCADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
    ]

    useEffect(() => {
        setStatusSelecionado({value: dadosDetalheCategoriaPedido[0]?.STATIVO, label: dadosDetalheCategoriaPedido[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setDescricao(dadosDetalheCategoriaPedido[0].DSCATEGORIAPEDIDO)
        setTipoCategoriaSelecionado({value: dadosDetalheCategoriaPedido[0]?.TIPOPEDIDO , label: dadosDetalheCategoriaPedido[0]?.TIPOPEDIDO})
    }, [dadosDetalheCategoriaPedido])


    const handleEditar = async () => {

        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar uma Categoria de Pedido!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
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

        const putData = {
            IDCATEGORIAPEDIDO: parseInt(dadosDetalheCategoriaPedido[0].IDCATEGORIAPEDIDO),
            DSCATEGORIAPEDIDO: descricao,
            TIPOPEDIDO: tipoCategoriaSelecionado.value,
            STATIVO: statusSelecionado.value,
        }

        try {

            const response = await put('/categoriaPedidos/:id', putData)

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

            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DE CATEGORIA DE PEDIDO';
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
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS/ERRO AO ALTERAR CATEGORIA DE PEDIDO';
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
            console.error('Erro ao alterar categoria pedido:', error);
        }
    }

    return {
        optionsStatus,
        optionsTipoCategoria,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        tipoCategoriaSelecionado,
        setTipoCategoriaSelecionado,
        handleEditar
    }
}