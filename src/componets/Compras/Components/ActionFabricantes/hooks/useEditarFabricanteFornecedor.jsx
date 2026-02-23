import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import axios from "axios";
import { getDataHoraAtual } from "../../../../../utils/dataAtual";

export const useEditarFabricanteFornecedor = ({handleClose, dadosDetalheFabricante, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [fabricante, setFabricante] = useState('')
    const [data, setData] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');


    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    },[])

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

    useEffect(() => {
        setStatusSelecionado({value: dadosDetalheFabricante[0]?.STATIVO, label: dadosDetalheFabricante[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setFabricante(dadosDetalheFabricante[0]?.DSFABRICANTE)

    }, [dadosDetalheFabricante])

 

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar o Fabricante!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                }
            })
            return;
        }

        if (fabricante === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Informe o NOME do Fabricante.`,
                type: 'warning',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }


        const postData = {
            IDFABRICANTE: parseInt(dadosDetalheFabricante[0]?.IDFABRICANTE),
            DSFABRICANTE: fabricante,
            DTULTATUALIZACAO: data,
            DTCADASTRO: dadosDetalheFabricante[0]?.DTCADASTRO,
            STATIVO: statusSelecionado.value,
        }
        try {

            const response = await put('/fabricante-fornecedor/:id', postData)

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

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ EDITAR CADASTRO DE FABRICANTE';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createtLog)

            handleClick();
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ ERRO AO EDITAR CADASTRO DE FABRICANTE';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createtLog)
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
            console.error('Erro ao criar categoria pedido:', error);
        }
    }

    return {
        statusSelecionado,
        fabricante,
        data,
        optionsStatus,
        setStatusSelecionado,
        setFabricante,
        onSubmit,
    }
}