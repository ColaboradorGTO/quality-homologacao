import Swal from "sweetalert2"
import { post, put } from "../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import axios from "axios"
import { getDataAtual } from "../../../../../utils/dataAtual"

export const useEditarUnidadeMedida = ({
    dadosDetalheUnidadeMedida,
    handleClose, 
    usuarioLogado, 
    handleClick, 
    optionsModulos
}) => {
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
     

    useEffect(() => {
        if(dadosDetalheUnidadeMedida.length > 0) {
            setDescricao(dadosDetalheUnidadeMedida[0].DSUNIDADE)
            setSigla(dadosDetalheUnidadeMedida[0].DSSIGLA)
            setStatusSelecionado({ value: dadosDetalheUnidadeMedida[0].STATIVO, label: dadosDetalheUnidadeMedida[0].STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
        }
    }, [dadosDetalheUnidadeMedida])

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO} \n Você não tem permissão para alterar este registro.`,
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const putData = {
            IDUNIDADEMEDIDA: Number(dadosDetalheUnidadeMedida[0].IDUNIDADEMEDIDA),
            DSUNIDADE: descricao,
            DSSIGLA: sigla,
            DTCADASTRO: dataCampo,
            DTULTATUALIZACAO: dataCampo,
            STATIVO: statusSelecionado.value,
        }

        try {

            const response = await put('/unidadeMedida/:id', putData)
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'COMPRAS/CADASTRO DE UNIDADE DE MEDIDAS';
            const ip = await getIPUsuario();
            const createLog = {
                IDUSUARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
            }
            
            await post('/log-web', createLog)

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
            handleClose();
            handleClick();
            return response.data;
    
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'COMPRAS/ERRO AO EDITAR UNIDADES DE MEDIDAS';
            const ip = await getIPUsuario();
            const createLog = {
                IDUSUARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ip || 'Indisponível'
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
            console.log(error, 'error')
            return responseLog.data;
        }      
    }


    return {
        descricao,
        setDescricao,
        sigla,
        setSigla,
        dataCampo,
        statusSelecionado,
        setStatusSelecionado,
        onSubmit

    }
}