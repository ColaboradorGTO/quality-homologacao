import Swal from "sweetalert2"
import { post } from "../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getDataAtual } from "../../../../../utils/dataAtual"


export const useCadastroUnidadeMedida = ({ handleClose, usuarioLogado, refetchListaUnidadesMedidas, optionsModulos }) => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
    const [sigla, setSigla] = useState("")
    const [dataCampo, setDataCampo] = useState("")
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataCampo(dataAtual);
    })

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
     

    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]


    const handleCadastro = async () => {

        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Informação!',
                text: `${usuarioLogado?.NOFUNCIONARIO} \n Você não tem permissão para alterar este registro.`,
                icon: 'info',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(descricao === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(sigla === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo sigla é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
        }

        const postData = {
            DSUNIDADE: descricao,
            DSSIGLA: sigla,
            DTCADASTRO: dataCampo,
            DTULTATUALIZACAO: dataCampo,
            STATIVO: statusSelecionado.value,
        }
        
        try {

            const response = await post('/cadastrarUnidadeMedida', postData)
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
            let textoFuncao = 'COMPRAS/CADASTRO DE UNIDADES DE MEDIDAS';
            const ipUsuario = await getIPUsuario();
            const createLog = {
                IDUSUARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            const responseLog = await post('/log-web', createLog)
            handleClose();
            refetchListaUnidadesMedidas();
            return responseLog.data;
    
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textoFuncao = 'COMPRAS/ERRO AO CADASTRAR UNIDADES DE MEDIDAS';
            const ipUsuario = await getIPUsuario();
            const createLog = {
                IDUSUARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            const responseLog = await post('/log-web', createLog)
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
            console.log(error)
            return responseLog.data;
        }      
    }

    return {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        sigla,
        setSigla,
        dataCampo,
        usuarioLogado,
        ipUsuario,
        optionsStatus,
        handleCadastro,
    }
}