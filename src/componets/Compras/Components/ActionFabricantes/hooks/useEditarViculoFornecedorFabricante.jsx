import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import axios from "axios";
import { situacao } from "../../../../../../parceiro.json"

export const useEditarVinculoFornecedorFabricante = ({ handleClose, dadosDetalheFornecedorFabricante, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [fabricante, setFabricante] = useState('')
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
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
        setStatusSelecionado({value: dadosDetalheFornecedorFabricante[0]?.STATIVO, label: dadosDetalheFornecedorFabricante[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setFornecedorSelecionado({value: dadosDetalheFornecedorFabricante[0]?.IDFORNECEDOR, label: `${dadosDetalheFornecedorFabricante[0]?.IDFORNECEDOR} - ${dadosDetalheFornecedorFabricante[0]?.DSFORNECEDOR} - ${dadosDetalheFornecedorFabricante[0]?.CNPJFORNECEDOR} - ${dadosDetalheFornecedorFabricante[0]?.RSFORNECEDOR}`})
        setFabricante(dadosDetalheFornecedorFabricante[0]?.DSFABRICANTE)
      
    }, [dadosDetalheFornecedorFabricante[0]])

 

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar um Vínculo de Fornecedor / Fabricante!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const postData = {
            IDFABRICANTEFORN: parseInt(dadosDetalheFornecedorFabricante[0]?.IDFABRICANTEFORN),
            IDFABRICANTE: parseInt(dadosDetalheFornecedorFabricante[0]?.IDFABRICANTE),
            IDFORNECEDOR: parseInt(fornecedorSelecionado.value),
            STATIVO: statusSelecionado.value,
        }
        try {

            const response = await put('/fornecedor-fabricante/:id', postData)

            
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/VINCULO DE FABRICANTE / FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
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
            let textFuncao = 'COMPRAS/ERRO AO VINCULAR FABRICANTE / FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            
            const response = await post('/log-web', createtLog)

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
            console.error('Erro ao editar vínculo:', error);
            return response.data;
        }
    }

    return {
        statusSelecionado,
        fabricante,
        fornecedorSelecionado,
        setFornecedorSelecionado,
        situacao,
        setStatusSelecionado,
        setFabricante,
        onSubmit,
    }
}