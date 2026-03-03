import Swal from "sweetalert2"
import { post } from "../../../../../api/funcRequest"
import { useEffect, useState } from "react"
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
                timer: 5000,
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
                IP: ipUsuario || 'Indisponível'
            }
            
            await post('/log-web', createLog)
            handleClose();
            refetchListaUnidadesMedidas();
            return response.data;
    
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textoFuncao = 'COMPRAS/ERRO AO CADASTRAR UNIDADES DE MEDIDAS';
            const ipUsuario = await getIPUsuario();
            const createLog = {
                IDUSUARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
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
        onSubmit
    }
}